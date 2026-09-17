import React, { useState, useEffect } from 'react';
import { storyData } from '../../data/story';
import { TextReveal } from '../TextReveal/TextReveal';
import styles from './CinematicStory.module.css';

interface CinematicStoryProps {
  onComplete: () => void;
}

export const CinematicStory: React.FC<CinematicStoryProps> = ({ onComplete }) => {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [sceneState, setSceneState] = useState<'entering' | 'holding' | 'exiting'>('entering');

  const scene = storyData[currentSceneIndex];

  useEffect(() => {
    if (!scene) return;

    setSceneState('entering');
    
    const holdingTimer = setTimeout(() => {
      setSceneState('holding');
    }, 2000);

    const exitingTimer = setTimeout(() => {
      setSceneState('exiting');
    }, scene.duration - 1500);

    const nextSceneTimer = setTimeout(() => {
      if (currentSceneIndex === storyData.length - 1) {
        onComplete();
      } else {
        setCurrentSceneIndex(prev => prev + 1);
      }
    }, scene.duration);

    return () => {
      clearTimeout(holdingTimer);
      clearTimeout(exitingTimer);
      clearTimeout(nextSceneTimer);
    };
  }, [currentSceneIndex, scene, onComplete]);

  if (!scene) return null;

  const isHolding = sceneState === 'holding' || sceneState === 'exiting';
  const isExiting = sceneState === 'exiting';

  return (
    <div className={styles.container}>
      {/* Background Image / Blur Layer */}
      <div className={`${styles.backgroundLayer} ${isExiting ? styles.fadeOut : styles.fadeIn}`}>
        <div 
          className={`${styles.image} ${styles[scene.cameraMotion]} ${isHolding ? styles.blurred : ''}`} 
          style={scene.image ? { backgroundImage: `url("${scene.image}")` } : undefined}
        />
      </div>

      <div className={`${styles.contentWrapper} ${styles[scene.composition]} ${isExiting ? styles.fadeOut : ''}`}>
        
        {/* Main Image Layer (for compositions that separate background and foreground) */}
        {scene.composition === 'layered' && (
          <div 
            className={`${styles.foregroundImage} ${styles[scene.transitionType]}`} 
            style={scene.image ? { backgroundImage: `url("${scene.image}")` } : undefined}
          />
        )}

        <div className={styles.textContainer}>
          {scene.label && (
            <TextReveal 
              text={scene.label} 
              trigger={isHolding} 
              delay={0} 
              className={styles.label} 
              type="fade-up" 
            />
          )}
          
          <TextReveal 
            text={scene.text} 
            trigger={isHolding} 
            delay={500} 
            className={styles.mainText} 
            type="line" 
          />
          
          {scene.secondaryText && (
            <TextReveal 
              text={scene.secondaryText} 
              trigger={isHolding} 
              delay={1500} 
              className={styles.secondaryText} 
              type="blur-in" 
            />
          )}
        </div>
      </div>
    </div>
  );
};
