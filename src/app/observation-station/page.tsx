'use client';

import { useState, useEffect } from 'react';
import { Character, MoodType, CharacterObservation } from '@/types/character';
import { apiService } from '@/services/api';
import { useObservationEffects } from '@/hooks/useObservationEffects';
import Header from '@/components/observation-station/Header';
import ControlPanel from '@/components/observation-station/ControlPanel';
import CharacterWindow from '@/components/observation-station/CharacterWindow';
import EventTicker from '@/components/observation-station/EventTicker';
import CharacterModal from '@/components/observation-station/CharacterModal';

// 模拟数据，用于演示
const mockCharacters: Character[] = [
  {
    name: '张明',
    age: 32,
    gender: 'male',
    occupation: '软件工程师',
    background: '技术背景，喜欢编程',
    mbti_type: 'INTJ',
    personality: ['内向', '理性', '专注'],
    big5: { openness: 0.8, conscientiousness: 0.9, extraversion: 0.3, agreeableness: 0.7, neuroticism: 0.4 },
    motivation: '追求技术突破',
    conflict: '工作与生活的平衡',
    flaw: '容易急躁',
    character_arc: '从技术专家到团队领袖',
    hobbies: ['编程', '喝咖啡', '科幻小说'],
    relationships: { 'Sophie': '工作伙伴', 'Yuki': '网友' },
    daily_routine: [],
    speech_style: '正式',
    tone: '友好',
    response_speed: '中等',
    communication_style: '直接',
    favored_topics: ['技术', '科幻'],
    disliked_topics: ['八卦'],
    taboos: ['隐私'],
    beliefs: ['技术改变世界'],
    goals: ['成为技术专家'],
    fears: ['技术落后'],
    secrets: ['有时会偷偷玩游戏'],
    habits: ['挠头', '喝咖啡'],
    mood: '愉快',
    mood_swings: '稳定',
    memory: {},
    character_id: 'zhangming_1',
    is_preset: false
  },
  {
    name: 'Sophie',
    age: 28,
    gender: 'female',
    occupation: '设计师',
    background: '艺术背景，热爱设计',
    mbti_type: 'ENFP',
    personality: ['开朗', '创意', '敏感'],
    big5: { openness: 0.9, conscientiousness: 0.6, extraversion: 0.8, agreeableness: 0.8, neuroticism: 0.5 },
    motivation: '创造美的事物',
    conflict: '创意与商业的平衡',
    flaw: '情绪化',
    character_arc: '从设计师到创意总监',
    hobbies: ['绘画', '速写', '旅行'],
    relationships: { '张明': '工作伙伴', 'Carlos': '朋友' },
    daily_routine: [],
    speech_style: '口语化',
    tone: '温柔',
    response_speed: '快速',
    communication_style: '委婉',
    favored_topics: ['艺术', '设计'],
    disliked_topics: ['技术细节'],
    taboos: ['批评作品'],
    beliefs: ['美能改变世界'],
    goals: ['成为知名设计师'],
    fears: ['创意枯竭'],
    secrets: ['有时会抄袭灵感'],
    habits: ['转笔', '咬指甲'],
    mood: '平静',
    mood_swings: '多变',
    memory: {},
    character_id: 'sophie_1',
    is_preset: false
  },
  {
    name: 'Carlos',
    age: 35,
    gender: 'male',
    occupation: '教练',
    background: '体育背景，热爱运动',
    mbti_type: 'ESFJ',
    personality: ['外向', '热情', '负责'],
    big5: { openness: 0.6, conscientiousness: 0.8, extraversion: 0.9, agreeableness: 0.8, neuroticism: 0.3 },
    motivation: '帮助他人成长',
    conflict: '个人成就与团队成功',
    flaw: '过于理想化',
    character_arc: '从运动员到教练',
    hobbies: ['足球', '健身', '阅读'],
    relationships: { 'Sophie': '朋友', '张明': '网友' },
    daily_routine: [],
    speech_style: '激励性',
    tone: '热情',
    response_speed: '快速',
    communication_style: '直接',
    favored_topics: ['运动', '团队合作'],
    disliked_topics: ['消极话题'],
    taboos: ['失败'],
    beliefs: ['团队合作的力量'],
    goals: ['培养冠军'],
    fears: ['团队失败'],
    secrets: ['有时会偷偷训练'],
    habits: ['拍手', '鼓励他人'],
    mood: '低落',
    mood_swings: '敏感',
    memory: {},
    character_id: 'carlos_1',
    is_preset: false
  }
];

export default function ObservationStation() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [observations, setObservations] = useState<CharacterObservation[]>([]);
  const [timeSpeed, setTimeSpeed] = useState('1x');
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [events, setEvents] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 使用动态效果hook
  useObservationEffects();

  // 模拟角色观察数据
  const generateObservations = (chars: Character[]): CharacterObservation[] => {
    return chars.map(char => ({
      character: char,
      currentAction: getRandomAction(char),
      currentTime: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      mood: getMoodFromCharacter(char),
      hint: Math.random() > 0.7 ? getRandomHint(char) : undefined
    }));
  };

  const getRandomAction = (character: Character): string => {
    const actions = {
      '软件工程师': ['调试代码中', '写文档', '参加会议', '喝咖啡', '解决技术难题', '代码审查'],
      '设计师': ['构思设计方案', '画草图', '查看参考资料', '转笔', '翻速写本', '画窗外风景'],
      '教练': ['训练队员', '赛后总结', '制定计划', '散步', '鼓励队员', '分析比赛录像']
    };
    
    const occupationActions = actions[character.occupation as keyof typeof actions] || ['工作中'];
    return occupationActions[Math.floor(Math.random() * occupationActions.length)];
  };

  const getMoodFromCharacter = (character: Character): MoodType => {
    if (character.mood.includes('愉快') || character.mood.includes('开心')) return 'happy';
    if (character.mood.includes('低落') || character.mood.includes('悲伤')) return 'sad';
    if (character.mood.includes('兴奋') || character.mood.includes('激动')) return 'excited';
    return 'neutral';
  };

  const getRandomHint = (character: Character): string => {
    const hints = [
      `${character.habits[0] || '挠了挠头'}（习惯性动作）`,
      `${character.habits[1] || '叹了口气'}（情绪波动）`,
      '看了看窗外（分心）',
      '调整了坐姿（舒适度）',
      '露出微笑（有成就感）',
      '皱了皱眉（遇到困难）',
      '伸了个懒腰（疲劳）',
      '喝了口水（口渴）'
    ];
    return hints[Math.floor(Math.random() * hints.length)];
  };

  // 加载角色数据
  useEffect(() => {
    const loadCharacters = async () => {
      try {
        // 在实际环境中，这里会调用API
        // const response = await apiService.getCharacters();
        // setCharacters(response.data);
        
        // 使用模拟数据
        setCharacters(mockCharacters);
        setObservations(generateObservations(mockCharacters));
      } catch (error) {
        console.error('Failed to load characters:', error);
        // 使用模拟数据作为后备
        setCharacters(mockCharacters);
        setObservations(generateObservations(mockCharacters));
      } finally {
        setLoading(false);
      }
    };

    loadCharacters();
  }, []);

  // 更新事件列表
  useEffect(() => {
    const newEvents = observations.map(obs => {
      const baseEvent = `${obs.character.name} ${obs.currentAction}`;
      if (obs.hint) {
        return `${baseEvent}，${obs.hint}`;
      }
      return `${baseEvent}，状态正常`;
    });
    
    // 添加一些更丰富的事件描述
    const richEvents = [
      ...newEvents,
      `${observations[0]?.character.name || '张明'}完成了代码调试，露出微笑（符合人格：有成就感时会表露情绪）`,
      `${observations[1]?.character.name || 'Sophie'} 翻了翻速写本，画下了窗外的树（符合爱好：绘画）`,
      `${observations[2]?.character.name || 'Carlos'} 收到了朋友的安慰消息，情绪略有好转（关系：好友）`
    ];
    
    setEvents(richEvents);
  }, [observations]);

  // 定期更新观察数据
  useEffect(() => {
    const interval = setInterval(() => {
      setObservations(prev => prev.map(obs => ({
        ...obs,
        currentAction: getRandomAction(obs.character),
        currentTime: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        hint: Math.random() > 0.8 ? getRandomHint(obs.character) : undefined
      })));
    }, 10000); // 每10秒更新一次

    return () => clearInterval(interval);
  }, []);

  const handleCharacterClick = (character: Character) => {
    setSelectedCharacter(character);
    setIsModalOpen(true);
  };

  const handleAddCharacter = () => {
    // 这里可以实现添加角色的逻辑
    console.log('Add character clicked');
  };

  if (loading) {
    return (
      <div className="bg-[#1a1f29] text-gray-300 min-h-screen font-mono flex items-center justify-center">
        <div className="text-center">
                      <div className="w-8 h-8 bg-[#38b2ac] rounded-sm mx-auto mb-4 pulse-slow"></div>
          <p>加载角色数据中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1a1f29] text-gray-300 min-h-screen font-mono">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <ControlPanel
          characterCount={observations.length}
          timeSpeed={timeSpeed}
          onTimeSpeedChange={setTimeSpeed}
          onAddCharacter={handleAddCharacter}
        />
        
        {/* 观察窗口网格 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {observations.map((observation, index) => (
            <CharacterWindow
              key={observation.character.character_id}
              character={observation.character}
              currentAction={observation.currentAction}
              currentTime={observation.currentTime}
              mood={observation.mood}
              hint={observation.hint}
              onClick={() => handleCharacterClick(observation.character)}
              index={index}
            />
          ))}
        </div>
        
        <EventTicker events={events} />
      </main>

      <CharacterModal
        character={selectedCharacter}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
