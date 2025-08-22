'use client';
import React from 'react';

interface AlphabetFilterProps {
  selectedLetter: string;
  onLetterSelect: (letter: string) => void;
}

export default function AlphabetFilter({ selectedLetter, onLetterSelect }: AlphabetFilterProps) {
  // 生成A-Z字母数组
  const letters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
  // 添加"全部"选项
  const filterOptions = ['全部', ...letters];

  return (
    <div className="bg-[#232a39] border border-[#2d3748] rounded-sm p-1 h-fit sticky top-4 min-w-[40px] z-10">
      {filterOptions.map((option) => (
        <button
          key={option}
          onClick={() => onLetterSelect(option === '全部' ? '' : option)}
          disabled={selectedLetter === (option === '全部' ? '' : option)}
          className={`px-1.5 py-1 text-[10px] font-mono transition-all duration-200 ${selectedLetter === (option === '全部' ? '' : option) ? 'bg-[#38b2ac] text-[#1a1f29] border border-[#4fd1c5] transform scale-105 shadow-[0_0_3px_rgba(56,178,172,0.5)] cursor-not-allowed' : 'bg-[#2d3748] text-gray-300 border border-[#3d4a60] hover:bg-[#3d4a60] hover:border-[#4d5a70]'} pixel-button w-full text-center rounded-sm mb-0.5`}
          aria-label={`筛选以${option}开头的角色`}
        >
          {option === '全部' ? '全' : option}
        </button>
      ))}
    </div>
  );
}