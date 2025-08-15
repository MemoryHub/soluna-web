import { Character, ApiResponse } from '@/types/character';

import BaseApiService from './base_api';

class ApiService extends BaseApiService {

  // 获取所有角色列表
  async getCharacters(limit: number = 10, offset: number = 0): Promise<ApiResponse<Character[]>> {
    return this.request<ApiResponse<Character[]>>('/api/characters/list', {
      method: 'POST',
      body: JSON.stringify({ limit, offset }),
    });
  }

  // 根据ID获取角色详情
  async getCharacter(characterId: string): Promise<ApiResponse<Character>> {
    return this.request<ApiResponse<Character>>(`/api/characters/${characterId}`, {
      method: 'POST',
    });
  }

  // 生成新角色
  async generateCharacter(params: {
    name?: string;
    age?: number;
    gender?: string;
    occupation?: string;
    language?: string;
  }): Promise<ApiResponse<Character>> {
    return this.request<ApiResponse<Character>>('/api/characters/generate', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  // 删除角色
  async deleteCharacter(characterId: string): Promise<ApiResponse<{ success: boolean }>> {
    return this.request<ApiResponse<{ success: boolean }>>(`/api/characters/delete/${characterId}`, {
      method: 'POST',
    });
  }
}

export const apiService = new ApiService();
