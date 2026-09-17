export type ExperiencePhase = 
  | 'COUNTDOWN' 
  | 'MIDNIGHT_TRANSITION' 
  | 'CINEMATIC_STORY' 
  | 'TRAVEL_SECTION' 
  | 'MEDICAL_DREAM' 
  | 'FINAL_MESSAGE' 
  | 'PRIVATE_NOTE';

export interface ExperienceState {
  currentPhase: ExperiencePhase;
  isPlaying: boolean;
  isMuted: boolean;
}
