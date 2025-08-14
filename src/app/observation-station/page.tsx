'use client';

import { useState, useEffect } from 'react';
import { Character, MoodType, CharacterObservation } from '@/types/character';
import Link from 'next/link';
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
  },
  {
    name: '王芳',
    age: 30,
    gender: 'female',
    occupation: '企业家',
    background: '商业背景，创立了自己的公司',
    mbti_type: 'ENTJ',
    personality: ['果断', '自信', '目标导向'],
    big5: { openness: 0.7, conscientiousness: 0.9, extraversion: 0.8, agreeableness: 0.6, neuroticism: 0.3 },
    motivation: '创建成功的企业',
    conflict: '事业与家庭的平衡',
    flaw: '过于严格',
    character_arc: '从创业者到行业领袖',
    hobbies: ['商业阅读', '高尔夫', '社交'],
    relationships: { '张明': '业务伙伴', 'Sophie': '朋友' },
    daily_routine: [],
    speech_style: '权威',
    tone: '坚定',
    response_speed: '快速',
    communication_style: '直接',
    favored_topics: ['商业策略', '领导力'],
    disliked_topics: ['无效率'],
    taboos: ['失败'],
    beliefs: ['努力工作创造成功'],
    goals: ['成为行业领导者'],
    fears: ['公司破产'],
    secrets: ['曾经创业失败'],
    habits: ['看手表', '做笔记'],
    mood: '专注',
    mood_swings: '稳定',
    memory: {},
    character_id: 'wangfang_1',
    is_preset: false
  },
  {
    name: '李明',
    age: 40,
    gender: 'male',
    occupation: '教师',
    background: '教育背景，热爱教学',
    mbti_type: 'INFJ',
    personality: ['耐心', '关怀', '智慧'],
    big5: { openness: 0.8, conscientiousness: 0.9, extraversion: 0.5, agreeableness: 0.9, neuroticism: 0.4 },
    motivation: '启发学生',
    conflict: '理想与现实的教育体制',
    flaw: '过于理想化',
    character_arc: '从新教师到教育改革者',
    hobbies: ['阅读', '写作', '徒步'],
    relationships: { 'Carlos': '朋友', '王芳': '老同学' },
    daily_routine: [],
    speech_style: '启发式',
    tone: '温和',
    response_speed: '中等',
    communication_style: '耐心',
    favored_topics: ['教育', '文学'],
    disliked_topics: ['标准化考试'],
    taboos: ['不尊重知识'],
    beliefs: ['每个学生都能成功'],
    goals: ['改变教育现状'],
    fears: ['学生失去学习兴趣'],
    secrets: ['写匿名教育博客'],
    habits: ['推眼镜', '点头'],
    mood: '平静',
    mood_swings: '稳定',
    memory: {},
    character_id: 'liming_1',
    is_preset: false
  },
  {
    name: 'Sarah',
    age: 33,
    gender: 'female',
    occupation: '医生',
    background: '医学背景，专注于儿科',
    mbti_type: 'ISFJ',
    personality: ['细心', '善良', '负责'],
    big5: { openness: 0.6, conscientiousness: 0.9, extraversion: 0.5, agreeableness: 0.9, neuroticism: 0.5 },
    motivation: '帮助儿童健康成长',
    conflict: '工作压力与个人生活',
    flaw: '过度工作',
    character_arc: '从实习医生到儿科专家',
    hobbies: ['瑜伽', '摄影', '照顾宠物'],
    relationships: { 'Sophie': '邻居', '李明': '朋友' },
    daily_routine: [],
    speech_style: '专业',
    tone: '亲切',
    response_speed: '快速',
    communication_style: '清晰',
    favored_topics: ['儿童健康', '医学研究'],
    disliked_topics: ['医疗纠纷'],
    taboos: ['不尊重生命'],
    beliefs: ['医生的职责是救死扶伤'],
    goals: ['成为儿科权威'],
    fears: ['无法拯救患者'],
    secrets: ['有时会为贫困患者免费治疗'],
    habits: ['洗手', '整理物品'],
    mood: '担忧',
    mood_swings: '中等',
    memory: {},
    character_id: 'sarah_1',
    is_preset: false
  },
  {
    name: 'David',
    age: 28,
    gender: 'male',
    occupation: '音乐家',
    background: '音乐背景，擅长钢琴',
    mbti_type: 'INFP',
    personality: ['敏感', '创造力', '理想主义'],
    big5: { openness: 0.9, conscientiousness: 0.7, extraversion: 0.4, agreeableness: 0.8, neuroticism: 0.6 },
    motivation: '用音乐表达情感',
    conflict: '艺术与商业的平衡',
    flaw: '情绪化',
    character_arc: '从独立音乐人到知名作曲家',
    hobbies: ['作曲', '听音乐', '旅行'],
    relationships: { 'Sarah': '朋友', '张明': '音乐伙伴' },
    daily_routine: [],
    speech_style: '诗意',
    tone: '感性',
    response_speed: '中等',
    communication_style: '委婉',
    favored_topics: ['音乐', '艺术'],
    disliked_topics: ['商业化'],
    taboos: ['抄袭'],
    beliefs: ['音乐是灵魂的语言'],
    goals: ['创作传世之作'],
    fears: ['灵感枯竭'],
    secrets: ['写过未发表的小说'],
    habits: ['哼歌', '敲击节奏'],
    mood: '忧郁',
    mood_swings: '明显',
    memory: {},
    character_id: 'david_1',
    is_preset: false
  },
  {
    name: 'Lisa',
    age: 26,
    gender: 'female',
    occupation: '作家',
    background: '文学背景，出版过小说',
    mbti_type: 'INTP',
    personality: ['好奇', '理性', '创造力'],
    big5: { openness: 0.9, conscientiousness: 0.8, extraversion: 0.3, agreeableness: 0.7, neuroticism: 0.5 },
    motivation: '讲述有意义的故事',
    conflict: '创作瓶颈',
    flaw: '拖延',
    character_arc: '从新人作家到畅销书作者',
    hobbies: ['阅读', '写作', '观察人群'],
    relationships: { 'David': '合作伙伴', '王芳': '读者' },
    daily_routine: [],
    speech_style: '文学化',
    tone: '沉思',
    response_speed: '慢',
    communication_style: '间接',
    favored_topics: ['文学', '哲学'],
    disliked_topics: ['浮躁'],
    taboos: ['剽窃'],
    beliefs: ['故事有改变世界的力量'],
    goals: ['写出伟大的小说'],
    fears: ['江郎才尽'],
    secrets: ['有未公开的笔名'],
    habits: ['咬笔', '踱步'],
    mood: '思考',
    mood_swings: '中等',
    memory: {},
    character_id: 'lisa_1',
    is_preset: false
  },
  {
    name: 'Chef Wu',
    age: 45,
    gender: 'male',
    occupation: '厨师',
    background: '餐饮背景，拥有自己的餐厅',
    mbti_type: 'ESTP',
    personality: ['务实', '灵活', '热情'],
    big5: { openness: 0.7, conscientiousness: 0.8, extraversion: 0.8, agreeableness: 0.7, neuroticism: 0.4 },
    motivation: '创造美食',
    conflict: '传统与创新的平衡',
    flaw: '脾气急躁',
    character_arc: '从学徒到星级厨师',
    hobbies: ['烹饪', '品尝美食', '旅行'],
    relationships: { 'Carlos': '美食伙伴', 'Lisa': '顾客' },
    daily_routine: [],
    speech_style: '直接',
    tone: '热情',
    response_speed: '快速',
    communication_style: '豪爽',
    favored_topics: ['美食', '烹饪技巧'],
    disliked_topics: ['难吃的食物'],
    taboos: ['浪费食材'],
    beliefs: ['美食能带来快乐'],
    goals: ['获得米其林星级'],
    fears: ['失去味觉'],
    secrets: ['有一道祖传秘方'],
    habits: ['擦手', '尝味道'],
    mood: '兴奋',
    mood_swings: '明显',
    memory: {},
    character_id: 'chefwu_1',
    is_preset: false
  },
  {
    name: '默认角色',
    age: 30,
    gender: 'male',
    occupation: '无特定职业',
    background: '普通背景',
    mbti_type: 'ISTJ',
    personality: ['可靠', '踏实', '细心'],
    big5: { openness: 0.5, conscientiousness: 0.9, extraversion: 0.4, agreeableness: 0.8, neuroticism: 0.3 },
    motivation: '过稳定的生活',
    conflict: '稳定与变化',
    flaw: '保守',
    character_arc: '从平凡到找到自我价值',
    hobbies: ['散步', '阅读', '看电影'],
    relationships: { '张明': '邻居', 'Sophie': '同事' },
    daily_routine: [],
    speech_style: '平实',
    tone: '温和',
    response_speed: '中等',
    communication_style: '直接',
    favored_topics: ['日常生活', '电影'],
    disliked_topics: ['冲突'],
    taboos: ['不诚实'],
    beliefs: ['平凡中见伟大'],
    goals: ['家庭幸福'],
    fears: ['改变'],
    secrets: ['曾经有过伟大的梦想'],
    habits: ['按时作息', '整理房间'],
    mood: '平静',
    mood_swings: '稳定',
    memory: {},
    character_id: 'default_1',
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
      '教练': ['训练队员', '赛后总结', '制定计划', '散步', '鼓励队员', '分析比赛录像'],
      '企业家': ['参加会议', '制定战略', '见客户', '阅读商业报告', '喝咖啡思考', '激励团队'],
      '教师': ['备课', '讲课', '批改作业', '与学生交流', '阅读教育书籍', '参加教研活动'],
      '医生': ['看诊', '写病历', '参加学术会议', '研究病例', '查房', '与患者沟通'],
      '音乐家': ['作曲', '练习乐器', '听音乐', '演出', '创作歌词', '与其他音乐人交流'],
      '作家': ['写作', '阅读', '构思情节', '修改稿件', '观察生活', '与读者交流'],
      '厨师': ['准备食材', '烹饪', '创新菜品', '试味', '清理厨房', '研究食谱'],
      '无特定职业': ['散步', '阅读', '看电影', '做家务', '与朋友聊天', '思考人生']
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
