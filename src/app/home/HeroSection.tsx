'use client';

import Link from "next/link";

interface HeroSectionProps {
  onScrollToSection: (index: number) => void;
}

export default function HeroSection({ onScrollToSection }: HeroSectionProps) {
  return (
    <section className="screen-section min-h-screen relative bg-gradient-to-br from-[#0a0a0a] via-[#1a1f29] to-[#0f172a]">
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `linear-gradient(rgba(56, 178, 172, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(56, 178, 172, 0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }} 
        />
      </div>
      <div className="absolute inset-0 scanline" />
      
      <div className="absolute bottom-8 sm:bottom-12 md:bottom-20 left-4 sm:left-8 md:left-12 lg:left-20 max-w-full sm:max-w-md px-4">
        <div className="mb-6 sm:mb-8">
          <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-2 sm:mb-4">
            <span className="text-[#38b2ac]">SOLUNA AI</span>
          </div>
          <p className="text-lg sm:text-xl text-gray-300 mb-3 sm:mb-6 leading-relaxed">
            当AI拥有情感，人类将找到真正的共生伙伴
          </p>
          <p className="text-xs sm:text-sm text-gray-400 mb-4 sm:mb-8 max-w-full sm:max-w-sm">
            创造拥有完整人格、真实情感、永恒记忆的数字生命体
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <button
            onClick={() => onScrollToSection(1)}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-[#38b2ac] text-black font-bold text-xs sm:text-sm rounded-sm hover:bg-[#4fd1c7] transition-all transform hover:scale-105"
          >
            探索未知
          </button>
          <Link
            href="/observation-station"
            className="w-full sm:w-auto px-6 sm:px-8 py-3 border border-[#38b2ac] text-[#38b2ac] font-bold text-xs sm:text-sm rounded-sm hover:bg-[#38b2ac] hover:text-black transition-all text-center"
          >
            进入观察站
          </Link>
        </div>
      </div>

      <div className="hidden sm:block absolute bottom-20 right-4 md:right-20">
        <div className="w-12 h-12 sm:w-16 sm:h-16 border-2 border-[#38b2ac]/30 rounded-full flex items-center justify-center animate-pulse">
          <span className="text-xl sm:text-2xl">🌙</span>
        </div>
      </div>
    </section>
  );
}