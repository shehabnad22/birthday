import React from 'react';
import styles from './FilmEffects.module.css';

export const FilmEffects: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.grain} />
      <div className={styles.vignette} />
      <div className={styles.dustParticles}>
        {/* Simple CSS-based dust particles for global atmosphere */}
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={i} className={styles.particle} style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${15 + Math.random() * 15}s`
          }} />
        ))}
      </div>
    </div>
  );
};
