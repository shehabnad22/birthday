import React, { useEffect, useState } from 'react';
import { TextReveal } from '../TextReveal/TextReveal';
import styles from './MedicalDream.module.css';

interface MedicalDreamProps {
  onComplete: () => void;
}

export const MedicalDream: React.FC<MedicalDreamProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Choreographed Medical Dream Phase
    const sequence = [
      { step: 1, delay: 1000 },  // Show ECG
      { step: 2, delay: 3000 },  // "Some dreams are worth holding onto."
      { step: 3, delay: 8000 },  // "One day..."
      { step: 4, delay: 14000 }, // "Dr. Layal" (Climax)
      { step: 5, delay: 22000 }  // Exit
    ];

    const timeouts = sequence.map(seq => 
      setTimeout(() => setStep(seq.step), seq.delay)
    );

    const finishTimeout = setTimeout(() => {
      onComplete();
    }, 25000);

    return () => {
      timeouts.forEach(clearTimeout);
      clearTimeout(finishTimeout);
    };
  }, [onComplete]);

  return (
    <div className={styles.container}>
      <div className={`${styles.medicalBackground} ${step >= 5 ? styles.fadeOut : ''}`}>
        {step >= 1 && (
          <svg 
            className={styles.ecgLine} 
            viewBox="0 0 1000 200" 
            preserveAspectRatio="none"
          >
            <path 
              d="M0,100 L400,100 L420,100 L435,50 L455,150 L470,20 L490,160 L505,100 L530,100 L1000,100" 
              fill="none" 
              stroke="var(--color-accent)" 
              strokeWidth="2"
              className={styles.ecgPath}
            />
          </svg>
        )}
      </div>

      <div className={`${styles.textContainer} ${step >= 5 ? styles.fadeOut : ''}`}>
        {step >= 2 && step < 4 && (
          <TextReveal 
            text="Some dreams are worth holding onto." 
            trigger={step >= 2} 
            delay={0}
            className={`${styles.subtext} ${step >= 3 ? styles.fadeOutText : ''}`} 
            type="fade-up" 
          />
        )}

        {step >= 3 && step < 4 && (
          <TextReveal 
            text="One day..." 
            trigger={step >= 3} 
            delay={1000}
            className={`${styles.subtext} ${styles.delayedSubtext}`} 
            type="blur-in" 
          />
        )}

        {step >= 4 && (
          <TextReveal 
            text="Dr. Layal" 
            trigger={step >= 4} 
            delay={0}
            className={styles.climaxTitle} 
            type="blur-in" 
            duration={4000}
          />
        )}
      </div>
    </div>
  );
};
