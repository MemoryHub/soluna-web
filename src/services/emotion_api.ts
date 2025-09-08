import type { ApiResponse } from '../types/api_response';
import type { EmotionData } from '../types/emotion';
import BaseApiService from './base_api';

interface BatchEmotionResponse {
  [characterId: string]: EmotionData;
}

class EmotionApiService extends BaseApiService {
  // 批量获取角色情绪信息
  async getEmotionsByCharacterIds(characterIds: string[]): Promise<ApiResponse<BatchEmotionResponse>> {
    return this.request<ApiResponse<BatchEmotionResponse>>('/api/emotion/characters/get/batch', {
      method: 'POST',
      body: JSON.stringify(characterIds),
    });
  }
}

export const emotionApiService = new EmotionApiService();
export type { EmotionData, BatchEmotionResponse };