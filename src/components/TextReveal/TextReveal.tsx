import React, { useEffect, useState } from 'react';
import styles from './TextReveal.module.css';

interface TextRevealProps {
  text: string;
  delay?: number;
  duration?: number;
  trigger: boolean;
  className?: string;
  type?: 'line' | 'fade-up' | 'blur-in';
}

export const TextReveal: React.FC<TextRevealProps> = ({ 
  text, 
  delay = 0, 
  duration = 2000, 
  trigger,
  className = '',
  type = 'line'
}) => {
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    if (trigger) {
      const timer = setTimeout(() => {
        setShouldAnimate(true);
      }, delay);
      return () => clearTimeout(timer);
    } else {
      setShouldAnimate(false);
    }
  }, [trigger, delay]);

  const transitionStyle = {
    transitionDuration: `${duration}ms`,
  };

  return (
    <div className={`${styles.wrapper} ${className}`}>
      <div 
        className={`${styles.text} ${styles[type]} ${shouldAnimate ? styles.active : ''}`}
        style={transitionStyle}
      >
        {text}
      </div>
    </div>
  );
};
