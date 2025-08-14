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
    <header className="border-b border-[#2d3748] py-3 px-6 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-[#38b2ac] rounded-sm flex items-center justify-center pulse-slow">
          <i className="fa fa-eye text-xs"></i>
        </div>
        <h1 className="text-lg tracking-wide">
          角色观察站 <span className="text-xs text-[#38b2ac]">| 实时监控中</span>
        </h1>
      </div>
      <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-green-500 inline-block"></span>
          <span>稳定</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-orange-500 inline-block"></span>
          <span>波动</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-red-500 inline-block"></span>
          <span>异常</span>
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
