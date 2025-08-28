// 互动类型枚举
export enum InteractionType {
  FEED = 'feed',
  COMFORT = 'comfort', 
  OVERTIME = 'overtime',
  WATER = 'water'
}

// 互动请求参数
export interface InteractionRequest {
  user_id: string;
  character_id: string;
  interaction_type: InteractionType;
}

// 互动记录
export interface InteractionRecord {
  id: string;
  user_id: string;
  character_id: string;
  interaction_type: InteractionType;
  interaction_date: string; // YYYY-MM-DD 格式
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

// 互动统计数据
export interface InteractionStats {
  character_id: string;
  feed_count: number;
  comfort_count: number;
  overtime_count: number;
  water_count: number;
  total_interactions: number;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

// 互动响应
export interface InteractionResponse {
  success: boolean;
  message: string;
  has_interacted_today: boolean;
  interaction_record?: InteractionRecord;
  updated_stats?: InteractionStats;
}

// 互动统计响应
export interface InteractionStatsResponse {
  character_id: string;
  stats: InteractionStats;
  has_interacted_today: boolean;
  today_interaction_type?: InteractionType;
}