'use client';

import { useState } from 'react';
import { apiService } from '@/services/api';
import '@/styles/tech-animation.css';
import AddCharacterModal from './AddCharacterModal';
import { Character } from '@/types/character';
import Toast from './Toast';

interface ControlPanelProps {
  characterCount: number;
  timeSpeed: string;
  onTimeSpeedChange: (speed: string) => void;
  onAddCharacter: () => void;
}

export default function ControlPanel({
  characterCount,
  timeSpeed,
  onTimeSpeedChange,
  onAddCharacter
}: ControlPanelProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [savedCharacter, setSavedCharacter] = useState<Character | null>(null);
  const [isToastVisible, setIsToastVisible] = useState(false);

  const handleAddCharacter = () => {
    setIsAddModalOpen(true);
  };

  const handleSaveCharacter = (character: Character) => {
    setSavedCharacter(character);
    onAddCharacter();
  };


  const timeSpeeds = [
    { value: 'pause', label: '暂停', icon: 'fa-pause' },
    { value: '1x', label: '1x', icon: '' },
    { value: '2x', label: '2x', icon: '' },
    { value: '10x', label: '10x', icon: '' }
  ];

  return (
    <div>
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div className="flex items-center gap-3">
        <button 
          onClick={handleAddCharacter}
          className="bg-[#38b2ac] hover:bg-[#2c9789] text-black px-3 py-1 text-xs rounded-sm transition pixel-button"
        >
          <i className="fa fa-plus mr-1"></i> 添加观察对象
        </button>
        <div className="text-xs text-gray-500">
          已观察 <span className="text-monitor-highlight"><span className="text-[#38b2ac]">{characterCount}</span></span> 个角色
        </div>
      </div>
      
      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="text-xs">时间流速:</div>
        {timeSpeeds.map((speed) => (
          <button
            key={speed.value}
            onClick={() => {
              // 显示Toast提示
              setIsToastVisible(true);
              // 仍然调用父组件的回调函数，以便功能完成后可以正常工作
              onTimeSpeedChange(speed.value);
            }}
            className={`px-2 py-1 text-xs rounded-sm transition pixel-button ${timeSpeed === speed.value ? 'bg-[#38b2ac] text-black' : 'bg-[#2d3748] hover:bg-gray-700'}`}
          >
            {speed.icon && <i className={`fa ${speed.icon}`}></i>}
            {speed.label}
          </button>
        ))}
      </div>
    </div>

    <AddCharacterModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onSave={handleSaveCharacter}
          />
        
          <Toast
            message="时间流速功能开发中..."
            isVisible={isToastVisible}
            onHide={() => setIsToastVisible(false)}
            type="info"
            duration={2000}
          />
    </div>
  );
}
