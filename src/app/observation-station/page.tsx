'use client';
import React, { useState, useEffect } from 'react';
import actionCategories from '@/config/characterActions';
import hintCategories from '@/config/characterHints';
import { Character, MoodType, CharacterObservation } from '@/types/character';
import { apiService } from '@/services/api';
import { eventApiService } from '@/services/event_api';
import { interactionApiService } from '@/services/interaction_api';
import { useObservationEffects } from '@/hooks/useObservationEffects';
import Header from '@/components/observation-station/Header';
import ControlPanel from '@/components/observation-station/ControlPanel';
import CharacterWindow from '@/components/observation-station/CharacterWindow';
import EventTicker from '@/components/observation-station/EventTicker';
import CharacterModal from '@/components/observation-station/CharacterModal';
import Pagination from '@/components/observation-station/Pagination';
import AlphabetFilter from '@/components/observation-station/AlphabetFilter';

export default function ObservationStation() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [observations, setObservations] = useState<CharacterObservation[]>([]);
  const [timeSpeed, setTimeSpeed] = useState('1x');
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [events, setEvents] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12); // 每页显示12个角色
  const [totalItems, setTotalItems] = useState(0);
  
  // 字母筛选状态
  const [selectedLetter, setSelectedLetter] = useState('');
  const [filteredCharacters, setFilteredCharacters] = useState<Character[]>([]);
  
  // 移动端抽屉状态
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // 使用动态效果hook
  useObservationEffects();

  // 模拟角色观察数据
  const generateObservations = (chars: Character[]): CharacterObservation[] => {
    return chars.map(char => ({
      character: char,
      currentAction: getRandomAction(char),
      currentTime: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      mood: getMoodFromCharacter(char),
      hint: Math.random() > 0.7 ? getRandomHint(char) : undefined,
      interactionStats: (char as any).interactionStats || {
        feed: 0,
        comfort: 0,
        overtime: 0,
        water: 0
      }
    }));
  };
  const getRandomAction = (character: Character): string => {   // 找到对应职业的分类
    const category = actionCategories.find(cat => 
      cat.keywords.some(keyword => character.occupation.includes(keyword))
    );
    
    // 如果找到分类，则从该分类的actions中随机选择一个
    if (category) {
      return category.actions[Math.floor(Math.random() * category.actions.length)];
    }
    
    // 默认返回'工作中'
    return '思考中';
  };

  const getMoodFromCharacter = (character: Character): MoodType => {
    if (!character.mood) return 'neutral';
    if (character.mood.includes('愉快') || character.mood.includes('开心') || character.mood.includes('高兴') || character.mood.includes('幸运将至') || character.mood.includes('干劲十足') || character.mood.includes('拯救世界')) return 'happy';
    if (character.mood.includes('低落') || character.mood.includes('悲伤') || character.mood.includes('难过') || character.mood.includes('愤怒') || character.mood.includes('恐惧') || character.mood.includes('厌恶')) return 'sad';
    if (character.mood.includes('兴奋') || character.mood.includes('激动')) return 'excited';
    if (character.mood.includes('平静') || character.mood.includes('冥想')) return 'calm';
    if (character.mood.includes('焦虑') || character.mood.includes('无奈') || character.mood.includes('无语')) return 'anxious';
    return 'neutral';
  };

  const getRandomHint = (character: Character): string => {
    // 优先根据角色情绪匹配提示语分类
    const moodCategory = hintCategories.find(cat => 
      cat.keywords.some(keyword => character.mood.toLowerCase().includes(keyword))
    );

    // 如果没有匹配到情绪分类，尝试根据职业匹配
    if (!moodCategory) {
      const occupationCategory = hintCategories.find(cat => 
        cat.keywords.some(keyword => character.occupation.toLowerCase().includes(keyword))
      );

      if (occupationCategory) {
        return occupationCategory.hints[Math.floor(Math.random() * occupationCategory.hints.length)];
      }
    }

    // 如果匹配到情绪分类，使用该分类的提示语
    if (moodCategory) {
      return moodCategory.hints[Math.floor(Math.random() * moodCategory.hints.length)];
    }

    // 如果没有匹配到任何分类，从所有提示语中随机选择
    const allHints = hintCategories.flatMap(cat => cat.hints);
    return allHints[Math.floor(Math.random() * allHints.length)] || '思考中';
  };

  // 加载角色数据
  const loadCharacters = async (page: number = 1, letterFilter?: string) => {
    try {
      setLoading(true);
      
      // 计算偏移量
      const offset = (page - 1) * itemsPerPage;
      
      // 使用传入的字母筛选值，如果没有则使用当前选中的字母
      const filterLetter = letterFilter !== undefined ? letterFilter : selectedLetter;
      
      // 传递参数获取指定页数的角色，并包含字母筛选条件
      const response = await apiService.getCharacters(itemsPerPage, offset, filterLetter);
      
      // API现在返回的格式是：{ data: { data: [...characters], total: number } }
      const paginatedData = response.data || { data: [], total: 0 };
      const characters = paginatedData.data || [];
      
      // 从API返回获取总角色数
    const totalFromApi = paginatedData.total;
    
    // 总是更新总角色数为后端返回的总数
    // 这样分页器才能正确显示当前筛选条件下的总页数
    setTotalItems(totalFromApi);

        // 先设置原始角色数据
        setCharacters(characters);
        
        // 如果有角色数据
        if (characters.length > 0) {
          // 批量获取事件配置和互动统计数据（放入独立的try-catch块）
          try {
            const characterIds = characters.map(character => character.character_id);
            
            // 并行获取事件配置和互动统计数据，使用allSettled确保一个失败不影响另一个
            const [eventProfilesResult, interactionStatsResult] = await Promise.allSettled([
              eventApiService.getEventProfilesByCharacterIds(characterIds),
              interactionApiService.getBatchInteractionStats(characterIds)
            ]);
            
            // 处理事件配置数据
            let eventProfiles = {};
            if (eventProfilesResult.status === 'fulfilled') {
              eventProfiles = eventProfilesResult.value.data;
            } else {
              console.error('获取事件配置失败:', eventProfilesResult.reason);
            }

            // 处理互动统计数据
            let interactionStats = {};
            if (interactionStatsResult.status === 'fulfilled') {
              interactionStats = interactionStatsResult.value.data;
            } else {
              console.error('获取互动统计数据失败:', interactionStatsResult.reason);
            }
            // 将事件配置和互动统计数据合并到角色数据中
            const charactersWithData = characters.map(character => {
              const stats = (interactionStats as { [key: string]: any })[character.character_id];
              return {
                ...character,
                event_profile: (eventProfiles as { [key: string]: any })[character.character_id]?.[0] || null,
                interactionStats: stats ? {
                  feed: stats.feed_count || 0,
                  comfort: stats.comfort_count || 0,
                  overtime: stats.overtime_count || 0,
                  water: stats.water_count || 0
                } : {
                  feed: 0,
                  comfort: 0,
                  overtime: 0,
                  water: 0
                }
              };
            });

            setCharacters(charactersWithData);
            // 应用字母筛选
            applyLetterFilter(charactersWithData, selectedLetter);
          } catch (error) {
            console.error('获取附加数据失败:', error);
            // 获取失败时，使用默认角色数据生成观察数据
            applyLetterFilter(characters, selectedLetter);
          }
        } else {
          // 没有数据时重置所有状态
          setFilteredCharacters([]);
          setObservations([]);
          if (selectedLetter) {
            // 如果有字母筛选，显示筛选后的结果为0
            setTotalItems(0);
          }
        }
      
    } catch (error) {
      console.error('Failed to load characters:', error);
      // 使用模拟数据作为后备
      // setCharacters(mockCharacters);
      // setObservations(generateObservations(mockCharacters));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // 初始加载
  useEffect(() => {
    loadCharacters();
  }, []);
  
  // 处理字母选择
  const handleLetterSelect = (letter: string) => {
    setSelectedLetter(letter);
    setCurrentPage(1); // 重置到第一页
    // 清空当前筛选结果，准备加载新数据
    setFilteredCharacters([]);
    // 直接将选中的字母作为参数传递给loadCharacters，确保使用最新值
    loadCharacters(1, letter);
  };

  // 处理筛选后的角色数据（现在筛选逻辑由后端处理）
  const applyLetterFilter = (allCharacters: Character[], letter: string) => {
    // 直接使用后端返回的已筛选数据
    setFilteredCharacters(allCharacters);
    // 设置观察数据
    setObservations(generateObservations(allCharacters));
  };

  // 处理分页变化
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadCharacters(page);
  };

  // 处理刷新
  const handleRefresh = () => {
    setRefreshing(true);
    loadCharacters(currentPage);
  };

  // 更新事件列表
  useEffect(() => {
    const newEvents = observations.map(obs => {
      const baseEvent = `${obs.character.name} ${obs.currentAction}`;
      if (obs.hint) {
        return `${baseEvent}，${obs.hint}`;
      }
      return `${baseEvent}，${obs.character.mood}`;
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
    // 刷新角色列表以显示新添加的角色
    setRefreshing(true);
    loadCharacters(currentPage);
  };

  return (
    <div className="text-gray-300 min-h-screen font-mono overflow-x-hidden">
      {/* 未来科技像素风背景 */}
      <div className="fixed inset-0 z-0 bg-[#121827] overflow-hidden">
        {/* 主渐变背景 */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,var(--tw-gradient-stops))] from-[#312e81] via-[#1e1b4b] to-[#121827]"></div>
        
        {/* 像素风格噪点纹理 */}
        <div className="absolute inset-0 opacity-15 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.3%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')] bg-repeat"></div>
        
        {/* 科技感几何光晕 */}
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-[#4f46e5] rounded-full filter blur-[120px] opacity-20"></div>
        <div className="absolute bottom-1/3 right-1/4 w-1/3 h-1/3 bg-[#06b6d4] rounded-full filter blur-[100px] opacity-15"></div>
        
        {/* 像素风科技网格线效果 */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#2563eb22_1px,transparent_1px),linear-gradient(to_bottom,#2563eb22_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        
        {/* 科技感扫描线效果 */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(37,99,235,0.05)] to-transparent bg-[length:100%_16px] animate-[scan_8s_linear_infinite]"></div>
        
        {/* 顶部和底部科技感边框 */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-[#3b82f6] to-transparent opacity-60"></div>
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-[#06b6d4] to-transparent opacity-60"></div>
      </div>
      
      {/* 全局动画样式 */}
      <style jsx global>{`
        @keyframes scan {
          0% { background-position: 0 -100vh; }
          100% { background-position: 0 100vh; }
        }
      `}</style>
      
      {/* 主要内容容器，添加顶部内边距以避免被固定Header遮挡 */}
      <div className="relative z-10 pt-16 pb-12">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <ControlPanel
          characterCount={totalItems}
          timeSpeed={timeSpeed}
          onTimeSpeedChange={setTimeSpeed}
          onAddCharacter={handleAddCharacter}
          onRefresh={handleRefresh}
          refreshing={refreshing || loading}
        />
        
        {/* 主要内容区域 - 角色列表和字母筛选 */}
        <div className="relative">
          <div className="flex flex-col lg:flex-row gap-3 mt-6">
            {/* 角色列表区域 - 占用剩余空间 */}
            <div className="flex-1 min-w-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                {loading || refreshing ? (
                  // 列表级别的加载动效
                  Array(itemsPerPage).fill(0).map((_, index) => (
                    <div key={index} className="border border-[#2d3748] bg-[#1a1f29]/50 p-4 rounded-sm animate-pulse opacity-70">
                      <div className="h-16 w-full bg-[#2d3748] mb-2 rounded-sm"></div>
                      <div className="h-4 w-2/3 bg-[#2d3748] mb-2 rounded-sm"></div>
                      <div className="h-4 w-1/2 bg-[#2d3748] rounded-sm"></div>
                    </div>
                  ))
                ) : observations.map((observation, index) => (
                  <CharacterWindow
                    key={observation.character.character_id}
                    character={observation.character}
                    currentAction={observation.currentAction}
                    currentTime={observation.currentTime}
                    mood={observation.mood}
                    hint={observation.hint}
                    onClick={() => handleCharacterClick(observation.character)}
                    index={index}
                    interactionStats={observation.interactionStats || {
                      feed: 0,
                      comfort: 0,
                      overtime: 0,
                      water: 0
                    }}
                  />
                ))}
              </div>
            </div>
            
            {/* 桌面端 - 右侧字母筛选组件 */}
            <div className="hidden lg:block w-[40px] flex-shrink-0">
              <AlphabetFilter
                selectedLetter={selectedLetter}
                onLetterSelect={handleLetterSelect}
              />
            </div>
          </div>
          
          {/* 移动端 - 浮动筛选按钮 */}
          <button 
            className="lg:hidden fixed bottom-6 right-6 w-12 h-12 bg-[#38b2ac] text-[#1a1f29] rounded-full flex items-center justify-center shadow-lg z-30 transition-transform duration-300 hover:scale-110"
            onClick={() => setIsDrawerOpen(true)}
            aria-label="打开字母筛选器"
          >
            <span className="text-lg font-bold">A-Z</span>
          </button>
          
          {/* 移动端 - 抽屉式字母筛选组件 */}
          <div 
            className={`fixed inset-y-0 right-0 w-32 bg-[#232a39] border-l border-[#2d3748] z-40 transition-transform duration-300 ease-in-out transform ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'} lg:hidden`}
          >
            <div className="p-4 h-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-[#38b2ac]">名字首字母</h3>
                <button 
                  className="text-gray-400 hover:text-white"
                  onClick={() => setIsDrawerOpen(false)}
                  aria-label="关闭字母筛选器"
                >
                  ✕
                </button>
              </div>
              <div className="sticky top-4">
                <AlphabetFilter
                  selectedLetter={selectedLetter}
                  onLetterSelect={(letter) => {
                    handleLetterSelect(letter);
                    setIsDrawerOpen(false);
                  }}
                />
              </div>
            </div>
          </div>
          
          {/* 抽屉遮罩层 */}
            {isDrawerOpen && (
              <div 
                className="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-30 lg:hidden"
                onClick={() => setIsDrawerOpen(false)}
              ></div>
            )}
        </div>
        {/* 分页组件 */}
        {observations.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onRefresh={handleRefresh}
          />
        )}
        
        <EventTicker events={events} />
      </main>

      {isModalOpen && (
        <CharacterModal
          character={selectedCharacter}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      </div>
    </div>
  );
}
