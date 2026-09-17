import React, { useState, useEffect } from 'react';
import { firebaseConfig } from '../../firebase-config';
import styles from './PrivateNote.module.css';

// Removed localStorage to allow multiple public messages

interface PrivateNoteProps {
  onReplay: () => void;
}

export const PrivateNote: React.FC<PrivateNoteProps> = ({ onReplay }) => {
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);
  const [showReplay, setShowReplay] = useState(false);

  useEffect(() => {
    // Show replay button gracefully after 10 seconds
    const replayTimer = setTimeout(() => {
      setShowReplay(true);
    }, 10000);
    
    return () => clearTimeout(replayTimer);
  }, []);

  const handleSave = async () => {
    if (!note.trim()) return;

    const payload = {
      message: note.trim(),
      timestamp: Date.now()
    };
    
    // Clear the message bar immediately so they can send more
    setNote('');
    setSaved(true); 
    setTimeout(() => setSaved(false), 2000); // Briefly show the "saved" state then return to normal

    if (firebaseConfig.databaseURL) {
      try {
        const baseUrl = firebaseConfig.databaseURL.replace(/\/$/, '');
        await fetch(`${baseUrl}/messages.json`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } catch (err) {
        console.error("Failed to send message to Firebase", err);
      }
    } else {
      // Fallback for local testing without Firebase
      try {
        const channel = new BroadcastChannel('birthday_messages');
        channel.postMessage(payload);
        channel.close();
      } catch (err) {
        // BroadcastChannel not supported in all browsers, ignore gracefully
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <p className={styles.prompt}>Before you leave...</p>
        <h2 className={styles.title}>Write something for yourself.</h2>
        <p className={styles.subtitle}>
          A thought. A dream. Anything you don't want to forget.
        </p>

        <div className={styles.textareaWrapper}>
          <textarea
            className={`${styles.textarea} ${saved ? styles.textareaSaved : ''}`}
            value={note}
            onChange={(e) => {
              setNote(e.target.value);
              setSaved(false);
            }}
            placeholder="This stays here, only for you."
            aria-label="Private note"
            disabled={saved}
          />
          <div className={styles.privacyBadge}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            Saved only on this device
          </div>
        </div>

        <div className={styles.footer}>
          {!saved ? (
            <button 
              className={styles.saveBtn} 
              onClick={handleSave}
              disabled={!note.trim()}
            >
              Keep it
            </button>
          ) : (
            <p className={styles.confirmation}>This one is yours.</p>
          )}
        </div>
      </div>

      {/* Subtle replay button */}
      <div className={`${styles.replayWrapper} ${showReplay ? styles.replayVisible : ''}`}>
        <button className={styles.replayBtn} onClick={onReplay} aria-label="Replay experience">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
            <path d="M3 3v5h5"></path>
          </svg>
          Replay
        </button>
      </div>
    </div>
  );
};
