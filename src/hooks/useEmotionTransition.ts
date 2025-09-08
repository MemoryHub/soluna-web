import { useState, useEffect, useRef } from 'react';
import { EmotionData } from '@/types/emotion';

interface EmotionTransitionState extends EmotionData {
  isTransitioning: boolean;
  previousColor?: string;
  animationClass?: string;
}

interface UseEmotionTransitionProps {
  initialEmotion: EmotionData;
  transitionDuration?: number;
}

export const useEmotionTransition = ({ 
  initialEmotion, 
  transitionDuration = 800 
}: UseEmotionTransitionProps) => {
  const [currentEmotion, setCurrentEmotion] = useState<EmotionTransitionState>({
    ...initialEmotion,
    isTransitioning: false,
    previousColor: initialEmotion.color,
    animationClass: ''
  });

  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const triggerEmotionUpdate = (newEmotion: EmotionData) => {
    // 清除之前的超时
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }

    // 计算情绪变化强度
    const pleasureChange = Math.abs(newEmotion.pleasure_score - currentEmotion.pleasure_score);
    const arousalChange = Math.abs(newEmotion.arousal_score - currentEmotion.arousal_score);
    const dominanceChange = Math.abs(newEmotion.dominance_score - currentEmotion.dominance_score);
    
    const totalChange = pleasureChange + arousalChange + dominanceChange;
    
    // 根据变化强度选择动画
    let animationClass = '';
    if (totalChange > 1.5) {
      animationClass = 'emotion-shake-strong';
    } else if (totalChange > 0.8) {
      animationClass = 'emotion-shake-medium';
    } else if (totalChange > 0.3) {
      animationClass = 'emotion-shake-gentle';
    }

    // 开始过渡动画
    setCurrentEmotion(prev => ({
      ...newEmotion,
      isTransitioning: true,
      previousColor: prev.color,
      animationClass
    }));

    // 动画结束后清除过渡状态
    transitionTimeoutRef.current = setTimeout(() => {
      setCurrentEmotion(prev => ({
        ...prev,
        isTransitioning: false,
        previousColor: undefined,
        animationClass: ''
      }));
    }, transitionDuration);

    // 添加额外的表情动画
    if (newEmotion.emoji !== currentEmotion.emoji) {
      animationTimeoutRef.current = setTimeout(() => {
        setCurrentEmotion(prev => ({
          ...prev,
          animationClass: 'emotion-bounce'
        }));
        
        setTimeout(() => {
          setCurrentEmotion(prev => ({
            ...prev,
            animationClass: ''
          }));
        }, 500);
      }, 200);
    }
  };

  // 清理函数
  const cleanup = () => {
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }
  };

  useEffect(() => {
    return cleanup;
  }, []);

  return {
    currentEmotion,
    triggerEmotionUpdate,
    cleanup
  };
};