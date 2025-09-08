export interface EmotionData {
  character_id: string;
  pleasure_score: number;
  arousal_score: number;
  dominance_score: number;
  current_emotion_score: number;
  updated_at: string;
  created_at: string;
  traditional: string;
  vibe: string;
  emoji: string;
  color: string;
  description: string;
  emotion_type: string;
}

export interface BatchEmotionResponse {
  [characterId: string]: EmotionData;
}

export type EmotionType = '兴奋' | '快乐' | '愤怒' | '焦虑' | '无聊' | '平静';