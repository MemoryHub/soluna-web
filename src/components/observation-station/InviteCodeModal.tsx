'use client';

import { useState, useEffect } from 'react';
import { useInviteStatus } from '../../hooks/useInviteStatus';
import '@/styles/tech-animation.css';

interface InviteCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

// 自定义钩子：用于生成科技感的闪烁效果
const useTechPulse = () => {
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(prev => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return pulse;
};

export default function InviteCodeModal({ isOpen, onClose, onSuccess }: InviteCodeModalProps) {
  const [inviteCode, setInviteCode] = useState('');
  const [showError, setShowError] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const pulse = useTechPulse();
  const { bindInviteCode, isLoading, error } = useInviteStatus();

  // 科技感背景网格动画效果
  const gridOpacity = 0.1 + Math.sin(pulse / 10) * 0.05;

  // 限制邀请码输入为8位字符
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 8) {
      setInviteCode(value.toUpperCase()); // 自动转换为大写
      if (showError) {
        setShowError(false);
      }
    }
  };

  const handleSubmit = async () => {
    if (!inviteCode || inviteCode.length !== 8) {
      setShowError(true);
      return;
    }

    const success = await bindInviteCode(inviteCode);
    
    if (success) {
      // 显示成功提示
      setShowSuccessToast(true);
      
      // 1.5秒后关闭提示并刷新页面
      setTimeout(() => {
        setShowSuccessToast(false);
        onClose();
        if (onSuccess) {
          onSuccess();
        }
        // 刷新页面以更新用户信息数据
        window.location.reload();
      }, 1500);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
      {/* 科技感背景网格 */}
      <div 
        className="absolute inset-0 tech-grid"
        style={{ 
          opacity: gridOpacity,
          backgroundImage: 'linear-gradient(to right, #38b2ac 1px, transparent 1px), linear-gradient(to bottom, #38b2ac 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      />
      
      {/* 模态框主体 */}
      <div className="relative bg-gray-900 border-2 border-[#38b2ac] rounded-md shadow-[0_0_15px_rgba(56,178,172,0.5)] w-72 max-w-full pixel-modal">
        {/* 像素风格标题栏 */}
        <div className="bg-[#2d3748] border-b-2 border-[#38b2ac] px-4 py-3 flex items-center justify-between">
          <h3 className="text-[#38b2ac] font-bold tracking-wider text-sm pixel-text">
            🔐 邀请码验证
          </h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="关闭"
          >
            <i className="fa fa-times"></i>
          </button>
        </div>
        
        {/* 内容区域 */}
        <div className="p-4">
          <p className="text-gray-300 text-xs mb-4 text-center">
            请输入8位邀请码以解锁角色创建功能
          </p>
          
          {/* 邀请码输入框 */}
          <div className="mb-4">
            <input
              type="text"
              value={inviteCode}
              onChange={handleCodeChange}
              onKeyPress={handleKeyPress}
              placeholder="输入8位邀请码"
              className={`w-full px-3 py-2 bg-gray-800 border ${showError || error ? 'border-red-500' : 'border-[#38b2ac]'} rounded-md text-center text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#38b2ac] transition-all pixel-input`}
              maxLength={8}
            />
            
            {/* 错误提示 */}
            {(showError || error) && (
              <p className="text-red-500 text-xs mt-2 text-center animate-pulse">
                {showError ? '邀请码必须为8位字符' : error}
              </p>
            )}
            
            {/* 字符计数器 */}
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-400">
                字符数: <span className={inviteCode.length === 8 ? 'text-green-400' : 'text-gray-400'}>{inviteCode.length}/8</span>
              </span>
              <span className="text-xs text-gray-400">
                {inviteCode.length === 8 ? '✓' : '✗'}
              </span>
            </div>
          </div>
          
          {/* 确认按钮 */}
          <button
            onClick={handleSubmit}
            disabled={isLoading || inviteCode.length !== 8}
            className={`w-full py-2 bg-[#38b2ac] hover:bg-[#2c9789] text-black font-bold rounded-md transition-colors flex items-center justify-center text-sm ${(isLoading || inviteCode.length !== 8) ? 'opacity-50 cursor-not-allowed' : ''} pixel-button`}
          >
            {isLoading ? (
              <>
                <i className="fa fa-spinner fa-spin mr-2"></i>
                绑定中...
              </>
            ) : (
              '确认'
            )}
          </button>
        </div>
        
        {/* 科技感装饰元素 */}
        <div className="absolute -bottom-1 -right-1 w-24 h-24 bg-[#38b2ac] rounded-full filter blur-3xl opacity-10 animate-pulse"></div>
      </div>
      
      {/* 成功提示 */}
      {showSuccessToast && (
        <div className="fixed top-4 right-4 bg-green-900 border border-green-500 px-4 py-2 rounded-md shadow-lg z-50 animate-fadeIn">
          <div className="flex items-center">
            <i className="fa fa-check-circle text-green-400 mr-2"></i>
            <span className="text-green-400 text-sm">邀请码绑定成功！</span>
          </div>
        </div>
      )}
    </div>
  );
}