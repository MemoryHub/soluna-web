"use client"
import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface InviteStatus {
  has_used_codes: boolean;
  used_codes: Array<{ code: string }>;
}

export const useInviteStatus = () => {
  const [inviteStatus, setInviteStatus] = useState<InviteStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 从localStorage获取邀请码状态
  const getInviteStatusFromStorage = (): InviteStatus | null => {
    try {
      const userInfoString = localStorage.getItem('userInfo');
      if (userInfoString) {
        const userInfo = JSON.parse(userInfoString);
        // 确保返回的对象结构完整，特别是has_used_codes字段
        if (userInfo.invite_status && typeof userInfo.invite_status.has_used_codes === 'boolean') {
          return userInfo.invite_status;
        }
        // 如果没有邀请码状态或has_used_codes不是布尔值，返回默认的未绑定状态
        return {
          has_used_codes: false,
          used_codes: []
        };
      }
    } catch (err) {
      console.error('获取邀请码状态失败:', err);
    }
    return null;
  };

  // 初始化邀请码状态 - 确保在所有情况下都能正确初始化邀请码状态
  useEffect(() => {
    const status = getInviteStatusFromStorage();
    // 如果status为null，设置为默认的未绑定状态
    setInviteStatus(status || {
      has_used_codes: false,
      used_codes: []
    });

    // 监听localStorage变化
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userInfo') {
        const newStatus = getInviteStatusFromStorage();
        setInviteStatus(newStatus || {
          has_used_codes: false,
          used_codes: []
        });
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // 绑定邀请码
  const bindInviteCode = async (code: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiService.bindInviteCode(code);
      
      if (response.recode === 200) {
        // 成功后更新localStorage中的用户信息
        const userInfoString = localStorage.getItem('userInfo');
        if (userInfoString) {
          const userInfo = JSON.parse(userInfoString);
          userInfo.invite_status = {
            has_used_codes: true,
            used_codes: [{ code }]
          };
          localStorage.setItem('userInfo', JSON.stringify(userInfo));
          
          // 更新状态
          setInviteStatus({
            has_used_codes: true,
            used_codes: [{ code }]
          });
        }
        return true;
      } else {
        setError(response.msg || '绑定邀请码失败');
        return false;
      }
    } catch (err) {
      console.error('绑定邀请码时发生错误:', err);
      setError('网络错误，请稍后再试');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 检查是否已绑定邀请码
  const hasBoundInviteCode = (): boolean => {
    return inviteStatus?.has_used_codes || false;
  };

  return {
    inviteStatus,
    isLoading,
    error,
    bindInviteCode,
    hasBoundInviteCode,
    refreshInviteStatus: () => {
      const status = getInviteStatusFromStorage();
      setInviteStatus(status);
    }
  };
};