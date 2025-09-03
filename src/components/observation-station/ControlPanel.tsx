'use client';

import { useState } from 'react';
import { apiService } from '@/services/api';
import '@/styles/tech-animation.css';
import AddCharacterModal from './AddCharacterModal';
import InviteCodeModal from './InviteCodeModal';
import { Character } from '@/types/character';
import Toast from './Toast';
import { useUser } from '../../hooks/useUser';
import { useInviteStatus } from '../../hooks/useInviteStatus';

interface ControlPanelProps {
  characterCount: number;
  timeSpeed: string;
  onTimeSpeedChange: (speed: string) => void;
  onAddCharacter: () => void;
  onRefresh?: () => void;
  refreshing?: boolean;
}

export default function ControlPanel({
  characterCount,
  timeSpeed,
  onTimeSpeedChange,
  onAddCharacter,
  onRefresh,
  refreshing = false
}: ControlPanelProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isInviteCodeModalOpen, setIsInviteCodeModalOpen] = useState(false);
  const [savedCharacter, setSavedCharacter] = useState<Character | null>(null);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const { isLoggedIn, userInfo, login } = useUser();
  const { hasBoundInviteCode } = useInviteStatus();

  // 检查邀请码绑定状态
  const checkInviteStatus = () => {
    // 如果已绑定邀请码，直接打开角色创建模态框
    if (hasBoundInviteCode()) {
      setIsAddModalOpen(true);
    } else {
      // 否则打开邀请码输入模态框
      setIsInviteCodeModalOpen(true);
    }
  };

  const handleAddCharacter = () => {
    if (isLoggedIn) {
      // 已登录，检查邀请码绑定状态
      checkInviteStatus();
    } else {
      // 未登录，先调用登录方法，登录成功后检查邀请码状态
      login(() => checkInviteStatus());
    }
  };

  // 邀请码绑定成功后的回调
  const handleInviteCodeSuccess = () => {
    // 邀请码绑定成功后，直接打开角色创建模态框
    // setIsAddModalOpen(true);
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
      {/* 以PC端为主的响应式布局 */}
      <div className="mb-6">
        {/* PC端：顶部控制栏 */}
        <div className="hidden md:flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={handleAddCharacter}
              className="bg-[#38b2ac] hover:bg-[#2c9789] text-black px-3 py-1 text-xs rounded-sm transition pixel-button"
            >
              <i className="fa fa-plus mr-1"></i> 添加观察对象
            </button>
            <div className="text-xs text-gray-500">
              已观察 <span className="text-monitor-highlight"><span className="pixel-font text-[#38b2ac]">{characterCount}</span></span> 个角色
            </div>
            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={refreshing}
                className={`px-3 py-1 text-xs bg-[#805ad5] text-white hover:bg-[#6b46c1] transition-colors flex items-center gap-1 pixel-button ${refreshing ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {refreshing ? (
                  <i className="fa fa-refresh fa-spin"></i>
                ) : (
                  <i className="fa fa-refresh"></i>
                )}
                刷新
              </button>
            )}
          </div>
          
          {/* 时间流速控制 - PC端右侧对齐 */}
          <div className="flex items-center gap-3">
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
                className={`pixel-font px-2 py-1 text-xs rounded-sm transition pixel-button ${timeSpeed === speed.value ? 'bg-[#38b2ac] text-black' : 'bg-[#2d3748] hover:bg-gray-700'}`}
              >
                {speed.icon && <i className={`fa ${speed.icon}`}></i>}
                {speed.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* 移动端：垂直堆叠布局 */}
        <div className="md:hidden grid grid-cols-1 gap-3">
          {/* 第一行：添加观察对象按钮和已观察数量 */}
          <div className="flex flex-col items-center gap-3 w-full">
            <button 
              onClick={handleAddCharacter}
              className="bg-[#38b2ac] hover:bg-[#2c9789] text-black px-4 py-2 text-sm rounded-sm transition pixel-button w-full flex items-center justify-center"
            >
              <i className="fa fa-plus mr-2"></i> 添加观察对象
            </button>
            <div className="text-sm text-gray-500 w-full text-center">
              已观察 <span className="text-monitor-highlight"><span className="pixel-font text-[#38b2ac]">{characterCount}</span></span> 个角色
            </div>
          </div>
          
          {/* 第二行：刷新按钮 - 移动端 */}
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={refreshing}
              className={`w-full px-4 py-2 text-sm bg-[#805ad5] text-white hover:bg-[#6b46c1] transition-colors flex items-center justify-center gap-2 pixel-button ${refreshing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {refreshing ? (
                <i className="fa fa-refresh fa-spin"></i>
              ) : (
                <i className="fa fa-refresh"></i>
              )}
              刷新
            </button>
          )}
          
          {/* 第三行：时间流速控制 - 移动端 */}
          <div className="bg-gray-900 p-3 rounded-sm">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <div className="text-sm text-gray-300 font-medium min-w-[80px] text-center">时间流速:</div>
              {timeSpeeds.map((speed) => (
                <button
                  key={speed.value}
                  onClick={() => {
                    // 显示Toast提示
                    setIsToastVisible(true);
                    // 仍然调用父组件的回调函数，以便功能完成后可以正常工作
                    onTimeSpeedChange(speed.value);
                  }}
                  className={`px-3 py-2 text-sm rounded-sm transition pixel-button ${timeSpeed === speed.value ? 'bg-[#38b2ac] text-black' : 'bg-[#2d3748] hover:bg-gray-700'} min-w-[50px]`}
                >
                  {speed.icon && <i className={`fa ${speed.icon} mr-1`}></i>}
                  {speed.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Toast提示 */}
      <Toast
        message="时间流速功能开发中..."
        isVisible={isToastVisible}
        onHide={() => setIsToastVisible(false)}
        type="info"
        duration={2000}
      />
      
      {/* 添加角色模态框 */}
      <AddCharacterModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveCharacter}
      />
      
      {/* 邀请码输入模态框 */}
      <InviteCodeModal
        isOpen={isInviteCodeModalOpen}
        onClose={() => setIsInviteCodeModalOpen(false)}
        onSuccess={handleInviteCodeSuccess}
      />
    </div>
  );
}
