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
  gender: string;
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

export type MoodType = 'happy' | 'neutral' | 'sad' | 'excited' | 'calm' | 'anxious';

export interface CharacterObservation {
  character: Character;
  currentAction: string;
  currentTime: string;
  mood: MoodType;
  hint?: string;
}

/**
 * 验证并转换角色数据类型，确保与后端期望的类型一致
 * @param char 输入的角色数据
 * @returns 类型验证和转换后的角色数据
 */
export function validateAndConvertCharacter(char: any): Character {
  const validatedChar = { ...char };
  
  // 字符串类型字段
  const stringFields = ['name', 'occupation', 'background', 'mbti_type', 'motivation', 'conflict', 'flaw', 
                       'character_arc', 'speech_style', 'tone', 'response_speed', 'communication_style', 
                       'mood', 'mood_swings', 'character_id'];
  stringFields.forEach(field => {
    if (validatedChar[field] !== undefined) {
      validatedChar[field] = String(validatedChar[field]);
    }
  });
  
  // 数字类型字段
  if (validatedChar.age !== undefined) {
    validatedChar.age = Number(validatedChar.age) || 0;
  }
  
  // 布尔类型字段
  if (validatedChar.is_preset !== undefined) {
    validatedChar.is_preset = Boolean(validatedChar.is_preset);
  }
  
  // 数组类型字段
  const arrayFields = ['personality', 'hobbies', 'favored_topics', 'disliked_topics', 'taboos', 
                      'beliefs', 'goals', 'fears', 'secrets', 'habits'];
  arrayFields.forEach(field => {
    if (validatedChar[field] !== undefined) {
      if (Array.isArray(validatedChar[field])) {
        // 确保数组中的每个元素都是字符串
        validatedChar[field] = validatedChar[field].map((item: any) => String(item));
      } else {
        // 如果不是数组，将其转换为包含该值的数组
        validatedChar[field] = [String(validatedChar[field])];
      }
    }
  });
  
  // 对象类型字段
  if (validatedChar.big5 !== undefined) {
    if (typeof validatedChar.big5 === 'object' && validatedChar.big5 !== null) {
      // 确保big5对象的所有值都是数字
      Object.keys(validatedChar.big5).forEach(key => {
        validatedChar.big5[key] = Number(validatedChar.big5[key]) || 0;
      });
    } else {
      validatedChar.big5 = {};
    }
  }
  
  // relationships字段（对象类型，值为字符串）
  if (validatedChar.relationships !== undefined) {
    if (typeof validatedChar.relationships === 'object' && validatedChar.relationships !== null) {
      // 确保relationships对象的所有值都是字符串
      Object.keys(validatedChar.relationships).forEach(key => {
        validatedChar.relationships[key] = String(validatedChar.relationships[key]);
      });
    } else {
      validatedChar.relationships = {};
    }
  }
  
  // memory字段（对象类型，值为字符串）
  if (validatedChar.memory !== undefined) {
    if (typeof validatedChar.memory === 'object' && validatedChar.memory !== null) {
      // 确保memory对象的所有值都是字符串
      Object.keys(validatedChar.memory).forEach(key => {
        validatedChar.memory[key] = String(validatedChar.memory[key]);
      });
    } else {
      validatedChar.memory = {};
    }
  }
  
  // daily_routine字段（数组对象类型）
  if (validatedChar.daily_routine !== undefined) {
    if (Array.isArray(validatedChar.daily_routine)) {
      validatedChar.daily_routine = validatedChar.daily_routine.map((item: any) => 
        typeof item === 'object' && item !== null ? item : {}
      );
    } else {
      validatedChar.daily_routine = [{}];
    }
  }
  
  // event_profile字段（可选对象类型）
  if (validatedChar.event_profile !== undefined && typeof validatedChar.event_profile !== 'object') {
    validatedChar.event_profile = undefined;
  }
  
  return validatedChar as Character;
}
