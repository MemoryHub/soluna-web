import { Character, CharacterObservation, validateAndConvertCharacter } from '../types/character';
import BaseApiService from './base_api';
import type { ApiResponse, PaginatedData } from '../types/api_response';
import { securityUtils } from '../utils/securityUtils';

class ApiService extends BaseApiService {

  // 获取所有角色列表
  async getCharacters(limit: number = 10, offset: number = 0, first_letter: string = '*'): Promise<ApiResponse<PaginatedData<Character>>> {
    try {
      // 构建符合后端CharacterListRequest模型的请求体
      const requestBody = {
        limit: limit,
        offset: offset,
        first_letter: first_letter
      };
      
      console.log('Sending character list request:', requestBody);
      
      const response = await this.request<ApiResponse<PaginatedData<Character>>>('/api/characters/list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      console.log('Received character list response:', response);
      return response;
    } catch (error) {
      console.error('Error fetching characters:', error);
      throw error;
    }
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
  }, options?: {
    signal?: AbortSignal;
  }): Promise<ApiResponse<Character>> {
    // 使用标准的POST请求，在body中传递JSON数据
    // 确保language参数有默认值
    const requestParams = {
      ...params,
      language: params.language || 'Chinese'
    };
    
    return this.request<ApiResponse<Character>>('/api/characters/generate', {
      method: 'POST',
      body: JSON.stringify(requestParams),
      signal: options?.signal,
    });
  }

  // 删除角色
  async deleteCharacter(characterId: string): Promise<ApiResponse<{ success: boolean }>> {
    return this.request<ApiResponse<{ success: boolean }>>(`/api/characters/delete/${characterId}`, {
      method: 'POST',
    });
  }

  // 保存角色
  async saveCharacter(character: Character): Promise<ApiResponse<Character>> {
    try {
      // 对角色数据进行类型检验和转换
      const validatedCharacter = validateAndConvertCharacter(character);
      // 对角色数据进行加密处理 - 使用专门的角色数据加密方法
      const encryptedCharacter = await securityUtils.encryptCharacterData(validatedCharacter);
      
      // 按照后端要求的格式发送加密数据
      return this.request<ApiResponse<Character>>('/api/characters/save', {
        method: 'POST',
        body: JSON.stringify({
          encrypted_character: encryptedCharacter
        }),
      });
    } catch (error) {
      console.error('Failed to save character:', error);
      // 添加更多调试信息
      if (error instanceof Error) {
        console.error('Error details:', error.message);
        console.error('Stack trace:', error.stack);
      }
      throw error;
    }
  }
}

export const apiService = new ApiService();
