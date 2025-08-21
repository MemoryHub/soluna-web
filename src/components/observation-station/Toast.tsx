'use client';

import React, { useState, useEffect } from 'react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onHide: () => void;
  duration?: number;
  type?: 'info' | 'success' | 'warning' | 'error';
}

/**
 * 可复用的Toast提示组件
 * 支持自动消失、响应式设计和多种提示类型
 */
export default function Toast({ 
  message, 
  isVisible, 
  onHide, 
  duration = 3000,
  type = 'info'
}: ToastProps) {
  // 自动隐藏效果
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onHide();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onHide, duration]);

  // 根据类型设置样式
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500/20 border-green-500 text-green-400';
      case 'warning':
        return 'bg-yellow-500/20 border-yellow-500 text-yellow-400';
      case 'error':
        return 'bg-red-500/20 border-red-500 text-red-400';
      default:
        return 'bg-blue-500/20 border-blue-500 text-blue-400';
    }
  };

  // 根据类型设置图标
  const getTypeIcon = () => {
    switch (type) {
      case 'success':
        return 'fa-check-circle';
      case 'warning':
        return 'fa-exclamation-triangle';
      case 'error':
        return 'fa-exclamation-circle';
      default:
        return 'fa-info-circle';
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 w-full max-w-xs sm:max-w-sm mx-auto sm:mx-0">
      <div 
        className={`
          ${getTypeStyles()} 
          border-2 rounded-sm p-2 sm:p-3 flex items-start gap-2 sm:gap-3 
          shadow-lg transform transition-all duration-300 ease-in-out
          animate-fade-in-up
          backdrop-blur-sm
        `}
      >
        <i className={`fa ${getTypeIcon()} mt-0.5`}></i>
        <div className="flex-1">
          <p className="text-sm sm:text-xs font-mono leading-tight">
            {message}
          </p>
        </div>
        <button 
          onClick={onHide} 
          className="text-gray-400 hover:text-white focus:outline-none text-xs"
        >
          <i className="fa fa-times"></i>
        </button>
      </div>
    </div>
  );
}