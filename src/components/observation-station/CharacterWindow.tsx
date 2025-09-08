'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Character, MoodType } from '@/types/character';
import { environments, interactionAnimations, InteractionAnimation } from '@/config/environmentConfig';
import { interactionApiService } from '@/services/interaction_api';
import { InteractionType } from '@/types/interaction';
import { useUser } from '@/hooks/useUser';
import { useEmotionTransition } from '@/hooks/useEmotionTransition';
import { EmotionData } from '@/types/emotion';

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
  interactionStats: {
    feed: number;
    comfort: number;
    overtime: number;
    water: number;
  };
  emotion?: {
    color: string;
    vibe: string;
    emoji: string;
    current_emotion_score: number;
  };
}

export default function CharacterWindow({
  character,
  currentAction,
  currentTime,
  mood,
  hint,
  onClick,
  index,
  interactionStats,
  emotion
}: CharacterWindowProps) {
  const { login, isLoggedIn, userInfo } = useUser();
  // 游戏状态
  const [selected, setSelected] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);
  const [currentAnimation, setCurrentAnimation] = useState('idle');
  const animationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // 互动统计状态 - 直接使用传入的数据
  const [stats, setStats] = useState(interactionStats);
  
  

  // 当前点击的按钮，用于显示文字效果
  const [clickedButton, setClickedButton] = useState<string | null>(null);
  const [showButtonText, setShowButtonText] = useState(false);
  
  // 当前显示的动画
  const [currentInteractionAnimation, setCurrentInteractionAnimation] = useState<InteractionAnimation | null>(null);
  
  // 移动端互动按钮显示状态
  const [showMobileActions, setShowMobileActions] = useState(false);
  
  // 情绪状态管理
  const [currentEmotion, setCurrentEmotion] = useState(emotion);
  const [isEmotionAnimating, setIsEmotionAnimating] = useState(false);
  const emotionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);
  const [speechText, setSpeechText] = useState('');
  const speechTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // 处理互动操作
  const handleInteraction = async (type: InteractionType) => {
    if (!userInfo?.user_id) return;
    
    // 立即在页面上更新统计数据，提供即时反馈
    const updateKeyMap = {
      'feed': 'feed',
      'comfort': 'comfort',
      'overtime': 'overtime',
      'water': 'water'
    };
    
    const updateKey = updateKeyMap[type];
    if (updateKey) {
      setStats(prevStats => ({
        ...prevStats,
        [updateKey]: prevStats[updateKey as keyof typeof prevStats] + 1
      }));
    }
    
    try {
      // 调用API执行互动
      const response = await interactionApiService.performInteraction({
        user_id: userInfo.user_id,
        character_id: character.character_id,
        interaction_type: type
      });
      
      if (response.recode === 200 && response.data) {
          // 用服务器返回的真实数据更新本地统计数据（覆盖之前的临时加1）
          if (response.data.updated_stats) {
            const newStats = response.data.updated_stats;
            setStats({
              feed: newStats.feed_count,
              comfort: newStats.comfort_count,
              overtime: newStats.overtime_count,
              water: newStats.water_count
            });
          }
          
          // 更新情绪信息（如果有新的情绪数据）
          if (response.data.current_emotion) {
            updateEmotionWithAnimation(response.data.current_emotion);
          }
          
          // 设置当前点击的按钮并显示文字
          const actionText = {
            'feed': '投喂TA！',
            'comfort': '安慰一下！',
            'overtime': '拉去加班！',
            'water': '泼冷水！'
          }[type] || '操作成功！';
          setClickedButton(actionText);
          setShowButtonText(true);
          
          // 2秒后隐藏文字
          setTimeout(() => {
            setShowButtonText(false);
            setTimeout(() => {
              setClickedButton(null);
            }, 300);
          }, 2000);
          
          // 显示互动动画，并在动画结束后显示说话气泡
          const animationKey = type.toLowerCase();
          const animation = interactionAnimations[animationKey];
          if (animation) {
            setCurrentInteractionAnimation(animation);
            setTimeout(() => {
              setCurrentInteractionAnimation(null);
              // 动画结束后显示说话气泡
              if (response.data.current_emotion?.description) {
                showSpeechBubbleWithText(response.data.current_emotion.description);
              }
            }, animation.duration);
          } else {
            // 如果没有动画，直接显示说话气泡
            if (response.data.current_emotion?.description) {
              showSpeechBubbleWithText(response.data.current_emotion.description);
            }
          }
        } else if (response.recode === 403) {
          // 今日已互动，显示明天再来的提示
          const actionText = {
            'feed': '今天吃撑了',
            'comfort': '不要过度关心',
            'overtime': '好累！明天再加吧',
            'water': '明天衣服干了再来！'
          }[type] || '操作';
          
          setClickedButton(`${actionText}`);
          setShowButtonText(true);
          
          // 回滚之前的临时加1
          if (updateKey) {
            setStats(prevStats => ({
              ...prevStats,
              [updateKey]: prevStats[updateKey as keyof typeof prevStats] - 1
            }));
          }
          
          // 3秒后隐藏提示
          setTimeout(() => {
            setShowButtonText(false);
            setTimeout(() => {
              setClickedButton(null);
            }, 300);
          }, 3000);
        }
    } catch (error) {
      console.error('互动操作失败:', error);
      // 发生错误时也回滚之前的临时加1
      if (updateKey) {
        setStats(prevStats => ({
          ...prevStats,
          [updateKey]: prevStats[updateKey as keyof typeof prevStats] - 1
        }));
      }
    }
  };

  // 同步props的interactionStats变化
  useEffect(() => {
    setStats(interactionStats);
  }, [interactionStats]);

  // 同步props的emotion变化
  useEffect(() => {
    setCurrentEmotion(emotion);
  }, [emotion]);

  // 优雅的情绪更新函数
  const updateEmotionWithAnimation = (newEmotionData: any) => {
    if (!newEmotionData) return;

    // 计算情绪变化强度
    const currentScores = {
      pleasure: currentEmotion?.current_emotion_score || 0,
      arousal: currentEmotion?.current_emotion_score || 0,
      dominance: currentEmotion?.current_emotion_score || 0
    };

    const newScores = {
      pleasure: newEmotionData.pleasure_score || 0,
      arousal: newEmotionData.arousal_score || 0,
      dominance: newEmotionData.dominance_score || 0
    };

    const changeIntensity = Math.abs(newScores.pleasure - currentScores.pleasure) + 
                           Math.abs(newScores.arousal - currentScores.arousal) + 
                           Math.abs(newScores.dominance - currentScores.dominance);

    // 根据变化强度选择动画
    let animationClass = '';
    if (changeIntensity > 2.0) {
      animationClass = 'emotion-shake-strong';
    } else if (changeIntensity > 1.0) {
      animationClass = 'emotion-shake-medium';
    } else if (changeIntensity > 0.3) {
      animationClass = 'emotion-shake-gentle';
    }

    // 触发动画
    if (animationClass) {
      setIsEmotionAnimating(true);
    }

    // 更新情绪数据
    setCurrentEmotion({
      color: newEmotionData.color,
      vibe: newEmotionData.vibe,
      emoji: newEmotionData.emoji,
      current_emotion_score: newEmotionData.current_emotion_score
    });

    // 清除动画状态
    if (emotionTimeoutRef.current) {
      clearTimeout(emotionTimeoutRef.current);
    }

    emotionTimeoutRef.current = setTimeout(() => {
      setIsEmotionAnimating(false);
    }, 1000);
  };

  // 清理定时器
  useEffect(() => {
    return () => {
      if (emotionTimeoutRef.current) {
        clearTimeout(emotionTimeoutRef.current);
      }
      if (speechTimeoutRef.current) {
        clearTimeout(speechTimeoutRef.current);
      }
    };
  }, []);

  // 显示说话气泡
  const showSpeechBubbleWithText = (text: string, duration: number = 3000) => {
    console.log('显示说话气泡:', text);
    setSpeechText(text);
    setShowSpeechBubble(true);
    
    // 清除之前的定时器
    if (speechTimeoutRef.current) {
      clearTimeout(speechTimeoutRef.current);
    }
    
    // 设置新的定时器
    speechTimeoutRef.current = setTimeout(() => {
      setShowSpeechBubble(false);
    }, duration);
  };

  // 处理按钮点击，添加登录验证
  // 处理互动按钮点击
  const handleButtonClick = (type: InteractionType) => {
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
    // 优先使用当前情绪的颜色，如果没有则回退到mood的默认颜色
    if (currentEmotion?.color) {
      return currentEmotion.color;
    }
    switch (mood) {
      case 'happy': return '#32CD32';
      case 'neutral': return '#808080';
      case 'sad': return '#DC143C';
      case 'excited': return '#FFD700';
      case 'calm': return '#4169E1';
      case 'anxious': return '#FF6347';
      default: return '#808080';
    }
  };

  const getMoodDotColor = (mood: MoodType) => {
    // 优先使用当前情绪的颜色，如果没有则回退到mood的默认颜色
    if (currentEmotion?.color) {
      return currentEmotion.color;
    }
    switch (mood) {
      case 'happy': return '#32CD32';
      case 'neutral': return '#808080';
      case 'sad': return '#DC143C';
      case 'excited': return '#FFD700';
      case 'calm': return '#4169E1';
      case 'anxious': return '#FF6347';
      default: return '#808080';
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
      id={`character-window-${character.character_id}`}
      className={`observation-window cursor-pointer relative flex justify-center items-center p-2 ${isEmotionAnimating ? 'emotion-animating' : ''}`} 
      onClick={toggleSelected}
      style={{ transform: `rotate(${getRandomRotation()}deg)`, minHeight: '280px' }}
    >
      <div 
        className={`border-4 pixel-border bg-[#0f172a] overflow-hidden relative group ${glitchActive ? 'glitch' : ''} ${selected ? 'ring-4 ring-yellow-400' : ''} ${isEmotionAnimating ? 'emotion-shake-gentle' : ''} w-full max-w-[280px] mx-auto border-color-transition ${isEmotionAnimating ? 'glow' : ''}`}
        style={{ borderColor: getMoodColor(mood) }}
      >
        {/* 扑克牌风格角落装饰 */}
          <div className="pixel-font absolute top-1 left-2 text-[#e53e3e] font-bold text-lg opacity-30">
            {index % 13 + 1}
          </div>
          <div className="pixel-font absolute bottom-1 right-2 text-[#e53e3e] font-weight:1000 text-lg opacity-30 rotate-180">
            {index % 13 + 1}
          </div>

          <div className="bg-[#1e293b] px-2 py-1 sm:px-3 sm:py-1.5 text-xs flex justify-between items-center border-b-4 border-black overflow-hidden whitespace-nowrap text-ellipsis">
          <div className="flex items-center gap-2">
              <span className="font-bold text-white">{character.name}</span>
            <span className="pixel-font text-gray-400 text-[10px] hidden sm:inline">{character.age}岁 · {character.occupation}</span>
            </div>
          <div className="flex items-center gap-2 bg-black/50 px-2 py-1 rounded-sm">
              <span 
                id={`mood-dot-${character.character_id}`}
                className={`w-3 h-3 rounded-full pixel-border mood-dot-transition ${isEmotionAnimating ? 'pulse' : ''}`}
                style={{ backgroundColor: getMoodDotColor(mood) }}
              ></span>
              <span id={`emoji-${character.character_id}`} className="pixel-font text-gray-300 text-[10px] font-mono text-color-transition">
                <span className={`emoji-transition ${isEmotionAnimating ? 'bounce' : ''}`}>
                  {currentEmotion?.emoji || emotion?.emoji || '😐'}
                </span>{' '}
                {currentEmotion?.vibe || emotion?.vibe || '扑克脸'}
              </span>
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
            
            {/* 说话气泡 - 显示在角色头部左上方 */}
            {showSpeechBubble && (
              <div 
                className="absolute -top-8 -left-4 bg-gray-800 text-white text-[10px] px-2 py-1 rounded shadow-lg border whitespace-nowrap z-50"
                style={{ borderColor: getMoodColor(mood) }}
              >
                {speechText}
              </div>
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
            <span className="pixel-font text-red-400">🍖{formatNumber(stats.feed)}</span>
            <span className="pixel-font text-green-400">🤗{formatNumber(stats.comfort)}</span>
            <span className="pixel-font text-blue-400">💼{formatNumber(stats.overtime)}</span>
            <span className="pixel-font text-cyan-400">🪣{formatNumber(stats.water)}</span>
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
            onClick={(e) => { e.stopPropagation(); handleButtonClick(InteractionType.FEED); }}
            className="w-6 h-6 pixel-border border-2 border-black flex items-center justify-center text-white shadow-md active:translate-y-0.5 transition-transform bg-red-600 hover:bg-red-500"
            title="投喂TA"
          >
            <span className="text-[9px] font-bold">🍖</span>
          </button>
          
          {/* 安慰一下按钮 */}
          <button 
            onClick={(e) => { e.stopPropagation(); handleButtonClick(InteractionType.COMFORT); }}
            className="w-6 h-6 pixel-border border-2 border-black flex items-center justify-center text-white shadow-md active:translate-y-0.5 transition-transform bg-green-600 hover:bg-green-500"
            title="安慰一下"
          >
            <span className="text-[9px] font-bold">🤗</span>
          </button>
          
          {/* 拉去加班按钮 */}
          <button 
            onClick={(e) => { e.stopPropagation(); handleButtonClick(InteractionType.OVERTIME); }}
            className="w-6 h-6 pixel-border border-2 border-black flex items-center justify-center text-white shadow-md active:translate-y-0.5 transition-transform bg-blue-600 hover:bg-blue-500"
            title="拉去加班"
          >
            <span className="text-[9px] font-bold">💼</span>
          </button>
          
          {/* 泼冷水按钮 */}
          <button 
            onClick={(e) => { e.stopPropagation(); handleButtonClick(InteractionType.WATER); }}
            className="w-6 h-6 pixel-border border-2 border-black flex items-center justify-center text-white shadow-md active:translate-y-0.5 transition-transform bg-cyan-600 hover:bg-cyan-500"
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
            {clickedButton}
          </div>
        )}
      </div>
      

    </div>
  );
}
