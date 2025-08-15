'use client';

import { useState } from 'react';
import { Character, MoodType } from '@/types/character';

// MBTI类型对应的官方颜色
const mbtiColors: Record<string, string> = {
  'ISTJ': 'bg-blue-700',
  'ISFJ': 'bg-green-700',
  'INFJ': 'bg-purple-900',
  'INTJ': 'bg-purple-700',
  'ISTP': 'bg-red-700',
  'ISFP': 'bg-orange-600',
  'INFP': 'bg-emerald-500',
  'INTP': 'bg-indigo-700',
  'ESTP': 'bg-yellow-500',
  'ESFP': 'bg-pink-500',
  'ENFP': 'bg-green-500',
  'ENTP': 'bg-cyan-500',
  'ESTJ': 'bg-blue-800',
  'ESFJ': 'bg-blue-500',
  'ENFJ': 'bg-rose-600',
  'ENTJ': 'bg-red-900',
  'default': 'bg-gray-600'
};

interface CharacterModalProps {
  character: Character | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function CharacterModal({ character, isOpen, onClose }: CharacterModalProps) {
  if (!isOpen || !character) return null;

  // 状态管理：控制成长弧光的显示
  const [arcUnlocked, setArcUnlocked] = useState(false);
  const [unlockProgress, setUnlockProgress] = useState(0);
  const [isUnlocking, setIsUnlocking] = useState(false);

  // 解锁成长弧光的处理函数
  const handleUnlockArc = () => {
    if (arcUnlocked || isUnlocking) return;

    setIsUnlocking(true);
    const interval = setInterval(() => {
      setUnlockProgress(prev => {
        const newProgress = prev + 5;
        if (newProgress >= 100) {
          clearInterval(interval);
          setArcUnlocked(true);
          setIsUnlocking(false);
          return 100;
        }
        return newProgress;
      });
    }, 50);
  }

  const getMoodColor = (mood: string): MoodType => {
    if (mood.includes('愉快') || mood.includes('开心') || mood.includes('高兴') || mood.includes('幸运将至') || mood.includes('干劲十足') || mood.includes('拯救世界')) return 'happy';
    if (mood.includes('低落') || mood.includes('悲伤') || mood.includes('难过') || mood.includes('愤怒') || mood.includes('恐惧') || mood.includes('厌恶')) return 'sad';
    if (mood.includes('兴奋') || mood.includes('激动')) return 'excited';
    if (mood.includes('平静') || mood.includes('冥想')) return 'calm';
    if (mood.includes('焦虑') || mood.includes('无奈') || mood.includes('无语')) return 'anxious';
    return 'neutral';
  };

  const getMoodScore = (mood: string): number => {
    if (mood.includes('愉快') || mood.includes('开心') || mood.includes('高兴') || mood.includes('幸运将至')) return 80;
    if (mood.includes('干劲十足') || mood.includes('拯救世界')) return 85;
    if (mood.includes('兴奋') || mood.includes('激动')) return 90;
    if (mood.includes('平静') || mood.includes('冥想')) return 65;
    if (mood.includes('无聊') || mood.includes('惊讶') || mood.includes('努力搬砖')) return 60;
    if (mood.includes('无语') || mood.includes('无奈')) return 50;
    if (mood.includes('焦虑')) return 40;
    if (mood.includes('低落') || mood.includes('悲伤') || mood.includes('难过')) return 30;
    if (mood.includes('愤怒') || mood.includes('恐惧') || mood.includes('厌恶')) return 20;
    return 60;
  };

  const getMoodBarColor = (mood: MoodType) => {
    switch (mood) {
      case 'happy': return 'bg-[#48bb78]';
      case 'excited': return 'bg-[#805ad5]';
      case 'calm': return 'bg-[#3182ce]';
      case 'anxious': return 'bg-[#ed8936]';
      case 'neutral': return 'bg-[#f6ad55]';
      case 'sad': return 'bg-[#f56565]';
      case 'excited': return 'bg-[#ed8936]';
      default: return 'bg-[#f6ad55]';
    }
  };

  const moodType = getMoodColor(character.mood);
  const moodScore = getMoodScore(character.mood);

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="relative bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#334155] border-2 border-[#38b2ac] rounded-sm w-full max-w-2xl max-h-[90vh] overflow-hidden pixel-border">
        {/* 固定的模态框标题 */}
        <div className="sticky top-0 z-10 bg-[#1e293b] px-4 py-2 flex justify-between items-center border-b-2 border-[#38b2ac] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#38b2ac] via-[#4299e1] to-[#805ad5]"></div>
          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#4a5568]"></div>
          <h2 className="text-lg font-bold">{character.name} - 观察档案</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <i className="fa fa-times"></i>
          </button>
        </div>
        
        {/* 模态框内容 */}
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-56px)] relative">
          {/* 情绪与基本信息 */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="w-20 h-20 bg-[#48bb78] rounded-sm flex items-center justify-center text-3xl font-bold">
              {character.name.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex flex-col gap-2 mb-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm">{character.age}岁 · {character.occupation}</span>
              <span className={`text-xs ${mbtiColors[character.mbti_type] || mbtiColors.default} px-2 py-0.5 rounded text-white`}>{character.mbti_type}</span>
              <span className="text-xs bg-[#2d3748] px-2 py-0.5 rounded flex items-center">
                {character.gender === '男' ? (
                  <i className="fa fa-male mr-1 text-blue-400"></i>
                ) : character.gender === '女' ? (
                  <i className="fa fa-female mr-1 text-pink-400"></i>
                ) : null}
                {character.gender}
              </span>
              <div className="ml-auto flex items-center text-xs bg-[#2d3748]/70 px-2 py-0.5 rounded border border-[#4a5568]">
                <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${getMoodBarColor(moodType)}`}></span>
                情绪: {character.mood}
                <span className="ml-1 text-[#f6ad55]">({moodScore}/100)</span>
                <div className="ml-2 w-16 h-1.5 bg-[#1a202c] rounded-sm overflow-hidden border border-[#4a5568]">
                  <div className={`h-full ${getMoodBarColor(moodType)} pixel-bar`} style={{ width: `${moodScore}%` }}></div>
                </div>
              </div>
            </div>
          </div>
              <div className="mb-4">
                <h4 className="text-xs font-bold text-[#4299e1] mb-2 flex items-center tracking-wider">
                  <i className="fa fa-book mr-1"></i>人物背景
                </h4>
                <p className="text-sm text-gray-200 bg-[#1a202c]/80 p-3 rounded-lg border border-[#4299e1]/30 shadow-inner leading-relaxed tracking-wide">{character.background}</p>
              </div>
              
              <div className="mb-3">
                <h4 className="text-xs font-semibold text-[#38b2ac] mb-1 flex items-center">
                  <i className="fa fa-star-o mr-1"></i>性格特征
                </h4>
                <p className="text-xs text-gray-400 bg-[#1a202c]/40 p-2 rounded border-l-2 border-[#38b2ac]">{character.personality}</p>
              </div>

              {/* 谈话语气与风格 */}
              <div className="mb-3 border-2 border-[#805ad5] rounded-sm bg-[#1a202c]/70 p-2 relative overflow-hidden pixel-border">
                {/* 像素风格装饰 */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#805ad5] via-[#d6bcfa] to-[#805ad5]"></div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#805ad5] via-[#d6bcfa] to-[#805ad5]"></div>
                
                <h4 className="text-xs font-bold text-[#d6bcfa] mb-3 flex items-center font-mono tracking-tight">
                  <i className="fa fa-comments mr-1"></i>谈话风格
                </h4>
                
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex gap-2 items-start bg-[#2d3748]/50 p-2 rounded border border-[#4a5568] group hover:border-[#d6bcfa] transition-colors">
                    <div className="w-6 h-6 bg-[#805ad5]/20 rounded-sm flex items-center justify-center text-[#d6bcfa]">
                      <i className="fa fa-font text-xs"></i>
                    </div>
                    <div className="flex-1">
                      <h5 className="text-[10px] font-semibold text-[#d6bcfa] mb-1 flex items-center">
                        语言风格
                        <div className="ml-2 px-1.5 py-0.5 bg-[#805ad5]/20 rounded text-[9px] font-mono">STYLE</div>
                      </h5>
                      <p className="text-xs text-gray-300 font-mono">{character.speech_style || '简洁明了，用词专业但不生硬。'}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 items-start bg-[#2d3748]/50 p-2 rounded border border-[#4a5568] group hover:border-[#d6bcfa] transition-colors">
                    <div className="w-6 h-6 bg-[#805ad5]/20 rounded-sm flex items-center justify-center text-[#d6bcfa]">
                      <i className="fa fa-smile-o text-xs"></i>
                    </div>
                    <div className="flex-1">
                      <h5 className="text-[10px] font-semibold text-[#d6bcfa] mb-1 flex items-center">
                        语气
                        <div className="ml-2 px-1.5 py-0.5 bg-[#805ad5]/20 rounded text-[9px] font-mono">TONE</div>
                      </h5>
                      <p className="text-xs text-gray-300 font-mono">{character.tone || '沉稳、温和、带有一丝严肃。'}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 items-start bg-[#2d3748]/50 p-2 rounded border border-[#4a5568] group hover:border-[#d6bcfa] transition-colors">
                    <div className="w-6 h-6 bg-[#805ad5]/20 rounded-sm flex items-center justify-center text-[#d6bcfa]">
                      <i className="fa fa-clock-o text-xs"></i>
                    </div>
                    <div className="flex-1">
                      <h5 className="text-[10px] font-semibold text-[#d6bcfa] mb-1 flex items-center">
                        回应速度
                        <div className="ml-2 px-1.5 py-0.5 bg-[#805ad5]/20 rounded text-[9px] font-mono">SPEED</div>
                      </h5>
                      <p className="text-xs text-gray-300 font-mono">{character.response_speed || '中等偏慢，倾向于深思熟虑后再回答。'}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 items-start bg-[#2d3748]/50 p-2 rounded border border-[#4a5568] group hover:border-[#d6bcfa] transition-colors">
                    <div className="w-6 h-6 bg-[#805ad5]/20 rounded-sm flex items-center justify-center text-[#d6bcfa]">
                      <i className="fa fa-exchange text-xs"></i>
                    </div>
                    <div className="flex-1">
                      <h5 className="text-[10px] font-semibold text-[#d6bcfa] mb-1 flex items-center">
                        沟通风格
                        <div className="ml-2 px-1.5 py-0.5 bg-[#805ad5]/20 rounded text-[9px] font-mono">COMM</div>
                      </h5>
                      <p className="text-xs text-gray-300 font-mono">{character.communication_style || '直接、清晰、有逻辑，不擅长寒暄和闲聊。'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 角色核心属性 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
                <div className="bg-[#2d3748]/80 p-2 rounded-sm border border-[#48bb78] relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-[#48bb78] "></div>
                  <h4 className="text-xs font-semibold text-[#48bb78] mb-1 flex items-center">
                    <i className="fa fa-bullseye mr-1"></i>核心动机
                  </h4>
                  <p className="text-xs text-gray-300 font-mono">{character.motivation || '暂无数据'}</p>
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-[#48bb78]/20 rotate-45 translate-x-2 translate-y-2 group-hover:bg-[#48bb78]/40 transition-colors"></div>
                </div>

                <div className="bg-[#2d3748]/80 p-2 rounded-sm border border-[#f6ad55] relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-[#f6ad55] "></div>
                  <h4 className="text-xs font-semibold text-[#f6ad55] mb-1 flex items-center">
                    <i className="fa fa-exclamation-triangle mr-1"></i>主要冲突
                  </h4>
                  <p className="text-xs text-gray-300 font-mono">{character.conflict || '暂无数据'}</p>
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-[#f6ad55]/20 rotate-45 translate-x-2 translate-y-2 group-hover:bg-[#f6ad55]/40 transition-colors"></div>
                </div>

                <div className="bg-[#2d3748]/80 p-2 rounded-sm border border-[#f56565] relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-[#f56565] "></div>
                  <h4 className="text-xs font-semibold text-[#f56565] mb-1 flex items-center">
                     <i className="fa fa-exclamation-circle mr-1"></i>性格缺陷
                   </h4>
                  <p className="text-xs text-gray-300 font-mono">{character.flaw || '暂无数据'}</p>
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-[#f56565]/20 rotate-45 translate-x-2 translate-y-2 group-hover:bg-[#f56565]/40 transition-colors"></div>
                </div>
              </div>

              {/* 兴趣与习惯 */}
              <div className="mb-3 bg-[#0f172a]/70 p-2 border border-[#334155] rounded-sm relative overflow-hidden">
                {/* 扫描线效果 */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-[#ffffff05] to-transparent h-[200%] animate-[scan_3s_linear_infinite]"></div>
                
                <h4 className="text-[10px] font-semibold text-gray-300 mb-2 flex items-center font-mono tracking-tight">
                  <span className="inline-block w-2 h-2 bg-[#64748b] mr-1 pixel-block"></span>兴趣与习惯
                </h4>
                
                {/* 爱好和习惯 - 上排 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                  {/* 爱好 - 像素字云样式 */}
                  <div className="bg-[#2d3748]/70 p-1.5 rounded-sm border border-[#38bdf8] pixel-border relative">
                    <div className="absolute top-0 left-0 w-full h-0.5 bg-[#38bdf8] "></div>
                    <h5 className="text-[9px] font-semibold text-[#93c5fd] mb-1.5 flex items-center font-mono tracking-tight">
                      <span className="inline-block w-1.5 h-1.5 bg-[#38bdf8] mr-1 pixel-block"></span>爱好 (HOBBIES)
                    </h5>
                    <div className="flex flex-wrap gap-1.5">
                      {Array.isArray(character.hobbies) && character.hobbies.length > 0 ? (
                        character.hobbies.map((hobby, idx) => (
                          <span key={idx} className="text-[9px] px-1.5 py-0.5 bg-[#38bdf8]/10 rounded-sm border border-[#38bdf8]/30 text-[#93c5fd] hover:bg-[#38bdf8]/20 transition-all hover:scale-105 font-mono" style={{fontSize: `${Math.max(8, 11 - idx * 0.5)}px`}}>
                            {hobby}
                          </span>
                        ))
                      ) : (
                        <span className="text-[9px] text-gray-500 italic font-mono">NO_DATA</span>
                      )}
                    </div>
                  </div>

                  {/* 习惯 - 像素字云样式 */}
                  <div className="bg-[#2d3748]/70 p-1.5 rounded-sm border border-[#facc15] pixel-border relative">
                    <div className="absolute top-0 left-0 w-full h-0.5 bg-[#facc15] "></div>
                    <h5 className="text-[9px] font-semibold text-[#fde68a] mb-1.5 flex items-center font-mono tracking-tight">
                      <span className="inline-block w-1.5 h-1.5 bg-[#facc15] mr-1 pixel-block"></span>习惯 (HABITS)
                    </h5>
                    <div className="flex flex-wrap gap-1.5">
                      {Array.isArray(character.habits) && character.habits.length > 0 ? (
                        character.habits.map((habit, idx) => (
                          <span key={idx} className="text-[9px] px-1.5 py-0.5 bg-[#facc15]/10 rounded-sm border border-[#facc15]/30 text-[#fde68a] hover:bg-[#facc15]/20 transition-all hover:scale-105 font-mono" style={{fontSize: `${Math.max(8, 11 - idx * 0.5)}px`}}>
                            {habit}
                          </span>
                        ))
                      ) : (
                        <span className="text-[9px] text-gray-500 italic font-mono">NO_DATA</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 喜欢和不喜欢的话题 - 下排 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {/* 喜欢的话题 - 像素字云样式 */}
                  <div className="bg-[#2d3748]/70 p-1.5 rounded-sm border border-[#4ade80] pixel-border relative">
                    <div className="absolute top-0 left-0 w-full h-0.5 bg-[#4ade80] "></div>
                    <h5 className="text-[9px] font-semibold text-[#86efac] mb-1.5 flex items-center font-mono tracking-tight">
                      <span className="inline-block w-1.5 h-1.5 bg-[#4ade80] mr-1 pixel-block"></span>喜欢的话题 (FAV_TOPICS)
                    </h5>
                    <div className="flex flex-wrap gap-1.5">
                      {Array.isArray(character.favored_topics) && character.favored_topics.length > 0 ? (
                        character.favored_topics.map((topic, idx) => (
                          <span key={idx} className="text-[9px] px-1.5 py-0.5 bg-[#4ade80]/10 rounded-sm border border-[#4ade80]/30 text-[#86efac] hover:bg-[#4ade80]/20 transition-all hover:scale-105 font-mono" style={{fontSize: `${Math.max(8, 11 - idx * 0.5)}px`}}>
                            {topic}
                          </span>
                        ))
                      ) : (
                        <span className="text-[9px] text-gray-500 italic font-mono">NO_DATA</span>
                      )}
                    </div>
                  </div>

                  {/* 不喜欢的话题 - 像素字云样式 */}
                  <div className="bg-[#2d3748]/70 p-1.5 rounded-sm border border-[#f87171] pixel-border relative">
                    <div className="absolute top-0 left-0 w-full h-0.5 bg-[#f87171] "></div>
                    <h5 className="text-[9px] font-semibold text-[#fca5a5] mb-1.5 flex items-center font-mono tracking-tight">
                      <span className="inline-block w-1.5 h-1.5 bg-[#f87171] mr-1 pixel-block"></span>不喜欢的话题 (DIS_TOPICS)
                    </h5>
                    <div className="flex flex-wrap gap-1.5">
                      {Array.isArray(character.disliked_topics) && character.disliked_topics.length > 0 ? (
                        character.disliked_topics.map((topic, idx) => (
                          <span key={idx} className="text-[9px] px-1.5 py-0.5 bg-[#f87171]/10 rounded-sm border border-[#f87171]/30 text-[#fca5a5] hover:bg-[#f87171]/20 transition-all hover:scale-105 font-mono" style={{fontSize: `${Math.max(8, 11 - idx * 0.5)}px`}}>
                            {topic}
                          </span>
                        ))
                      ) : (
                        <span className="text-[9px] text-gray-500 italic font-mono">NO_DATA</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Big5人格测试 */}
              <div className="border-2 border-[#4a5568] rounded-sm bg-[#1a202c]/70 p-2 relative overflow-hidden">
                {/* 像素风格装饰 */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#90cdf4] via-[#f6ad55] to-[#48bb78]"></div>
                <div className="absolute top-1 left-0 w-full h-1 bg-[#1a202c]"></div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#ed8936] via-[#f56565] to-[#90cdf4]"></div>
                <div className="absolute bottom-1 left-0 w-full h-1 bg-[#1a202c]"></div>
                
                <h4 className="text-xs font-bold text-[#90cdf4] mb-3 flex items-center font-mono tracking-tight">
                  <i className="fa fa-gamepad mr-1"></i>BIG-5 人格
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="relative overflow-hidden bg-[#2d3748]/50 p-1 rounded border border-[#4a5568]">
                    <div className="flex justify-between text-[10px] mb-1 font-mono">
                      <span className="text-gray-300">开放性 (OPENNESS)</span>
                      <span className="text-[#90cdf4]">{(character.big5?.openness || 0).toFixed(1)}</span>
                    </div>
                    <div className="h-2 bg-[#1a202c] rounded-sm overflow-hidden border border-[#4a5568]">
                      <div className="h-full bg-[#90cdf4] pixel-bar" style={{ width: `${(character.big5?.openness || 0) * 100}%` }}></div>
                    </div>
                  </div>
                  <div className="relative overflow-hidden bg-[#2d3748]/50 p-1 rounded border border-[#4a5568]">
                    <div className="flex justify-between text-[10px] mb-1 font-mono">
                      <span className="text-gray-300">尽责性 (CONSCIENTIOUS)</span>
                      <span className="text-[#f6ad55]">{(character.big5?.conscientiousness || 0).toFixed(1)}</span>
                    </div>
                    <div className="h-2 bg-[#1a202c] rounded-sm overflow-hidden border border-[#4a5568]">
                      <div className="h-full bg-[#f6ad55] pixel-bar" style={{ width: `${(character.big5?.conscientiousness || 0) * 100}%` }}></div>
                    </div>
                  </div>
                  <div className="relative overflow-hidden bg-[#2d3748]/50 p-1 rounded border border-[#4a5568]">
                    <div className="flex justify-between text-[10px] mb-1 font-mono">
                      <span className="text-gray-300">外倾性 (EXTRAVERSION)</span>
                      <span className="text-[#48bb78]">{(character.big5?.extraversion || 0).toFixed(1)}</span>
                    </div>
                    <div className="h-2 bg-[#1a202c] rounded-sm overflow-hidden border border-[#4a5568]">
                      <div className="h-full bg-[#48bb78] pixel-bar" style={{ width: `${(character.big5?.extraversion || 0) * 100}%` }}></div>
                    </div>
                  </div>
                  <div className="relative overflow-hidden bg-[#2d3748]/50 p-1 rounded border border-[#4a5568]">
                    <div className="flex justify-between text-[10px] mb-1 font-mono">
                      <span className="text-gray-300">宜人性 (AGREEABLENESS)</span>
                      <span className="text-[#ed8936]">{(character.big5?.agreeableness || 0).toFixed(1)}</span>
                    </div>
                    <div className="h-2 bg-[#1a202c] rounded-sm overflow-hidden border border-[#4a5568]">
                      <div className="h-full bg-[#ed8936] pixel-bar" style={{ width: `${(character.big5?.agreeableness || 0) * 100}%` }}></div>
                    </div>
                  </div>
                  <div className="relative overflow-hidden md:col-span-2 bg-[#2d3748]/50 p-1 rounded border border-[#4a5568]">
                    <div className="flex justify-between text-[10px] mb-1 font-mono">
                      <span className="text-gray-300">神经质 (NEUROTICISM)</span>
                      <span className="text-[#f56565]">{(character.big5?.neuroticism || 0).toFixed(1)}</span>
                    </div>
                    <div className="h-2 bg-[#1a202c] rounded-sm overflow-hidden border border-[#4a5568]">
                      <div className="h-full bg-[#f56565] pixel-bar" style={{ width: `${(character.big5?.neuroticism || 0) * 100}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          
          {/* 隐藏的角色成长弧光彩蛋 - 右下角像素图标 */}
            <div 
              onClick={handleUnlockArc} 
              className={`fixed bottom-4 right-4 w-6 h-6 bg-[#1a202c] border border-[#4a5568] rounded-sm flex items-center justify-center cursor-pointer transition-all duration-300 hover:border-[#6366f1] hover:scale-110 opacity-50 hover:opacity-100 z-30 ${!arcUnlocked ? 'pixel-idle' : ''}`} 
              style={{animationPlayState: isUnlocking ? 'paused' : 'running'}}
              title=""
            >
              <i className={`fa ${isUnlocking ? 'fa-spinner fa-spin' : arcUnlocked ? 'fa-book' : 'fa-circle-o'} text-${isUnlocking ? '#6366f1' : arcUnlocked ? '#6366f1' : '#4a5568'} text-xs`}></i>
            </div>

          {/* 解锁进度条 */}
          {isUnlocking && (
            <div className="fixed bottom-14 right-4 w-48 h-1.5 bg-[#1a202c] rounded-sm overflow-hidden border border-[#4a5568] z-30">
              <div className="h-full bg-[#6366f1] pixel-bar" style={{ width: `${unlockProgress}%` }}></div>
            </div>
          )}

          {/* 解锁后的隐藏档案内容 */}
          {arcUnlocked && (
            <div className="relative w-full bg-[#1a202c]/95 rounded-sm border-2 border-[#6366f1] p-2 z-40 animate-[fadeIn_0.5s_ease-in-out] pixel-border transform transition-all duration-500 scale-100 mb-3">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#4f46e5] via-[#818cf8] to-[#4f46e5]"></div>
              <h5 className="text-[10px] font-semibold text-[#818cf8] mb-3 flex items-center font-mono mt-1">
                <i className="fa fa-bolt mr-1"></i>隐藏档案
              </h5>

              {/* 角色成长弧光 */}
              <div className="mb-3 bg-[#2d3748]/50 p-2 rounded-sm border-l-2 border-[#6366f1]">
                <h6 className="text-[9px] font-semibold text-[#a5b4fc] mb-1">角色成长弧光</h6>
                <p className="text-xs text-gray-300 leading-relaxed font-mono">{character.character_arc || '从立志救国的青年才俊，逐渐成长为掌控天下的权臣，内心在理想与现实之间不断冲突与成长。'}</p>
              </div>

              {/* 信仰 */}
              <div className="mb-3 bg-[#2d3748]/50 p-2 rounded-sm border-l-2 border-[#4ade80]">
                <h6 className="text-[9px] font-semibold text-[#86efac] mb-1">信仰与价值观</h6>
                <ul className="text-xs text-gray-300 font-mono space-y-1">
                  {Array.isArray(character.beliefs) && character.beliefs.length > 0 ? (
                    character.beliefs.map((belief, idx) => (
                      <li key={idx} className="flex items-start gap-1">
                        <span className="text-[#4ade80] mt-0.5">•</span> {belief}
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500 italic">暂无数据</li>
                  )}
                </ul>
              </div>

              {/* 人生目标 */}
              <div className="mb-3 bg-[#2d3748]/50 p-2 rounded-sm border-l-2 border-[#facc15]">
                <h6 className="text-[9px] font-semibold text-[#fde68a] mb-1">人生目标</h6>
                <ul className="text-xs text-gray-300 font-mono space-y-1">
                  {Array.isArray(character.goals) && character.goals.length > 0 ? (
                    character.goals.map((goal, idx) => (
                      <li key={idx} className="flex items-start gap-1">
                        <span className="text-[#facc15] mt-0.5">•</span> {goal}
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500 italic">暂无数据</li>
                  )}
                </ul>
              </div>

              {/* 恐惧 */}
              <div className="mb-3 bg-[#2d3748]/50 p-2 rounded-sm border-l-2 border-[#f87171]">
                <h6 className="text-[9px] font-semibold text-[#fca5a5] mb-1">恐惧与害怕</h6>
                <ul className="text-xs text-gray-300 font-mono space-y-1">
                  {Array.isArray(character.fears) && character.fears.length > 0 ? (
                    character.fears.map((fear, idx) => (
                      <li key={idx} className="flex items-start gap-1">
                        <span className="text-[#f87171] mt-0.5">•</span> {fear}
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500 italic">暂无数据</li>
                  )}
                </ul>
              </div>

              {/* 秘密 */}
              <div className="bg-[#2d3748]/50 p-2 rounded-sm border-l-2 border-[#c084fc]">
                <h6 className="text-[9px] font-semibold text-[#d8b4fe] mb-1">秘密</h6>
                <ul className="text-xs text-gray-300 font-mono space-y-1">
                  {Array.isArray(character.secrets) && character.secrets.length > 0 ? (
                    character.secrets.map((secret, idx) => (
                      <li key={idx} className="flex items-start gap-1">
                        <span className="text-[#c084fc] mt-0.5">•</span> {secret}
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500 italic">暂无数据</li>
                  )}
                </ul>
              </div>
            </div>
          )}
          
          {/* 生活轨迹 */}
          <div className="mb-6">
            <h3 className="text-sm font-bold mb-3 flex items-center">
              <i className="fa fa-clock-o mr-2 text-[#38b2ac]"></i>生活轨迹（最近5条）
            </h3>
            <div className="space-y-3">
              {character.event_profile?.life_path && Array.isArray(character.event_profile.life_path) ? (
                character.event_profile.life_path
                  .slice()
                  .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
                  .reverse()
                  .slice(0, 5)
                  .map((event, index) => (
                  <div key={event?.event_id || index} className="flex gap-3">
                    <div className="w-20 text-center text-xs text-gray-500 pt-1">
                      {event?.start_time ? new Date(event.start_time).toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(/\//g, '-') : '未知时间'}
                    </div>
                    <div className="flex-1 bg-[#2d3748]/50 p-2 rounded-sm text-xs">
                      <p>{event?.description || '无描述信息'}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-xs text-gray-400 py-2">暂无行为记录</div>
              )}
            </div>
          </div>
          
          {/* 人际关系 */}
          <div>
            <h3 className="text-sm font-bold mb-3 flex items-center">
              <i className="fa fa-link mr-2 text-[#38b2ac]"></i>人际关系
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {Object.entries(character.relationships).slice(0, 4).map(([id, relation]) => (
                <div key={id} className="bg-[#2d3748]/50 p-2 rounded-sm text-xs flex items-center gap-2">
                  <div className="w-6 h-6 bg-[#f6ad55] rounded-full flex items-center justify-center text-xs">
                    {relation.charAt(0)}
                  </div>
                  <div>
                    <div>{id}</div>
                    <div className="text-gray-500">{relation}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
