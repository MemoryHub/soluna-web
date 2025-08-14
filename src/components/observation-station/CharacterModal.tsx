'use client';

import { Character, MoodType } from '@/types/character';

interface CharacterModalProps {
  character: Character | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function CharacterModal({ character, isOpen, onClose }: CharacterModalProps) {
  if (!isOpen || !character) return null;

  const getMoodColor = (mood: string): MoodType => {
    if (mood.includes('愉快') || mood.includes('开心') || mood.includes('高兴')) return 'happy';
    if (mood.includes('低落') || mood.includes('悲伤') || mood.includes('难过')) return 'sad';
    if (mood.includes('兴奋') || mood.includes('激动')) return 'excited';
    return 'neutral';
  };

  const getMoodScore = (mood: string): number => {
    if (mood.includes('愉快') || mood.includes('开心')) return 80;
    if (mood.includes('低落') || mood.includes('悲伤')) return 30;
    if (mood.includes('兴奋') || mood.includes('激动')) return 90;
    return 60;
  };

  const getMoodBarColor = (mood: MoodType) => {
    switch (mood) {
      case 'happy': return 'bg-[#48bb78]';
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
      <div className="bg-[#1a1f29] border-2 border-[#38b2ac] rounded-sm w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* 模态框标题 */}
        <div className="bg-[#2d3748] px-4 py-2 flex justify-between items-center">
          <h2 className="text-lg font-bold">{character.name} - 详情观察</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <i className="fa fa-times"></i>
          </button>
        </div>
        
        {/* 模态框内容 */}
        <div className="p-4">
          {/* 情绪与基本信息 */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="w-20 h-20 bg-[#48bb78] rounded-sm flex items-center justify-center text-3xl font-bold">
              {character.name.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="text-sm">{character.age}岁 · {character.occupation}</span>
                <span className="text-xs bg-[#2d3748] px-2 py-0.5 rounded">{character.mbti_type}</span>
                <span className="text-xs bg-[#2d3748] px-2 py-0.5 rounded">{character.gender === 'male' ? '男' : character.gender === 'female' ? '女' : '中性'}</span>
              </div>
              <p className="text-sm text-gray-400 mb-3">{character.personality.join('，')}</p>
              
              {/* 情绪条 */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>情绪状态</span>
                  <span>{character.mood}（{moodScore}/100）</span>
                </div>
                <div className="h-2 bg-[#2d3748] rounded-full overflow-hidden">
                  <div className={`h-full ${getMoodBarColor(moodType)}`} style={{ width: `${moodScore}%` }}></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* 今日行为时间线 */}
          <div className="mb-6">
            <h3 className="text-sm font-bold mb-3 flex items-center">
              <i className="fa fa-clock-o mr-2 text-[#38b2ac]"></i>今日行为记录
            </h3>
            <div className="space-y-3">
              {character.event_profile?.life_path.slice(0, 4).map((event, index) => (
                <div key={event.event_id} className="flex gap-3">
                  <div className="w-12 text-center text-xs text-gray-500 pt-1">
                    {new Date(event.start_time).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="flex-1 bg-[#2d3748]/50 p-2 rounded-sm text-xs">
                    <p>{event.description}</p>
                  </div>
                </div>
              ))}
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
