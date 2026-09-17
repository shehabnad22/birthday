import React, { useEffect, useState } from 'react';
import { TextReveal } from '../TextReveal/TextReveal';
import styles from './FinalMessage.module.css';

interface FinalMessageProps {
  onComplete: () => void;
}

export const FinalMessage: React.FC<FinalMessageProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Choreographed Phase 3
    const sequence = [
      { step: 1, delay: 3000 },  // "One last thing..."
      { step: 2, delay: 8000 },  // "There are people who walk through life quietly..."
      { step: 3, delay: 13000 }, // "But leave a profound mark on everyone they meet."
      { step: 4, delay: 20000 }, // "Your presence matters."
      { step: 5, delay: 24000 }, // "Your dreams matter."
      { step: 6, delay: 32000 }, // "This was made specifically for you."
      { step: 7, delay: 36000 }, // "Happy Birthday, Layal."
      { step: 8, delay: 45000 }  // Exit
    ];

    const timeouts = sequence.map(seq => 
      setTimeout(() => setStep(seq.step), seq.delay)
    );

    const finishTimeout = setTimeout(() => {
      onComplete();
    }, 48000);

    return () => {
      timeouts.forEach(clearTimeout);
      clearTimeout(finishTimeout);
    };
  }, [onComplete]);

  return (
    <div className={styles.container}>
      <div className={`${styles.messageContainer} ${step >= 8 ? styles.fadeOut : ''}`}>
        
        {step >= 1 && step < 2 && (
          <TextReveal 
            text="One last thing..." 
            trigger={step >= 1} 
            delay={0}
            className={`${styles.text} ${step >= 2 ? styles.fadeOutText : ''}`} 
            type="fade-up" 
          />
        )}

        {step >= 2 && step < 4 && (
          <div className={`${styles.textBlock} ${step >= 4 ? styles.fadeOutText : ''}`}>
            {step >= 2 && (
              <TextReveal 
                text="There are people who walk through life quietly..." 
                trigger={step >= 2} 
                delay={0}
                className={styles.text} 
                type="blur-in" 
              />
            )}
            {step >= 3 && (
              <TextReveal 
                text="But leave a profound mark on everyone they meet." 
                trigger={step >= 3} 
                delay={500}
                className={styles.text} 
                type="line" 
              />
            )}
          </div>
        )}

        {step >= 4 && step < 6 && (
          <div className={`${styles.textBlock} ${step >= 6 ? styles.fadeOutText : ''}`}>
            {step >= 4 && (
              <TextReveal 
                text="Your presence matters." 
                trigger={step >= 4} 
                delay={0}
                className={styles.text} 
                type="fade-up" 
              />
            )}
            {step >= 5 && (
              <TextReveal 
                text="Your dreams matter." 
                trigger={step >= 5} 
                delay={500}
                className={styles.text} 
                type="line" 
              />
            )}
          </div>
        )}

        {step >= 6 && (
          <div className={styles.textBlock}>
            {step >= 6 && (
              <TextReveal 
                text="This was made specifically for you." 
                trigger={step >= 6} 
                delay={0}
                className={styles.textSubtle} 
                type="blur-in" 
              />
            )}
            {step >= 7 && (
              <TextReveal 
                text="Happy Birthday, Layal." 
                trigger={step >= 7} 
                delay={1000}
                className={styles.textClimax} 
                type="line" 
                duration={3000}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
