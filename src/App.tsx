import { useState, useEffect, useCallback } from 'react';
import type { ExperiencePhase, ExperienceState } from './types/state';
import { useTimezone } from './hooks/useTimezone';
import { Countdown } from './components/Countdown/Countdown';
import { MidnightTransition } from './components/MidnightTransition/MidnightTransition';
import { CinematicStory } from './components/CinematicStory/CinematicStory';
import { TravelSection } from './components/TravelSection/TravelSection';
import { MedicalDream } from './components/MedicalDream/MedicalDream';
import { FinalMessage } from './components/FinalMessage/FinalMessage';
import { PrivateNote } from './components/PrivateNote/PrivateNote';
import { FirebaseListener } from './components/FirebaseListener';
import { MusicPlayer } from './components/MusicPlayer/MusicPlayer';
import { FilmEffects } from './components/FilmEffects/FilmEffects';
import { GlobalFireworks } from './components/GlobalFireworks/GlobalFireworks';
import { CONFIG } from './config/env';

function App() {
  const { isBirthday, timeLeft } = useTimezone();
  
  const [state, setState] = useState<ExperienceState>({
    currentPhase: 'COUNTDOWN',
    isPlaying: false,
    isMuted: false,
  });

  useEffect(() => {
    if (isBirthday && state.currentPhase === 'COUNTDOWN') {
      setState(s => ({ ...s, currentPhase: 'MIDNIGHT_TRANSITION' }));
    }
  }, [isBirthday, state.currentPhase]);

  const advancePhase = useCallback((nextPhase: ExperiencePhase) => {
    setState(s => {
      if (s.currentPhase === nextPhase) return s;
      return { ...s, currentPhase: nextPhase };
    });
  }, []);

  const handleReplay = useCallback(() => {
    setState(s => {
      const targetPhase = CONFIG.TEST_MODE ? 'MIDNIGHT_TRANSITION' : 'COUNTDOWN';
      if (s.currentPhase === targetPhase && !s.isPlaying && !s.isMuted) return s;
      return {
        currentPhase: targetPhase,
        isPlaying: false,
        isMuted: false,
      };
    });
  }, []);

  const handlePlayState = useCallback((playing: boolean) => {
    setState(s => {
      if (s.isPlaying === playing) return s;
      return { ...s, isPlaying: playing };
    });
  }, []);

  const handleMuteState = useCallback((muted: boolean) => {
    setState(s => {
      if (s.isMuted === muted) return s;
      return { ...s, isMuted: muted };
    });
  }, []);

  // Stable callbacks for children to prevent animation resets on re-render
  const handleMidnightComplete = useCallback(() => advancePhase('CINEMATIC_STORY'), [advancePhase]);
  const handleMidnightStartPlayback = useCallback(() => handlePlayState(true), [handlePlayState]);
  const handleCinematicComplete = useCallback(() => advancePhase('TRAVEL_SECTION'), [advancePhase]);
  const handleTravelComplete = useCallback(() => advancePhase('MEDICAL_DREAM'), [advancePhase]);
  const handleMedicalComplete = useCallback(() => advancePhase('FINAL_MESSAGE'), [advancePhase]);
  const handleFinalMessageComplete = useCallback(() => advancePhase('PRIVATE_NOTE'), [advancePhase]);

  return (
    <div className="app-container">
      <FilmEffects />
      
      {state.currentPhase !== 'COUNTDOWN' && (
        <MusicPlayer 
          isPlaying={state.isPlaying} 
          isMuted={state.isMuted}
          hideControls={state.currentPhase === 'PRIVATE_NOTE'}
          onPlayStateChange={handlePlayState}
          onMuteStateChange={handleMuteState}
        />
      )}

      {state.currentPhase === 'COUNTDOWN' && (
        <Countdown timeLeft={timeLeft} />
      )}

      {state.currentPhase === 'MIDNIGHT_TRANSITION' && (
        <MidnightTransition 
          onComplete={handleMidnightComplete} 
          onStartPlayback={handleMidnightStartPlayback}
        />
      )}

      {state.currentPhase === 'CINEMATIC_STORY' && (
        <CinematicStory onComplete={handleCinematicComplete} />
      )}

      {state.currentPhase === 'TRAVEL_SECTION' && (
        <TravelSection 
          isPlaying={state.isPlaying}
          onComplete={handleTravelComplete} 
        />
      )}

      {state.currentPhase === 'MEDICAL_DREAM' && (
        <MedicalDream 
          onComplete={handleMedicalComplete} 
        />
      )}

      {state.currentPhase === 'FINAL_MESSAGE' && (
        <FinalMessage 
          onComplete={handleFinalMessageComplete} 
        />
      )}

      {state.currentPhase === 'PRIVATE_NOTE' && (
        <PrivateNote onReplay={handleReplay} />
      )}

      {/* Global Realtime Firebase Listener for Developer Console */}
      <FirebaseListener />

      {state.currentPhase !== 'COUNTDOWN' && (
        <GlobalFireworks />
      )}
    </div>
  );
}

export default App;
