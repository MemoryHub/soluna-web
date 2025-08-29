'use client';

import { useEffect, useState } from 'react';
import { useUser } from '../../hooks/useUser';

export default function Header() {
  const [currentTime, setCurrentTime] = useState('');
  const { isLoggedIn, userInfo, login, logout } = useUser();

  // 更新时间
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toTimeString().slice(0, 8));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  // 打开登录弹窗
  const handleOpenLoginModal = () => {
    login();
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#2d3748] py-2 px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-2 bg-[#1a1f29]/95 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#38b2ac] rounded-sm flex items-center justify-center pulse-slow">
            <i className="fa fa-eye text-xs"></i>
          </div>
          <h1 className="text-base sm:text-lg tracking-wide">
            AI社会观察站 <span className="text-xs text-[#38b2ac] hidden sm:inline">| 实时监控中</span>
          </h1>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-yellow-500 inline-block"></span>
            <span className="hidden sm:inline">兴奋</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 inline-block"></span>
            <span className="hidden sm:inline">快乐</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-blue-500 inline-block"></span>
            <span className="hidden sm:inline">平静</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-orange-500 inline-block"></span>
            <span className="hidden sm:inline">无聊</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-orange-600 inline-block"></span>
            <span className="hidden sm:inline">焦虑</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-red-500 inline-block"></span>
            <span className="hidden sm:inline">愤怒</span>
          </div>
          <div className="text-gray-500">
            <i className="fa fa-clock-o mr-1"></i>
            <span>{currentTime}</span>
          </div>
          
          {/* 根据登录状态显示不同内容 */}
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              {/* 显示用户手机号 */}
              <div className="text-[#38b2ac]">
                <i className="fa fa-eye mr-1"></i>
                <span>编号:{userInfo?.phone_number ? userInfo.phone_number.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') : '未知'}</span>
              </div>
              {/* 直接添加登出按钮 */}
              <button
                onClick={logout}
                className="py-1 px-2 text-red-500 hover:text-red-400 text-xs flex items-center transition-colors"
              >
                <i className="fa fa-sign-out mr-1"></i>
                <span>登出</span>
              </button>
            </div>
          ) : (
            <button
              onClick={handleOpenLoginModal}
              className="py-1 px-3 bg-[#38b2ac] text-white text-xs pixel-button hover:bg-[#319795] transition-colors"
            >
              <i className="fa fa-sign-in mr-1"></i>
              <span>登录</span>
            </button>
          )}
        </div>
      </header>
      

      

    </>
  );
}
