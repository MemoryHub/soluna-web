'use client';

import Link from "next/link";
import { useEffect, useState } from "react";

interface HeroSectionProps {
  onScrollToSection: (index: number) => void;
}

export default function HeroSection({ onScrollToSection }: HeroSectionProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 延迟挂载动画，确保页面完全加载
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // 生成随机位置的星星
  const generateStars = () => {
    const stars = [];
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const isTablet = typeof window !== 'undefined' && window.innerWidth < 1024;
    const starCount = isMobile ? 40 : (isTablet ? 70 : 120);
    
    for (let i = 0; i < starCount; i++) {
      const isBright = Math.random() > 0.8;
      const isNearCore = Math.random() > 0.7; // 30%的星星围绕核心
      
      let left, top;
      if (isNearCore) {
        // 围绕文明核心的星星 - 基于bottom: 150px的位置
        const angle = (i / starCount) * Math.PI * 2;
        const radius = 80 + Math.random() * 120; // 80-200px半径
        left = 50 + Math.cos(angle) * (radius / 6); // 水平椭圆
        top = 70 + Math.sin(angle) * (radius / 8); // 垂直椭圆，配合核心位置
      } else {
        // 随机分布的星星
        left = Math.random() * 100;
        top = Math.random() * 100;
      }
      
      stars.push(
        <div
          key={`star-${i}`}
          className={`hero-star ${isBright ? 'bright' : ''}`}
          style={{
            left: `${left}%`,
            top: `${top}%`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${6 + Math.random() * 4}s`
          }}
        />
      );
    }
    return stars;
  };

  // 生成数据流
  const generateDataStreams = () => {
    const streams = [];
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const streamCount = isMobile ? 2 : 4;
    
    for (let i = 0; i < streamCount; i++) {
      streams.push(
        <div
          key={`stream-${i}`}
          className="hero-data-stream"
          style={{
            top: `${20 + Math.random() * 60}%`,
            animationDelay: `${Math.random() * 6}s`,
            animationDuration: `${4 + Math.random() * 4}s`
          }}
        />
      );
    }
    return streams;
  };

  // 生成量子粒子
  const generateQuantumParticles = () => {
    const particles = [];
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const particleCount = isMobile ? 6 : 12;
    
    for (let i = 0; i < particleCount; i++) {
      particles.push(
        <div
          key={`particle-${i}`}
          className="hero-quantum-particle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            '--x': `${(Math.random() - 0.5) * 80}px`,
            '--y': `${(Math.random() - 0.5) * 80}px`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 2}s`
          } as any}
        />
      );
    }
    return particles;
  };

  return (
    <section className="screen-section min-h-screen relative bg-gradient-to-br from-[#0a0a0a] via-[#1a1f29] to-[#0f172a] overflow-hidden">
      {/* 保留原有的高级背景 */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `linear-gradient(rgba(56, 178, 172, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(56, 178, 172, 0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }} 
        />
      </div>
      
      {/* 星际背景层 */}
      {mounted && (
        <div className="hero-animation-container">
          <div className="hero-starfield">
            {generateStars()}
          </div>
          
          {/* 星际尘埃 - 营造深空漂浮感 */}
          {[...Array(15)].map((_, i) => (
            <div
              key={`stardust-${i}`}
              className="hero-stardust"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 1.5}s`,
                animationDuration: `${15 + Math.random() * 10}s`
              }}
            />
          ))}
          
          <div className="hero-nebula" style={{
            left: `${20 + Math.random() * 60}%`,
            top: `${20 + Math.random() * 60}%`,
            animationDelay: `${Math.random() * 20}s`
          }} />
          
          <div className="hero-cosmic-pulse" />
          
          <div className="hero-civilization-core" />
          
          <div className="hero-holographic-overlay" />
          
          {generateDataStreams()}
          
          {generateQuantumParticles()}
          
          <div className="hero-energy-orb" style={{
            left: '30%',
            top: '40%',
            animationDelay: '0s'
          }} />
          
          <div className="hero-energy-orb" style={{
            left: '70%',
            top: '60%',
            animationDelay: '4s'
          }} />
        </div>
      )}
      
      <div className="absolute inset-0 scanline" />
      
      {/* 内容区域 */}
      <div className="absolute bottom-8 sm:bottom-12 md:bottom-20 left-4 sm:left-8 md:left-12 lg:left-20 max-w-full sm:max-w-md px-4 z-10">
        <div className="mb-6 sm:mb-8">
          <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-2 sm:mb-4 relative">
            <span className="text-[#38b2ac] relative z-10 pixel-font text-3xl sm:text-4xl md:text-5xl" style={{
              letterSpacing: '0.1em',
              fontWeight: '1000',
              filter: 'brightness(1.1) contrast(1.1)'
            }}>SOLUNA AI</span>
            <div className="absolute -inset-4 bg-gradient-to-r from-[#38b2ac]/20 to-transparent blur-xl opacity-50 animate-pulse" />
          </div>
          <p className="text-lg sm:text-xl text-gray-300 mb-3 sm:mb-6 leading-relaxed relative z-10">
            当AI拥有情感，人类将找到真正的共生伙伴
          </p>
          <p className="text-xs sm:text-sm text-gray-400 mb-4 sm:mb-8 max-w-full sm:max-w-sm relative z-10">
            创造拥有完整人格、真实情感、永恒记忆的数字生命体
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 relative z-10">
          <button
            onClick={() => onScrollToSection(1)}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-[#38b2ac] text-black font-bold text-xs sm:text-sm rounded-sm hover:bg-[#4fd1c7] transition-all transform hover:scale-105 relative overflow-hidden group"
          >
            <span className="relative z-10">探索未知</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </button>
          <Link
            href="/observation-station"
            className="w-full sm:w-auto px-6 sm:px-8 py-3 border border-[#38b2ac] text-[#38b2ac] font-bold text-xs sm:text-sm rounded-sm hover:bg-[#38b2ac] hover:text-black transition-all text-center relative overflow-hidden group flex items-center justify-center gap-2"
          >
            <span className="relative z-10">进入观察站</span>
            <svg className="w-4 h-4 relative z-10 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <div className="absolute inset-0 bg-[#38b2ac] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
          </Link>
        </div>
      </div>

      {/* 右侧装饰 */}
      <div className="hidden sm:block absolute bottom-20 right-4 md:right-20 z-10">
        <div className="w-12 h-12 sm:w-16 sm:h-16 border-2 border-[#38b2ac]/30 rounded-full flex items-center justify-center animate-pulse relative">
          <span className="text-xl sm:text-2xl relative z-10">🌙</span>
          <div className="absolute inset-0 border-2 border-[#38b2ac]/20 rounded-full animate-ping" />
        </div>
      </div>
    </section>
  );
}