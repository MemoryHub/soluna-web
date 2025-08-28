import BaseApiService from './base_api';
import type { ApiResponse } from '../types/api_response';
import type { 
  InteractionRequest, 
  InteractionResponse, 
  InteractionStatsResponse
} from '../types/interaction';

class InteractionApiService extends BaseApiService {
  
  /**
   * 执行互动操作
   */
  async performInteraction(request: InteractionRequest): Promise<ApiResponse<InteractionResponse>> {
    return this.request<ApiResponse<InteractionResponse>>('/api/interaction/perform', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
  }

  /**
   * 获取角色的互动统计数据
   */
  async getInteractionStats(characterId: string): Promise<ApiResponse<InteractionStatsResponse>> {
    return this.request<ApiResponse<InteractionStatsResponse>>(`/api/interaction/stats/${characterId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * 批量获取多个角色的互动统计数据
   */
  async getBatchInteractionStats(characterIds: string[]): Promise<ApiResponse<Record<string, InteractionStatsResponse>>> {
    return this.request<ApiResponse<Record<string, InteractionStatsResponse>>>('/api/interaction/stats/batch', {
      method: 'POST',
      body: JSON.stringify(characterIds),
    });
  }

  /**
   * 检查用户今日是否已与指定角色互动
   */
  async checkTodayInteraction(userId: string, characterId: string): Promise<ApiResponse<{ has_interacted: boolean; interaction_type?: string }>> {
    return this.request<ApiResponse<{ has_interacted: boolean; interaction_type?: string }>>('/api/interaction/check-today', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: userId, character_id: characterId }),
    });
  }
}

export const interactionApiService = new InteractionApiService();