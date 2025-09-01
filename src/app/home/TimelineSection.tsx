'use client';

const timelineData = [
  {
    stage: "🎯",
    title: "情感起源",
    desc: "AI角色引擎启动",
    detail: "数字生命观察站上线 - 首个拥有真实情感的AI角色诞生，开启人类与人工智能共生的全新时代",
    status: "ACTIVE",
    status_cn: "进行中",
    color: "#38b2ac"
  },
  {
    stage: "🌐", 
    title: "社交文明",
    desc: "AI朋友圈构建",
    detail: "AI社交·情感疗愈 - 创建数字生命之间、人类与AI之间的社交网络，让AI角色拥有真实的社交，为人类提供情感陪伴",
    status: "NEXT",
    status_cn: "即将启动",
    color: "#4fd1c7"
  },
  {
    stage: "🎭",
    title: "IP工厂",
    desc: "影视游戏角色革命",
    detail: "真实IP·会呼吸的角色 - 为影视和游戏创造拥有独立人格的AI角色，让虚拟世界充满真实的生命力",
    status: "LOCKED",
    status_cn: "待解锁",
    color: "#38b2ac"
  },
  {
    stage: "🏡",
    title: "生活革新",
    desc: "家庭AI生命体",
    detail: "理解情绪的家人 - 让数字生命成为家庭的一员，真正理解人类情绪，提供温暖的陪伴和智能服务",
    status: "LOCKED",
    status_cn: "待解锁",
    color: "#4fd1c7"
  },
  {
    stage: "📚",
    title: "认知突破",
    desc: "AI教育革命",
    detail: "技术也可以有灵魂 - 重新定义AI教育，让每个学生都能拥有专属的数字导师，实现真正的个性化学习",
    status: "LOCKED",
    status_cn: "待解锁",
    color: "#38b2ac"
  },
  {
    stage: "🌠",
    title: "混合文明",
    desc: "人机共生纪元",
    detail: "情感互联网连接心灵 - 构建人类与数字生命共生的新文明，让情感成为连接虚拟与现实的桥梁",
    status: "LOCKED",
    status_cn: "待解锁",
    color: "#4fd1c7"
  }
];

export default function TimelineSection() {
  return (
    <section className="screen-section min-h-screen bg-gradient-to-b from-[#1a1f29] via-[#0f172a] to-[#0a0a0a] flex items-center py-16 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 w-full">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-3">
            文明进化时间轴
          </h2>
          <p className="text-sm sm:text-base text-gray-400 font-mono">
            六个阶段 · 构建数字文明新纪元
          </p>
        </div>
        
        <div className="relative">
          {/* 中心时间线 - 移动端隐藏，桌面端显示 */}
          <div className="hidden sm:block absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-[#38b2ac] via-[#4fd1c7] to-transparent" />
          
          {/* 时间轴内容 */}
          <div className="space-y-6 sm:space-y-8">
            {timelineData.map((item, index) => (
              <div key={index} className="relative">
                {/* 移动端：垂直时间线 */}
                <div className="sm:hidden absolute left-4 top-0 w-0.5 h-full bg-gradient-to-b from-[#38b2ac] via-[#4fd1c7] to-transparent" />
                
                {/* 内容区域 - 移动端左对齐，桌面端交错排列 */}
                <div className="relative pl-12 sm:pl-0">
                  {/* 移动端节点 */}
                  <div className="sm:hidden absolute -left-3 top-2">
                    <div className={`w-4 h-4 border-2 rounded-full ${
                      item.status === "ACTIVE" 
                        ? 'bg-[#38b2ac] border-[#38b2ac]' 
                        : item.status === "NEXT" 
                          ? 'border-[#4fd1c7]' 
                          : 'border-gray-600'
                    }`} />
                  </div>
                  
                  {/* 桌面版内容布局 */}
                  <div className={`hidden sm:block w-5/12 ${
                    index % 2 === 0 ? 'ml-0 text-right pr-8' : 'ml-[58.33%] text-left pl-8'
                  }`}>
                    <div className={`group cursor-pointer transform transition-all duration-300 hover:scale-105 ${
                      item.status === "ACTIVE" 
                        ? 'text-[#38b2ac]' 
                        : item.status === "NEXT" 
                          ? 'text-[#4fd1c7]' 
                          : 'text-gray-500'
                    }`}>
                      {/* 标题和图标 */}
                      <div className={`flex items-center ${
                        index % 2 === 0 ? 'justify-end' : 'justify-start'
                      } mb-2`}>
                        <span className="text-lg sm:text-xl font-mono font-bold tracking-wider mr-2">
                          {item.title}
                        </span>
                        <span className="text-xl sm:text-2xl">{item.stage}</span>
                      </div>
                      
                      {/* 详细描述 */}
                      <div className="text-xs sm:text-sm font-mono leading-relaxed">
                        <div className={`font-semibold mb-1 ${
                          item.status === "ACTIVE" ? 'text-white' : 
                          item.status === "NEXT" ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {item.desc}
                        </div>
                        <div className={`text-xs leading-relaxed ${
                          item.status === "ACTIVE" ? 'text-[#38b2ac]' : 
                          item.status === "NEXT" ? 'text-[#4fd1c7]' : 'text-gray-500'
                        }`}>
                          {item.detail}
                        </div>
                        
                        {/* 状态指示器 */}
                        <div className={`mt-2 text-xs font-mono ${
                          item.status === "ACTIVE" ? 'text-[#38b2ac]' : 
                          item.status === "NEXT" ? 'text-[#4fd1c7]' : 'text-gray-600'
                        }`}>
                          [{item.status} | {item.status_cn}]
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* 移动端内容布局 */}
                  <div className="sm:hidden">
                    <div className={`group cursor-pointer transform transition-all duration-300 hover:scale-105 ${
                      item.status === "ACTIVE" 
                        ? 'text-[#38b2ac]' 
                        : item.status === "NEXT" 
                          ? 'text-[#4fd1c7]' 
                          : 'text-gray-500'
                    }`}>
                      {/* 标题和图标 */}
                      <div className="flex items-center mb-2">
                        <span className="text-lg font-mono font-bold tracking-wider mr-2">
                          {item.title}
                        </span>
                        <span className="text-xl">{item.stage}</span>
                      </div>
                      
                      {/* 详细描述 */}
                      <div className="text-sm font-mono leading-relaxed">
                        <div className={`font-semibold mb-1 ${
                          item.status === "ACTIVE" ? 'text-white' : 
                          item.status === "NEXT" ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {item.desc}
                        </div>
                        <div className={`text-xs leading-relaxed ${
                          item.status === "ACTIVE" ? 'text-[#38b2ac]' : 
                          item.status === "NEXT" ? 'text-[#4fd1c7]' : 'text-gray-500'
                        }`}>
                          {item.detail}
                        </div>
                        
                        {/* 状态指示器 */}
                        <div className={`mt-2 text-xs font-mono ${
                          item.status === "ACTIVE" ? 'text-[#38b2ac]' : 
                          item.status === "NEXT" ? 'text-[#4fd1c7]' : 'text-gray-600'
                        }`}>
                          [{item.status} | {item.status_cn}]
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* 桌面端节点 */}
                  <div className="hidden sm:block absolute left-1/2 transform -translate-x-1/2">
                    <div className={`w-3 h-3 sm:w-4 sm:h-4 border-2 ${
                      item.status === "ACTIVE" 
                        ? 'bg-[#38b2ac] border-[#38b2ac]' 
                        : item.status === "NEXT" 
                          ? 'border-[#4fd1c7]' 
                          : 'border-gray-600'
                    } transform rotate-45 transition-all duration-300 group-hover:rotate-12`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* 底部像素装饰 */}
        <div className="text-center mt-8 sm:mt-12">
          <div className="inline-flex items-center space-x-2 text-xs text-gray-600 font-mono">
            <span>SYSTEM</span>
            <span className="text-[#38b2ac]">READY</span>
          </div>
        </div>
      </div>
    </section>
  );
}