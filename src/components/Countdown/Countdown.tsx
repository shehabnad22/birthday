import React from 'react';
import styles from './Countdown.module.css';

interface CountdownProps {
  timeLeft: { days: number, hours: number, minutes: number, seconds: number } | null;
}

export const Countdown: React.FC<CountdownProps> = ({ timeLeft }) => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>LAYAL</h1>
      <p className={styles.subtitle}>Something special is waiting for you.</p>
      
      {timeLeft && (
        <div className={styles.timer}>
          <div className={styles.timeBlock}>
            <span className={styles.number}>{String(timeLeft.days).padStart(2, '0')}</span>
            <span className={styles.label}>DAYS</span>
          </div>
          <div className={styles.timeBlock}>
            <span className={styles.number}>{String(timeLeft.hours).padStart(2, '0')}</span>
            <span className={styles.label}>HOURS</span>
          </div>
          <div className={styles.timeBlock}>
            <span className={styles.number}>{String(timeLeft.minutes).padStart(2, '0')}</span>
            <span className={styles.label}>MINUTES</span>
          </div>
          <div className={styles.timeBlock}>
            <span className={styles.number}>{String(timeLeft.seconds).padStart(2, '0')}</span>
            <span className={styles.label}>SECONDS</span>
          </div>
        </div>
      )}
    </div>
  );
};
