import React, { useEffect } from 'react';
import { firebaseConfig } from '../firebase-config';

export const FirebaseListener: React.FC = () => {
  useEffect(() => {
    const printMessage = (data: { message: string, timestamp: number }) => {
      if (!data || !data.message) return;
      const date = new Date(data.timestamp || Date.now());
      const formattedDate = date.toLocaleString('en-GB', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      }).replace(',', '');

      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💌 NEW BIRTHDAY MESSAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💬 Message: ${data.message}
🕐 Time: ${formattedDate}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    };

    if (!firebaseConfig.databaseURL) {
      // Local fallback for testing across tabs without Firebase
      try {
        const channel = new BroadcastChannel('birthday_messages');
        channel.onmessage = (event) => {
          printMessage(event.data);
        };
        return () => channel.close();
      } catch (err) {
        return;
      }
    }

    const baseUrl = firebaseConfig.databaseURL.replace(/\/$/, '');
    const eventSource = new EventSource(`${baseUrl}/messages.json`);

    eventSource.addEventListener('put', (e) => {
      try {
        const payload = JSON.parse(e.data);
        if (payload.path === '/') return;
        printMessage(payload.data);
      } catch (err) {}
    });

    return () => {
      eventSource.close();
    };
  }, []);

  return null;
};
