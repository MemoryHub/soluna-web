import { ApiResponse } from '@/types/character';
import BaseApiService from './base_api';

class EventApiService extends BaseApiService {
  // 批量获取角色事件配置
  async getEventProfilesByCharacterIds(characterIds: string[]): Promise<ApiResponse<Record<string, any[]>>> {
    return this.request<ApiResponse<Record<string, any[]>>>('/api/event-profiles/get-by-character-ids', {
      method: 'POST',
      body: JSON.stringify(characterIds),
    });
  }
}

export const eventApiService = new EventApiService();
