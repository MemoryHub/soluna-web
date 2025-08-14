export interface Event {
  event_id: string;
  type: string;
  description: string;
  start_time: string;
  status: 'not_started' | 'in_progress' | 'completed';
  is_key_event: boolean;
  impact: string;
  location: string;
  participants: string[];
  outcome: string;
  emotion_score: number;
  end_time?: string;
  dependencies?: string[];
}

export interface EventProfile {
  id: string;
  character_id: string;
  life_path: Event[];
  current_stage: string;
  next_trend: string;
  event_triggers: Record<string, any>;
}

export interface Character {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'neutral';
  occupation: string;
  background: string;
  mbti_type: string;
  personality: string[];
  big5: Record<string, number>;
  motivation: string;
  conflict: string;
  flaw: string;
  character_arc: string;
  hobbies: string[];
  relationships: Record<string, string>;
  daily_routine: Array<Record<string, any>>;
  speech_style: string;
  tone: string;
  response_speed: string;
  communication_style: string;
  favored_topics: string[];
  disliked_topics: string[];
  taboos: string[];
  beliefs: string[];
  goals: string[];
  fears: string[];
  secrets: string[];
  habits: string[];
  mood: string;
  mood_swings: string;
  memory: Record<string, string>;
  event_profile?: EventProfile;
  character_id: string;
  is_preset: boolean;
}

export interface ApiResponse<T = any> {
  code: number;
  msg: string;
  data: T;
  success: boolean;
}

export type MoodType = 'happy' | 'neutral' | 'sad' | 'excited';

export interface CharacterObservation {
  character: Character;
  currentAction: string;
  currentTime: string;
  mood: MoodType;
  hint?: string;
}
