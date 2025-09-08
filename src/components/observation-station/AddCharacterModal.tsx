'use client';

import { useState, useEffect } from 'react';
import { Character } from '@/types/character';
import CharacterModal from './CharacterModal';
import { apiService } from '@/services/api';
import ConfirmModal from './ConfirmModal';

// 自定义钩子：用于生成科技感的闪烁效果
const useTechPulse = () => {
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(prev => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return pulse;
};

interface AddCharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (character: Character) => void; // 添加保存回调
}

export default function AddCharacterModal({ isOpen, onClose, onSave }: AddCharacterModalProps) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'男' | '女'>('男');
  const [occupation, setOccupation] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCharacter, setGeneratedCharacter] = useState<Character | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showCharacterModal, setShowCharacterModal] = useState(false);
  const [progress, setProgress] = useState(0);
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const pulse = useTechPulse();
  
  // 提示文本切换和动画状态
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const hintTexts = [
    'AI正在构建背景故事和人格特征...',
    'AI一旦苏醒将永久无法撤回！',
    '正在唤醒AI记忆...',
    'AI即将拥有自主意识...',
    'AI情绪系统即将启动...',
    '角色即将感知世界...',
    '生命创建中...',
    '自我意识觉醒中...'
  ];

  // 科技感背景网格动画效果
  const gridOpacity = 0.1 + Math.sin(pulse / 10) * 0.05;
  
  // 处理提示文本切换和动画
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isGenerating) {
      // 每4秒切换一次文本
      interval = setInterval(() => {
        // 先淡出
        setIsFading(true);
        
        // 300ms后切换文本并开始淡入
        setTimeout(() => {
          setCurrentHintIndex(prevIndex => (prevIndex + 1) % hintTexts.length);
          setIsFading(false);
        }, 500);
      }, 5000);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isGenerating]);

  const handleSubmit = async () => {
    if (!name || !age || !occupation) return;

    const characterData = {
      name,
      age: parseInt(age),
      gender,
      occupation
    };

    // 创建新的AbortController实例
    const controller = new AbortController();
    setAbortController(controller);
    setIsGenerating(true);
    setProgress(0);

    try {
      // 模拟进度更新
      let progress = 0;
      const interval = setInterval(() => {
        progress += 5;
        if (progress <= 95) {
          setProgress(progress);
        } else {
          clearInterval(interval);
        }
      }, 100);

      // 直接调用API生成角色，传入signal参数
      const response = await apiService.generateCharacter(characterData, { signal: controller.signal });

      clearInterval(interval);
      setProgress(100);

      // 检查响应格式是否符合预期
      const isSuccess = response.recode === 200; // 使用recode字段判断是否成功
      let generatedData: Character | null = null;

      if (response.data) {
        generatedData = response.data;
      } else if (isSuccess) {
        // 如果没有data字段但请求成功，尝试使用整个响应作为数据
        generatedData = response as unknown as Character;
      }

      if (isSuccess && generatedData) {
        // 生成成功，保存角色数据
        setGeneratedCharacter(generatedData);
        setIsGenerating(false); // 确保生成完成后设置为false
        setAbortController(null); // 清空控制器
      } else {
        // 生成失败，显示错误信息
        const errorMsg = response.msg || '未知错误';
        console.error('角色生成失败:', errorMsg);
        alert(`角色生成失败: ${errorMsg}`);
        setIsGenerating(false);
        setAbortController(null); // 清空控制器
      }
    } catch (error) {
      // 检查是否是由于中止请求导致的错误
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('角色生成请求已被中止');
      } else {
        console.error('调用生成角色API出错:', error);
        alert('调用生成角色API出错，请稍后重试');
      }
      setIsGenerating(false);
      setAbortController(null); // 清空控制器
    }
  };

  const handleCancel = () => {
    if (isGenerating) {
      setShowCancelConfirm(true);
    } else {
      setName('');
      setAge('');
      setGender('男');
      setOccupation('');
      setIsGenerating(false);
      setGeneratedCharacter(null);
      onClose();
    }
  };


  const confirmCancel = () => {
    setShowCancelConfirm(false);
    // 如果存在控制器且正在生成，则中止请求
    if (abortController) {
      abortController.abort();
      setAbortController(null);
    }
    setName('');
    setAge('');
    setGender('男');
    setOccupation('');
    setIsGenerating(false);
    setGeneratedCharacter(null);
    onClose();
  };

  const cancelCancel = () => {
    setShowCancelConfirm(false);
  };

  // 监听生成状态和生成结果变化
  useEffect(() => {
    if (!isGenerating && generatedCharacter) {
      // 生成完成后，延迟弹出CharacterModal
      setTimeout(() => {
        setShowCharacterModal(true);
      }, 500);
    }
  }, [isGenerating, generatedCharacter]);

  // 关闭CharacterModal的处理函数
  const handleCharacterModalClose = () => {
    setShowCharacterModal(false);
    handleCancel();
  };

  // 保存角色的处理函数
  const handleSaveCharacter = () => {
    if (generatedCharacter && onSave) {
      onSave(generatedCharacter);
    }
  };

  // 重新生成角色的处理函数
  const handleRegenerateCharacter = () => {
    // 关闭CharacterModal但保持输入的基本信息
    setShowCharacterModal(false);
    // 重新调用生成函数
    handleSubmit();
  };

  // 取消角色生成的处理函数
  const handleCancelCharacterGeneration = () => {
    // 关闭CharacterModal并重置状态
    setShowCharacterModal(false);
    handleCancel();
  };

  // 监听生成状态变化
  useEffect(() => {
    if (isGenerating) {
      // 生成过程中禁用所有输入
      const inputs = document.querySelectorAll('input');
      inputs.forEach(input => input.disabled = true);
    } else {
      // 生成结束后启用输入
      const inputs = document.querySelectorAll('input');
      inputs.forEach(input => input.disabled = false);
    }
  }, [isGenerating]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      {/* 确认终止弹窗 - 使用可复用组件 */}
      <ConfirmModal
        isOpen={showCancelConfirm}
        title="确认终止"
        message="确定要终止角色生成吗？当前进度将丢失。"
        onConfirm={confirmCancel}
        onCancel={cancelCancel}
      />
      
      <div className="relative bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#334155] border-2 border-[#38b2ac] rounded-sm w-full max-w-md max-h-[90vh] overflow-hidden pixel-border animate-fadeIn">
          {/* 科技感扫描线 */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#38b2ac]/5 to-transparent transform -translate-y-full animate-scan"></div>
          </div>
        {/* 顶部科技感装饰条 */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#38b2ac] via-[#4299e1] to-[#805ad5]"></div>

        {/* 关闭按钮 */}
        <button
          onClick={handleCancel}
          className="absolute top-2 right-2 text-gray-400 hover:text-white z-10"
        >
          <i className="fa fa-times"></i>
        </button>

        <div className="p-6">
          <h2 className="text-lg font-bold mb-6 text-center text-[#38b2ac] tracking-wide font-pixel">
            <i className="fa fa-user-plus mr-2"></i>AI生成角色
          </h2>

          {!isGenerating && !generatedCharacter ? (
            <div className="space-y-6 relative">
              {/* 背景网格 */}
              <div className="absolute inset-0 opacity-5 z-0" style={{ backgroundImage: 'linear-gradient(#38b2ac 1px, transparent 1px), linear-gradient(90deg, #38b2ac 1px, transparent 1px)', backgroundSize: '15px 15px' }}></div>

              {/* 角色名称 - 终端风格输入 */}
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-block w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                  <label className="text-xs text-gray-400 font-mono tracking-wider">角色名称</label>
                  <span className="text-xs text-gray-500 font-mono">({name.length}/5)</span>
                </div>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#38b2ac]/20 to-[#805ad5]/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value.slice(0, 5))}
                    maxLength={5}
                    className="w-full bg-[#0f172a] border border-[#38b2ac]/50 rounded-sm p-2.5 text-sm font-pixel focus:border-[#38b2ac] focus:outline-none z-10 relative"
                    placeholder="输入角色名称..."
                  />
                  <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#38b2ac] to-transparent mt-1 transform origin-left scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300"></div>
                </div>
              </div>

              {/* 年龄 - 数字选择器风格 */}
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-block w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></span>
                  <label className="text-xs text-gray-400 font-mono tracking-wider">年龄</label>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => age && setAge((parseInt(age) - 1).toString())} 
                    disabled={!age || parseInt(age) <= 1}
                    className="w-8 h-8 flex items-center justify-center bg-[#1e293b] border border-[#38b2ac]/50 rounded-sm text-[#38b2ac] hover:bg-[#38b2ac]/20 disabled:opacity-50"
                  >
                    <i className="fa fa-minus"></i>
                  </button>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="flex-1 bg-[#0f172a] border border-[#38b2ac]/50 rounded-sm p-2.5 text-sm font-pixel text-center focus:border-[#38b2ac] focus:outline-none"
                    placeholder="年龄"
                    min="1"
                    max="120"
                  />
                  <button 
                    onClick={() => age ? setAge((parseInt(age) + 1).toString()) : setAge('1')}                  
                    className="w-8 h-8 flex items-center justify-center bg-[#1e293b] border border-[#38b2ac]/50 rounded-sm text-[#38b2ac] hover:bg-[#38b2ac]/20 disabled:opacity-50"
                  >
                    <i className="fa fa-plus"></i>
                  </button>
                </div>
              </div>

              {/* 性别 - 游戏风格选择 */}
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-block w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                  <label className="text-xs text-gray-400 font-mono tracking-wider">性别</label>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setGender('男')}
                    className={`py-2 px-4 border rounded-sm font-pixel transition ${gender === '男' ? 'border-[#38b2ac] bg-[#38b2ac]/20 text-[#38b2ac]' : 'border-gray-700 hover:border-gray-500'}`}
                  >
                    <i className="fa fa-mars mr-1"></i> 男
                  </button>
                  <button
                    onClick={() => setGender('女')}
                    className={`py-2 px-4 border rounded-sm font-pixel transition ${gender === '女' ? 'border-[#805ad5] bg-[#805ad5]/20 text-[#805ad5]' : 'border-gray-700 hover:border-gray-500'}`}
                  >
                    <i className="fa fa-venus mr-1"></i> 女
                  </button>
                </div>
              </div>

              {/* 职业 - 未来感输入 */}
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-block w-3 h-3 bg-blue-500 rounded-full animate-pulse"></span>
                  <label className="text-xs text-gray-400 font-mono tracking-wider">职业</label>
                  <span className="text-xs text-gray-500 font-mono">({occupation.length}/6)</span>
                </div>
                <div className="relative group">
                  <input
                    type="text"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value.slice(0, 6))}
                    maxLength={6}
                    className="w-full bg-[#0f172a] border border-[#38b2ac]/50 rounded-sm p-2.5 text-sm font-pixel focus:border-[#38b2ac] focus:outline-none"
                    placeholder="输入职业..."
                  />
                  <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#38b2ac] to-transparent mt-1 transform origin-left scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300"></div>
                </div>
              </div>

              {/* 生成按钮 - 游戏风格 */}
              <button
                onClick={handleSubmit}
                disabled={!name || !age || !occupation || name.length === 0 || occupation.length === 0}
                className="w-full mt-8 relative overflow-hidden bg-gradient-to-r from-[#38b2ac] to-[#4299e1] text-black font-bold py-3 px-4 rounded-sm transition flex items-center justify-center gap-2 pixel-button disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-[#805ad5] to-[#38b2ac] opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative z-10 flex items-center gap-2">
                  <i className="fa fa-cog fa-spin text-white"></i>
                  <span className='text-white'>立即生成</span>
                </span>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-black/30 rounded-full animate-ping"></span>
              </button>
            </div>
          ) : isGenerating ? (
            <div className="flex flex-col items-center justify-center py-10 relative overflow-hidden">
              {/* 背景动画 */}
              <div className="absolute inset-0 opacity-10 z-0" style={{ backgroundImage: 'radial-gradient(#38b2ac 1px, transparent 1px)', backgroundSize: '20px 20px', animation: 'moveBackground 20s linear infinite' }}></div>
              
              {/* 全息投影风格加载 */}
              <div className="w-20 h-20 relative mb-6 z-10">
                <div className="absolute inset-0 border-4 border-[#38b2ac] rounded-full opacity-50 animate-ping"></div>
                <div className="absolute inset-2 border-4 border-[#4299e1] rounded-full opacity-70 animate-spin-slow"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <i className="fa fa-user-circle text-3xl text-[#38b2ac]"></i>
                </div>
              </div>
              
              <p className="text-[#38b2ac] text-sm tracking-wide font-pixel z-10">AI角色即将苏醒...</p>
              <p 
                className="text-gray-400 text-xs mt-1 font-mono z-10 transition-opacity duration-300 ease-in-out"
                style={{ opacity: isFading ? 0 : 1 }}
              >
                {hintTexts[currentHintIndex]}
              </p>
              
              {/* 高级进度条 */}
              <div className="w-full max-w-xs h-2 bg-[#1e293b] rounded-full mt-8 overflow-hidden border border-[#38b2ac]/30 relative z-10">
                <div className="h-full bg-gradient-to-r from-[#38b2ac] via-[#4299e1] to-[#805ad5]" style={{ width: `${progress}%` }}></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[scanProgress_1.5s_ease-in-out_infinite]"></div>
              </div>
                
              {/* 终止生成按钮 */}
              <button
                onClick={() => setShowCancelConfirm(true)}
                className="mt-8 px-4 py-2 bg-[#ef4444]/20 border border-[#ef4444]/50 text-[#ef4444] text-sm font-pixel rounded-sm hover:bg-[#ef4444]/30 transition relative z-20"
              >
                <i className="fa fa-stop-circle mr-1"></i>终止生成
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {/* CharacterModal组件 - 新建角色模式 */}
      {showCharacterModal && generatedCharacter && (
        <CharacterModal
          isOpen={showCharacterModal}
          onClose={handleCharacterModalClose}
          character={generatedCharacter}
          mode="new"
          onSave={handleSaveCharacter}
          onRegenerate={handleRegenerateCharacter}
          onCancel={handleCancelCharacterGeneration}
          characterBaseInfo={{ name, age, gender, occupation }}
        />
      )}
    </div>
  );
}
