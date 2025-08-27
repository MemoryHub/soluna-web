import { Character, CharacterObservation, validateAndConvertCharacter } from '../types/character';
import BaseApiService from './base_api';
import type { ApiResponse, PaginatedData } from '../types/api_response';
import { securityUtils } from '../utils/securityUtils';
import { LoginRequest, SendVerificationCodeRequest, LoginResponseData, LogoutRequest } from '../types/user_request/user_request';

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
      
      const response = await this.request<ApiResponse<any>>('/api/characters/list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      // 检查是否有加密数据
      if (response.data && response.recode === 200 && response.data.encrypted_characters_data) {
        try {
          // 解密数据
          const decryptedDataStr = await securityUtils.decrypt(response.data.encrypted_characters_data);
          // 解析解密后的JSON数据
          const decryptedData = JSON.parse(decryptedDataStr);
          
          // 返回与原格式兼容的数据结构
          return {
            ...response,
            data: decryptedData
          };
        } catch (decryptError) {
          console.error('Failed to decrypt characters data:', decryptError);
          // 如果解密失败，返回原始响应
          return response;
        }
      }
      
      // 直接返回响应数据（保持向后兼容）
      return response as ApiResponse<PaginatedData<Character>>;
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

  // 发送验证码
  async sendVerificationCode(phoneNumber: string): Promise<ApiResponse<null>> {
    try {
      const requestBody: SendVerificationCodeRequest = {
        phone_number: phoneNumber
      };
      
      return this.request<ApiResponse<null>>('/api/user/send-verification-code', {
        method: 'POST',
        body: JSON.stringify(requestBody)
      });
    } catch (error) {
      console.error('Failed to send verification code:', error);
      throw error;
    }
  }

  // 登录
  async login(phoneNumber: string, verificationCode: string): Promise<ApiResponse<LoginResponseData>> {
    try {
      const requestBody: LoginRequest = {
        phone_number: phoneNumber,
        verification_code: verificationCode
      };
      
      return this.request<ApiResponse<LoginResponseData>>('/api/user/login', {
        method: 'POST',
        body: JSON.stringify(requestBody)
      });
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }
  
  // 登出 - 简化请求体格式以解决422错误
  async logout(): Promise<ApiResponse<null>> {
    try {
      // 从localStorage获取token
      const token = localStorage.getItem('userToken');
      
      const requestBody: LogoutRequest = {
        token: token || ''
      };

      // 根据后端要求，将token放在请求体中而不是请求头中
      return this.request<ApiResponse<null>>('/api/user/logout', {
        method: 'POST',

        body: JSON.stringify(requestBody)
      });
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }
  
  // 绑定邀请码
  async bindInviteCode(code: string): Promise<ApiResponse<{ success: boolean }>> {
    try {
      // 从localStorage获取用户信息
      const userInfoString = localStorage.getItem('userInfo');
      if (!userInfoString) {
        throw new Error('用户未登录');
      }
      
      const userInfo = JSON.parse(userInfoString);
      const userId = userInfo.user_id;
      
      if (!userId) {
        throw new Error('无法获取用户ID');
      }
      
      const requestBody = {
        code,
        user_id: userId
      };
      
      return this.request<ApiResponse<{ success: boolean }>>('/api/invite-code/bind', {
        method: 'POST',
        body: JSON.stringify(requestBody)
      });
    } catch (error) {
      console.error('绑定邀请码失败:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();
