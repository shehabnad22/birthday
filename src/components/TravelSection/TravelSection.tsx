import React, { useEffect, useState, useRef } from 'react';
import { TextReveal } from '../TextReveal/TextReveal';
import styles from './TravelSection.module.css';

interface TravelSectionProps {
  isPlaying: boolean;
  onComplete: () => void;
}

export const TravelSection: React.FC<TravelSectionProps> = ({ isPlaying, onComplete }) => {
  const [step, setStep] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Staggered text reveal choreography
    const sequence = [
      { step: 1, delay: 1000 }, // TRAVEL
      { step: 2, delay: 4000 }, // "There is still so much waiting for you."
      { step: 3, delay: 8000 }, // "Places you've never seen."
      { step: 4, delay: 12000 }, // "Stories you've never lived."
      { step: 5, delay: 17000 }  // Exit
    ];

    const timeouts = sequence.map(seq => 
      setTimeout(() => setStep(seq.step), seq.delay)
    );

    const finishTimeout = setTimeout(() => {
      onComplete();
    }, 20000);

    return () => {
      timeouts.forEach(clearTimeout);
      clearTimeout(finishTimeout);
    };
  }, [onComplete]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let stars = Array.from({ length: 100 }).map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      z: Math.random() * 2,
      o: Math.random()
    }));

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw subtle stars/city lights moving left (parallax effect)
      stars.forEach(star => {
        star.x -= star.z * 0.2;
        if (star.x < 0) {
          star.x = canvas.width;
          star.y = Math.random() * canvas.height;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.z * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(240, 244, 248, ${star.o * 0.5})`;
        ctx.fill();
      });

      animationId = requestAnimationFrame(loop);
    };

    if (isPlaying) {
      loop();
    }

    return () => {
      window.removeEventListener('resize', resize);
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [isPlaying]);

  return (
    <div className={styles.container}>
      <canvas ref={canvasRef} className={styles.canvas} />
      
      <div className={`${styles.textContainer} ${step >= 5 ? styles.fadeOut : ''}`}>
        {step >= 1 && (
          <TextReveal 
            text="TRAVEL" 
            trigger={step >= 1} 
            delay={0}
            className={styles.label} 
            type="fade-up" 
          />
        )}
        
        {step >= 2 && (
          <TextReveal 
            text="There is still so much waiting for you." 
            trigger={step >= 2} 
            delay={0}
            className={styles.mainText} 
            type="line" 
          />
        )}
        
        {step >= 3 && (
          <TextReveal 
            text="Places you've never seen." 
            trigger={step >= 3} 
            delay={0}
            className={styles.mainText} 
            type="blur-in" 
          />
        )}
        
        {step >= 4 && (
          <TextReveal 
            text="Stories you've never lived." 
            trigger={step >= 4} 
            delay={0}
            className={styles.mainText} 
            type="line" 
          />
        )}
      </div>
    </div>
  );
};
