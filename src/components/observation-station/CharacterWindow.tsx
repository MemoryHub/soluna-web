'use client';

import React, { useEffect, useState } from 'react';
import { Character, MoodType } from '@/types/character';

interface CharacterWindowProps {
  character: Character;
  currentAction: string;
  currentTime: string;
  mood: MoodType;
  hint?: string;
  onClick: () => void;
  index: number;
}

export default function CharacterWindow({
  character,
  currentAction,
  currentTime,
  mood,
  hint,
  onClick,
  index
}: CharacterWindowProps) {
  // 游戏状态
  const [selected, setSelected] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);
  const [flickerActive, setFlickerActive] = useState(false);

  // 随机触发故障效果
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.97) {
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 100);
      }
    }, 1000);

    return () => clearInterval(glitchInterval);
  }, []);

  // 选中状态切换
  const toggleSelected = () => {
    setSelected(!selected);
    onClick();
  }
  const getMoodColor = (mood: MoodType) => {
    switch (mood) {
      case 'happy': return 'border-green-500';
      case 'neutral': return 'border-orange-500';
      case 'sad': return 'border-red-500';
      case 'excited': return 'border-yellow-500';
      default: return 'border-orange-500';
    }
  };

  const getMoodDotColor = (mood: MoodType) => {
    switch (mood) {
      case 'happy': return 'bg-green-500';
      case 'neutral': return 'bg-orange-500';
      case 'sad': return 'bg-red-500';
      case 'excited': return 'bg-yellow-500';
      default: return 'bg-orange-500';
    }
  };

  const getActionClass = (action: string) => {
    if (action.includes('工作') || action.includes('代码') || action.includes('调试')) {
      return 'action-work';
    }
    if (action.includes('喝') || action.includes('咖啡')) {
      return 'action-drink';
    }
    if (action.includes('走') || action.includes('散步')) {
      return 'action-walk';
    }
    return 'action-idle';
  };

  const getCharacterPosition = (occupation: string) => {
    const occ = occupation.toLowerCase();
    if (occ.includes('设计师')) {
      return 'right-8';
    }
    if (occ.includes('教练')) {
      return 'left-10';
    }
    return 'left-8';
  };

  const getEnvironmentElements = () => {
    const occupation = character.occupation.toLowerCase();
    const hobbies = character.hobbies.join(' ').toLowerCase();
    
    if (occupation.includes('工程师') || occupation.includes('程序员')) {
      return (
        <>
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-[#2d3748]"></div>
          <div className="absolute bottom-10 left-4 w-16 h-6 bg-[#1a202c] rounded-sm"></div>
        </>
      );
    }
    
    if (occupation.includes('设计师') || occupation.includes('画')) {
      return (
        <>
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-[#2d3748]"></div>
          <div className="absolute bottom-10 left-2 w-20 h-16 bg-[#4a5568] rounded-sm"></div>
        </>
      );
    }
    
    if (occupation.includes('教练') || occupation.includes('运动')) {
      return (
        <>
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-[#2d3748]"></div>
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-[#2f4f4f]"></div>
        </>
      );
    }
    
    return (
      <>
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-[#2d3748]"></div>
      </>
    );
  };

  const getHobbyElements = () => {
    const hobbies = character.hobbies.join(' ').toLowerCase();
    
    if (hobbies.includes('咖啡')) {
      return <div className="absolute bottom-12 right-8 w-4 h-6 bg-[#718096] rounded-sm"></div>;
    }
    
    if (hobbies.includes('画') || hobbies.includes('速写')) {
      return <div className="absolute bottom-12 left-4 w-5 h-7 bg-[#718096] rounded-sm rotate-[-10deg]"></div>;
    }
    
    if (hobbies.includes('足球') || hobbies.includes('运动')) {
      return <div className="absolute bottom-10 right-10 w-4 h-4 bg-[#e53e3e] rounded-full"></div>;
    }
    
    return null;
  };

  // 获取随机旋转角度，增加游戏卡片的随机性
  const getRandomRotation = () => {
    const rotations = [-1, 0, 1];
    return rotations[Math.floor(Math.random() * rotations.length)];
  };

  return (
    <div 
      className={`observation-window cursor-pointer relative`} 
      onClick={toggleSelected}
      style={{ transform: `rotate(${getRandomRotation()}deg)` }}
    >
      <div className={`border-4 ${getMoodColor(mood)} pixel-border bg-[#0f172a] overflow-hidden relative group ${glitchActive ? 'glitch' : ''} ${selected ? 'ring-4 ring-yellow-400' : ''}`}>
        {/* 扑克牌风格角落装饰 */}
          <div className="absolute top-1 left-2 text-[#e53e3e] font-bold text-lg opacity-30">
            {index % 13 + 1}
          </div>
          <div className="absolute bottom-1 right-2 text-[#e53e3e] font-bold text-lg opacity-30 rotate-180">
            {index % 13 + 1}
          </div>

          <div className="bg-[#1e293b] px-3 py-1.5 text-xs flex justify-between items-center border-b-4 border-black">
          <div className="flex items-center gap-2">
              <span className="font-bold text-white pixel-font">{character.name}</span>
              <span className="text-gray-400 text-[10px]">{character.age}岁 · {character.occupation}</span>
            </div>
          <div className="flex items-center gap-2 bg-black/50 px-2 py-1 rounded-sm">
              <span className={`w-3 h-3 ${getMoodDotColor(mood)} rounded-full pixel-border`}></span>
              <span className="text-gray-300 text-[10px] font-mono">{currentTime}</span>
            </div>
        </div>
        
        <div className="bg-[#0a0a0a] h-48 relative overflow-hidden border-2 border-black">
          {/* 像素网格背景 */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9IiMyMjIiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
          {/* 环境元素 */}
          {getEnvironmentElements()}
          
          {/* 角色像素形象 */}
          <div className={`absolute bottom-10 ${getCharacterPosition(character.occupation)} w-8 h-12 ${getActionClass(currentAction)}`}>
            <div className="w-6 h-6 bg-[#4a5568] rounded-full mx-auto"></div>
            <div className="w-8 h-8 bg-[#4a5568] mt-1 rounded-sm"></div>
          </div>
          
          {/* 爱好相关元素 */}
          {getHobbyElements()}
          
          {/* 当前动作提示 */}
          <div className="absolute top-3 left-3 bg-black/70 px-2 py-0.5 text-xs rounded shadow-lg">
            {currentAction}
          </div>
          
          {/* 微小互动提示 */}
          {hint && (
            <div 
              id={`hint-${character.character_id}`}
              className="absolute top-10 left-10 bg-black/70 px-2 py-0.5 text-xs rounded shadow-lg hidden"
            >
              {hint}
            </div>
          )}
        </div>
        
        {/* 悬停放大提示 */}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pixel-border border-dashed border-white/30">
          <span className="text-[10px] bg-[var(--pixel-green)] text-black px-3 py-1 rounded-sm pixel-border border-black font-bold transform rotate-[1deg]">
            点击查看详情 <i className="fa fa-search-plus ml-1"></i>
          </span>
        </div>
        
        {/* 扫描线效果 */}
        <div className="scanline absolute inset-0 pointer-events-none"></div>
      </div>
    </div>
  );
}
