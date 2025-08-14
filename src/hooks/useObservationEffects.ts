import { useEffect, useRef } from 'react';

export const useObservationEffects = () => {
  const tickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 事件滚动动画
    const ticker = tickerRef.current;
    if (!ticker) return;

    let tickerPosition = 0;
    const animateTicker = () => {
      tickerPosition -= 1;
      if (tickerPosition < -ticker.offsetWidth / 2) {
        tickerPosition = window.innerWidth;
      }
      ticker.style.transform = `translateX(${tickerPosition}px)`;
      requestAnimationFrame(animateTicker);
    };
    
    const animationId = requestAnimationFrame(animateTicker);
    
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  // 随机显示小动作提示
  useEffect(() => {
    const showRandomHints = () => {
      const hints = document.querySelectorAll('[id^="hint-"]');
      if (hints.length === 0) return;
      
      const randomHint = hints[Math.floor(Math.random() * hints.length)] as HTMLElement;
      if (randomHint) {
        randomHint.classList.remove('hidden');
        setTimeout(() => {
          randomHint.classList.add('hidden');
        }, 3000);
      }
    };

    const interval = setInterval(showRandomHints, 15000); // 每15秒随机显示一个小动作
    
    return () => clearInterval(interval);
  }, []);

  return { tickerRef };
};
