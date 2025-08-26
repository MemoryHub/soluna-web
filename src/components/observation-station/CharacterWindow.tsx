'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Character, MoodType } from '@/types/character';
import { EnvironmentDefinition, environments, interactionAnimations, InteractionAnimation } from '@/config/environmentConfig';
import { useUser } from '@/hooks/useUser';

// 确保JSX类型被正确识别
declare namespace JSX {
  interface IntrinsicElements {
    [key: string]: any;
  }
}

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
  const { login, isLoggedIn } = useUser();
  // 游戏状态
  const [selected, setSelected] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);
  const [flickerActive, setFlickerActive] = useState(false);
  const [currentAnimation, setCurrentAnimation] = useState('idle');
  const animationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // 互动统计状态
  const [interactionStats, setInteractionStats] = useState({
    feed: 0,
    comfort: 0,
    overtime: 0,
    water: 0
  });
  
  // 当前点击的按钮，用于显示文字效果
  const [clickedButton, setClickedButton] = useState<string | null>(null);
  const [showButtonText, setShowButtonText] = useState(false);
  
  // 当前显示的动画
  const [currentInteractionAnimation, setCurrentInteractionAnimation] = useState<InteractionAnimation | null>(null);
  
  // 移动端互动按钮显示状态
  const [showMobileActions, setShowMobileActions] = useState(false);
  
  // 处理互动按钮点击
  const handleInteraction = (type: 'feed' | 'comfort' | 'overtime' | 'water') => {
    // 如果已登录，执行互动逻辑
    setInteractionStats(prev => ({
      ...prev,
      [type]: prev[type] + 1
    }));
    
    // 设置当前点击的按钮并显示文字
    setClickedButton(type);
    setShowButtonText(true);
    
    // 2秒后隐藏文字
    setTimeout(() => {
      setShowButtonText(false);
      setTimeout(() => {
        setClickedButton(null);
      }, 300); // 等待动画完成
    }, 2000);
    
    // 显示互动动画
    const animation = interactionAnimations[type];
    if (animation) {
      setCurrentInteractionAnimation(animation);
      // 根据动画持续时间设置隐藏动画的定时器
      setTimeout(() => {
        setCurrentInteractionAnimation(null);
      }, animation.duration);
    }
    
    // 可以在这里添加与后端的交互逻辑
  };

  // 处理按钮点击，添加登录验证
  const handleButtonClick = (type: 'feed' | 'comfort' | 'overtime' | 'water') => {
    if (isLoggedIn) {
      handleInteraction(type);
    } else {
      login(() => handleInteraction(type));
    }
  };

  // 随机触发故障效果和动画切换
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.97) {
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 100);
      }
    }, 1000);

    // 随机切换动画效果
        animationIntervalRef.current = setInterval(() => {
          // 增加权重，让idle状态出现的概率更高
          const animations = ['idle', 'idle', 'idle', 'typing', 'drinking', 'walking'];
          const randomIndex = Math.floor(Math.random() * animations.length);
          setCurrentAnimation(animations[randomIndex]);
        }, 3000 + Math.random() * 3000); // 3-6秒随机间隔

    return () => {
      clearInterval(glitchInterval);
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
      }
    };
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
      case 'calm': return 'border-blue-500';
      case 'anxious': return 'border-orange-600';
      default: return 'border-orange-500';
    }
  };

  const getMoodDotColor = (mood: MoodType) => {
    switch (mood) {
      case 'happy': return 'bg-green-500';
      case 'neutral': return 'bg-orange-500';
      case 'sad': return 'bg-red-500';
      case 'excited': return 'bg-yellow-500';
      case 'calm': return 'bg-blue-500';
      case 'anxious': return 'bg-orange-600';
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

  // 1. 位置系统：只在页面加载时随机一次
  const [characterPosition, setCharacterPosition] = useState(() => {
    // 随机位置列表，可以根据需要调整
    const positions = ['left-8', 'right-8', 'left-1/4', 'right-1/4', 'left-10', 'right-10'];
    const randomIndex = Math.floor(Math.random() * positions.length);
    return positions[randomIndex];
  });

  // 获取角色位置的函数
  const getCharacterPosition = () => {
    return characterPosition;
  };

  // 根据职业关键词匹配环境
  const getEnvironmentElements = () => {
    const occupation = character.occupation.toLowerCase();
    
    // 尝试匹配环境
    for (const env of environments) {
      if (env.keywords.some(keyword => occupation.includes(keyword))) {
        return env.element;
      }
    }
    
    // 如果没有匹配的环境，返回默认环境
    return environments.find(env => env.name === '默认环境')?.element;
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
  }
  
  // 格式化数字，将大数字转换为k或M的缩写形式
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  return (
    <div 
      className={`observation-window cursor-pointer relative flex justify-center items-center p-2`} 
      onClick={toggleSelected}
      style={{ transform: `rotate(${getRandomRotation()}deg)`, minHeight: '280px' }}
    >
      <div className={`border-4 ${getMoodColor(mood)} pixel-border bg-[#0f172a] overflow-hidden relative group ${glitchActive ? 'glitch' : ''} ${selected ? 'ring-4 ring-yellow-400' : ''} w-full max-w-[280px] mx-auto`}>
        {/* 扑克牌风格角落装饰 */}
          <div className="absolute top-1 left-2 text-[#e53e3e] font-bold text-lg opacity-30">
            {index % 13 + 1}
          </div>
          <div className="absolute bottom-1 right-2 text-[#e53e3e] font-bold text-lg opacity-30 rotate-180">
            {index % 13 + 1}
          </div>

          <div className="bg-[#1e293b] px-2 py-1 sm:px-3 sm:py-1.5 text-xs flex justify-between items-center border-b-4 border-black overflow-hidden whitespace-nowrap text-ellipsis">
          <div className="flex items-center gap-2">
              <span className="font-bold text-white pixel-font">{character.name}</span>
            <span className="text-gray-400 text-[10px] hidden sm:inline">{character.age}岁 · {character.occupation}</span>
            </div>
          <div className="flex items-center gap-2 bg-black/50 px-2 py-1 rounded-sm">
              <span className={`w-3 h-3 ${getMoodDotColor(mood)} rounded-full pixel-border`}></span>
              <span className="text-gray-300 text-[10px] font-mono">{currentTime}</span>
            </div>
        </div>
        
        <div className="bg-gradient-to-br from-gray-900 via-slate-900 to-black h-36 sm:h-48 relative overflow-hidden border-2 border-black">
          {/* 像素网格背景 */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9IiMyMjIiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
          {/* 环境元素 */}
          {getEnvironmentElements()}
          
          {/* 角色像素形象 */}
            <div className={`absolute bottom-10 ${getCharacterPosition()} w-8 h-12 ${getActionClass(currentAction)} animate-breathe ${currentAnimation === 'idle' ? 'animate-idle' : ''} ${currentAnimation === 'typing' ? 'animate-typing' : ''} ${currentAnimation === 'drinking' ? 'animate-drinking' : ''} ${currentAnimation === 'walking' ? 'animate-walking' : ''}`}>
            {(character.gender === 'female' || character.gender === '女') ? (
              <>
                {/* 小辫子 */}
                <div className="absolute left-1 top-0 w-1 h-3 bg-[#f9a8d4] rounded-b-full"></div>
                <div className="absolute right-1 top-0 w-1 h-3 bg-[#f9a8d4] rounded-b-full"></div>
                {/* 头部 */}
                <div className="w-6 h-6 bg-[#f9a8d4] rounded-full mx-auto mt-2"></div>
                {/* 身体 */}
                <div className="w-8 h-8 bg-[#f9a8d4] mt-1 rounded-sm"></div>
              </>
            ) : (
              <>
                {/* 头部 */}
                <div className="w-6 h-6 bg-[#4a5568] rounded-full mx-auto"></div>
                {/* 身体 */}
                <div className="w-8 h-8 bg-[#4a5568] mt-1 rounded-sm"></div>
              </>
            )}
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
        
        {/* 互动动画显示区域 */}
        {currentInteractionAnimation && currentInteractionAnimation.animation}
        </div>
        
        {/* 悬停放大提示 */}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pixel-border border-dashed border-white/30">
          <span className="text-[9px] bg-[var(--pixel-green)] text-black px-2 py-1 rounded-sm pixel-border border-black font-bold transform rotate-[1deg]">
            点击查看详情 <i className="fa fa-search-plus ml-1"></i>
          </span>
        </div>
        
        {/* 互动统计显示 */}
        <div className="absolute bottom-8 right-2 text-[8px] bg-black/60 text-white px-1.5 py-0.5 rounded-sm opacity-70 z-10">
          <div className="flex gap-2">
            <span className="text-red-400">🍖{formatNumber(interactionStats.feed)}</span>
            <span className="text-green-400">🤗{formatNumber(interactionStats.comfort)}</span>
            <span className="text-blue-400">💼{formatNumber(interactionStats.overtime)}</span>
            <span className="text-cyan-400">🪣{formatNumber(interactionStats.water)}</span>
          </div>
        </div>
        
        {/* 扫描线效果 */}
        <div className="scanline absolute inset-0 pointer-events-none"></div>
        
        {/* 移动端互动按钮触发器 - 仅在移动设备上显示 */}
        <div className="block sm:hidden absolute bottom-2 left-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMobileActions(!showMobileActions);
            }}
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-[8px] px-2 py-1 rounded-sm pixel-border border-2 border-black shadow-md"
          >
            {showMobileActions ? '收起互动' : '互动'}
          </button>
        </div>
        
        {/* 互动按钮区域 - 电脑端通过悬停显示，移动端通过点击触发器显示 */}
        <div className={`absolute bottom-2 left-2 flex flex-col gap-1 transition-opacity duration-300 ${showMobileActions ? 'opacity-100' : 'hidden sm:flex sm:opacity-0 sm:group-hover:opacity-100'}`}>
          {/* 投喂TA按钮 */}
          <button 
            onClick={(e) => { e.stopPropagation(); handleButtonClick('feed'); }}
            className="w-6 h-6 bg-red-600 hover:bg-red-500 pixel-border border-2 border-black flex items-center justify-center text-white shadow-md active:translate-y-0.5 transition-transform"
            title="投喂TA"
          >
            <span className="text-[9px] font-bold">🍖</span>
          </button>
          
          {/* 安慰一下按钮 */}
          <button 
            onClick={(e) => { e.stopPropagation(); handleButtonClick('comfort'); }}
            className="w-6 h-6 bg-green-600 hover:bg-green-500 pixel-border border-2 border-black flex items-center justify-center text-white shadow-md active:translate-y-0.5 transition-transform"
            title="安慰一下"
          >
            <span className="text-[9px] font-bold">🤗</span>
          </button>
          
          {/* 拉去加班按钮 */}
          <button 
            onClick={(e) => { e.stopPropagation(); handleButtonClick('overtime'); }}
            className="w-6 h-6 bg-blue-600 hover:bg-blue-500 pixel-border border-2 border-black flex items-center justify-center text-white shadow-md active:translate-y-0.5 transition-transform"
            title="拉去加班"
          >
            <span className="text-[9px] font-bold">💼</span>
          </button>
          
          {/* 泼冷水按钮 */}
          <button 
            onClick={(e) => { e.stopPropagation(); handleButtonClick('water'); }}
            className="w-6 h-6 bg-cyan-600 hover:bg-cyan-500 pixel-border border-2 border-black flex items-center justify-center text-white shadow-md active:translate-y-0.5 transition-transform"
            title="泼冷水"
          >
            <span className="text-[9px] font-bold">🪣</span>
          </button>
        </div>
        
        {/* 点击按钮后显示的文字 */}
        {clickedButton && (
          <div 
            className={`absolute bottom-2 left-10 bg-black/80 text-white text-[8px] px-1.5 py-0.5 rounded-sm transition-opacity duration-300 ${showButtonText ? 'opacity-100' : 'opacity-0'}`}
          >
            {clickedButton === 'feed' && '投喂TA'}
            {clickedButton === 'comfort' && '安慰一下'}
            {clickedButton === 'overtime' && '拉去加班'}
            {clickedButton === 'water' && '泼冷水'}
          </div>
        )}
      </div>
    </div>
  );
}
