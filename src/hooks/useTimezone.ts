import { useState, useEffect, useRef } from 'react';
import { CONFIG } from '../config/env';

/**
 * Calculates if we have reached the target date in Damascus time.
 * We convert the device time into a Damascus-equivalent timestamp, 
 * and compare it to the target Damascus timestamp.
 */
export function useTimezone() {
  const [isBirthday, setIsBirthday] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{ days: number, hours: number, minutes: number, seconds: number } | null>(null);

  const targetTimeRef = useRef(new Date(CONFIG.TARGET_DATE).getTime());

  useEffect(() => {
    if (CONFIG.TEST_MODE) {
      setIsBirthday(true);
      return;
    }

    const checkTime = () => {
      const diff = targetTimeRef.current - new Date().getTime();

      if (diff <= 0) {
        setIsBirthday(true);
        setTimeLeft(null);
      } else {
        setIsBirthday(false);
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    checkTime();
    const interval = setInterval(checkTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return { isBirthday, timeLeft };
}
