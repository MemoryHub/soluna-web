'use client';

import { useEffect, useState } from 'react';

export default function Header() {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toTimeString().slice(0, 8));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="border-b border-[#2d3748] py-2 px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-2">
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
          <span className="w-2 h-2 bg-green-500 inline-block"></span>
          <span className="hidden sm:inline">稳定</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-blue-500 inline-block"></span>
          <span className="hidden sm:inline">平静</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-orange-500 inline-block"></span>
          <span className="hidden sm:inline">波动</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-orange-600 inline-block"></span>
          <span className="hidden sm:inline">焦虑</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-red-500 inline-block"></span>
          <span className="hidden sm:inline">异常</span>
        </div>
        <div className="text-gray-500">
          <i className="fa fa-clock-o mr-1"></i>
          <span>{currentTime}</span>
        </div>
        <div className="text-[#38b2ac]">
          <i className="fa fa-eye mr-1"></i>
          <span>AI</span>
        </div>
      </div>
    </header>
  );
}
