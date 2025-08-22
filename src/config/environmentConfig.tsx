import React from 'react';

// 环境定义接口
export interface EnvironmentDefinition {
  name: string;
  keywords: string[];
  element: React.ReactNode;
}

// 互动动画定义接口
export interface InteractionAnimation {
  name: string;
  animation: React.ReactNode;
  duration: number;
}

// 环境配置数组 - 包含10种环境类型
export const environments: EnvironmentDefinition[] = [
  {
    name: '技术类',
    keywords: ['工程师', '程序员', '代码', '开发', '软件', '硬件', 'IT', '技术','科学家'],
    element: (
      <>
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-[#2d3748]"></div>
        {/* 电脑主机 */}
        <div className="absolute bottom-10 left-4 w-28 h-20 bg-[#1a202c] rounded-sm"></div>
        {/* 电脑屏幕 */}
        <div className="absolute bottom-12 left-6 w-24 h-16 bg-[#4a5568] rounded-sm flex items-center justify-center">
          <div className="w-20 h-12 border border-[#718096] rounded-sm bg-[#000] flex flex-col justify-center p-1 text-xs text-green-500 overflow-hidden">
            <div className="mb-1"> system boot</div>
            <div className="mb-1">loading modules...</div>
            <div className="mb-1"> starting server</div>
            <div className="text-green-400">server running on port 3000</div>
          </div>
        </div>
        {/* 键盘 */}
        <div className="absolute bottom-10 right-4 w-20 h-6 bg-[#1a202c] rounded-sm grid grid-cols-5 gap-1 p-1">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="w-full h-1 bg-[#4a5568] rounded-sm"></div>
          ))}
        </div>
      </>
    )
  },
  {
    name: '创意类',
    keywords: ['设计师', '画', '艺术', '创意', '设计', '美术', '插画', '摄影'],
    element: (
      <>
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-[#2d3748]"></div>
        <div className="absolute bottom-10 left-2 w-20 h-16 bg-[#4a5568] rounded-sm"></div>
        <div className="absolute bottom-12 right-8 w-6 h-8 bg-[#718096] rotate-12"></div>
      </>
    )
  },
  {
    name: '运动类',
    keywords: ['教练', '运动', '健身', '体育', '运动员', '瑜伽', '跑步'],
    element: (
      <>
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-[#2d3748]"></div>
        {/* 绿色草坪 */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-[#2f4f4f]"></div>
        {/* 足球 */}
        <div className="absolute bottom-20 left-4 w-8 h-8 bg-[#718096] rounded-full border-2 border-black"></div>
        {/* 足球球门 */}
        <div className="absolute bottom-20 left-20 w-32 h-16 border-2 border-white"></div>
      </>
    )
  },
  {
    name: '商业类',
    keywords: ['经理', '商业', '金融', '销售', '市场', '创业', '投资','总统','老板','企业家','总裁'],
    element: (
      <>
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-[#2d3748]"></div>
        {/* 办公桌 */}
        <div className="absolute bottom-10 left-4 w-24 h-8 bg-[#1a202c] rounded-sm"></div>
        {/* 摩天大楼群 */}
        <div className="absolute bottom-10 right-20 w-6 h-32 bg-[#4a5568]"></div>
        <div className="absolute bottom-14 right-22 w-4 h-28 bg-[#1a202c]"></div>
        {[...Array(6)].map((_, i) => (
          <div key={`win1-${i}`} className="absolute bottom-16 right-23 w-2 h-3 bg-[#718096]" style={{ bottom: `${16 + i*5}px` }}></div>
        ))}

        <div className="absolute bottom-10 right-10 w-8 h-40 bg-[#4a5568]"></div>
        <div className="absolute bottom-14 right-12 w-6 h-36 bg-[#1a202c]"></div>
        {[...Array(8)].map((_, i) => (
          <div key={`win2-${i}`} className="absolute bottom-16 right-13 w-4 h-3 bg-[#718096]" style={{ bottom: `${16 + i*5}px` }}></div>
        ))}

        <div className="absolute bottom-10 right-30 w-5 h-28 bg-[#4a5568]"></div>
        <div className="absolute bottom-14 right-32 w-3 h-24 bg-[#1a202c]"></div>
        {[...Array(5)].map((_, i) => (
          <div key={`win3-${i}`} className="absolute bottom-16 right-33 w-1 h-3 bg-[#718096]" style={{ bottom: `${16 + i*5}px` }}></div>
        ))}
      </>
    )
  },
  {
    name: '教育类',
    keywords: ['教师', '教授', '教育', '学习', '学生', '学术', '研究','幼师'],
    element: (
      <>
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-[#2d3748]"></div>
        {/* 黑板 */}
        <div className="absolute bottom-10 left-4 w-36 h-24 bg-[#1a202c] rounded-sm border-2 border-[#4a5568]"></div>
        {/* 黑板上的粉笔字 */}
        <div className="absolute bottom-20 left-8 text-xs text-white opacity-70"/>
        {/* 钟表 */}
        <div className="absolute bottom-36 right-10 w-8 h-8 bg-white rounded-full border-2 border-[#2d3748] flex items-center justify-center">
          <div className="w-0.5 h-2 bg-[#2d3748] absolute transform -translate-y-1 origin-bottom"></div>
          <div className="w-0.5 h-3 bg-[#e53e3e] absolute transform -translate-y-1.5 origin-bottom"></div>
          <div className="w-1 h-1 bg-[#2d3748] rounded-full"></div>
        </div>
        {/* 讲台和讲桌 */}
        <div className="absolute bottom-10 left-10 w-12 h-6 bg-[#dd6b20]"></div>
        <div className="absolute bottom-16 left-8 w-16 h-4 bg-[#dd6b20]"></div>
      </>
    )
  },
  {
    name: '医疗类',
    keywords: ['医生', '护士', '医疗', '健康', '医院', '医学', '药品'],
    element: (
      <>
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-[#2d3748]"></div>
        {/* 医院建筑 */}
        <div className="absolute bottom-10 right-8 w-24 h-24 bg-white rounded-sm border-2 border-[#4a5568]"></div>
        {/* 医院窗户 */}
        <div className="absolute bottom-14 right-10 w-4 h-4 bg-[#3182ce] rounded-sm"></div>
        <div className="absolute bottom-14 right-16 w-4 h-4 bg-[#3182ce] rounded-sm"></div>
        <div className="absolute bottom-20 right-10 w-4 h-4 bg-[#3182ce] rounded-sm"></div>
        <div className="absolute bottom-20 right-16 w-4 h-4 bg-[#3182ce] rounded-sm"></div>
        {/* 医院门 */}
        <div className="absolute bottom-10 right-14 w-8 h-10 bg-[#718096] rounded-sm"></div>
        {/* 红十字标志 - 放置在医院建筑上 */}
        <div className="absolute bottom-36 right-14 w-8 h-8 bg-white flex items-center justify-center rounded-full">
          <div className="w-6 h-1 bg-[#e53e3e]"></div>
          <div className="w-1 h-6 bg-[#e53e3e] absolute"></div>
        </div>
        {/* 医疗设备 */}
        <div className="absolute bottom-10 left-4 w-18 h-8 bg-[#4a5568] rounded-sm flex items-center justify-center">
          <div className="w-14 h-4 bg-[#1a202c] rounded-sm"></div>
        </div>
      </>
    )
  },
  {
    name: '音乐类',
    keywords: ['音乐家', '歌手', '音乐', '乐器', '作曲', '演奏', '录音'],
    element: (
      <>
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-[#2d3748]"></div>
        {/* 舞台背景 */}
        <div className="absolute bottom-10 left-0 right-0 h-32 bg-gradient-to-t from-[#4a5568] to-[#1a202c]"></div>
        {/* 钢琴 */}
        <div className="absolute bottom-10 left-4 w-28 h-12 bg-[#4a5568] rounded-sm"></div>
        <div className="absolute bottom-12 left-6 w-24 h-8 bg-[#1a202c] rounded-sm"></div>
        {[...Array(8)].map((_, i) => (
          <div key={`piano-${i}`} className="absolute bottom-12 left-7 w-2 h-8 bg-white" style={{ left: `${7 + i*3}px` }}></div>
        ))}
        {/* 吉他 */}
        <div className="absolute bottom-10 left-36 w-6 h-16 bg-[#dd6b20] rounded-sm"></div>
        <div className="absolute bottom-12 left-34 w-2 h-20 border-l-2 border-white"></div>
        {/* 架子鼓组 */}
        <div className="absolute bottom-10 right-10 w-10 h-8 bg-[#1a202c] rounded-full"></div>
        <div className="absolute bottom-18 right-10 w-6 h-6 bg-[#1a202c] rounded-full"></div>
        <div className="absolute bottom-14 right-6 w-6 h-6 bg-[#1a202c] rounded-full"></div>
        <div className="absolute bottom-14 right-14 w-6 h-6 bg-[#1a202c] rounded-full"></div>
        <div className="absolute bottom-10 right-22 w-2 h-6 bg-[#718096]"></div>
        {/* 麦克风 */}
        <div className="absolute bottom-24 right-26 w-2 h-8 bg-[#718096]"></div>
        <div className="absolute bottom-26 right-25 w-4 h-4 bg-[#718096] rounded-full"></div>
        {/* 乐队成员 */}
        <div className="absolute bottom-28 left-12 w-4 h-8 bg-[#718096] rounded-t-full"></div>
        <div className="absolute bottom-28 right-30 w-4 h-8 bg-[#718096] rounded-t-full"></div>
      </>
    )
  },
  {
    name: '写作类',
    keywords: ['作家', '记者', '写作', '编辑', '文章', '小说', '出版'],
    element: (
      <>
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-[#2d3748]"></div>
        <div className="absolute bottom-10 left-4 w-22 h-8 bg-[#1a202c] rounded-sm"></div>
        <div className="absolute bottom-14 right-10 w-5 h-7 bg-[#718096] rounded-sm"></div>
      </>
    )
  },
  {
    name: '烹饪类',
    keywords: ['厨师', '烹饪', '美食', '餐厅', '料理', '烘焙', '食材'],
    element: (
      <>
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-[#2d3748]"></div>
        {/* 灶台 */}
        <div className="absolute bottom-10 left-4 w-32 h-8 bg-[#4a5568] rounded-sm"></div>
        <div className="absolute bottom-12 left-6 w-28 h-4 bg-[#2d3748] rounded-sm"></div>
        {/* 水龙头和水槽 */}
        <div className="absolute bottom-18 left-30 w-4 h-6 bg-[#3182ce]"></div>
        <div className="absolute bottom-24 left-28 w-8 h-2 bg-[#3182ce]"></div>
        <div className="absolute bottom-18 left-28 w-8 h-4 bg-[#1a202c] rounded-sm"></div>
        {/* 炒勺和火焰效果 */}
        <div className="absolute bottom-10 right-10 w-8 h-6 bg-[#dd6b20] rounded-sm"></div>
        <div className="absolute bottom-16 right-16 w-4 h-4 border-2 border-[#dd6b20] rounded-full"></div>
        <div className="absolute bottom-14 right-12 w-6 h-2 bg-[#dd6b20]"></div>
        {/* 火焰动画效果 */}
        <div className="absolute bottom-10 right-10 w-8 h-8 flex flex-col items-center justify-end">
          <div className="w-4 h-2 bg-yellow-400 rounded-full mb-0.5"></div>
          <div className="w-6 h-3 bg-orange-500 rounded-full mb-0.5"></div>
          <div className="w-8 h-4 bg-red-500 rounded-full"></div>
        </div>
      </>
    )
  },
  {
    name: '默认环境',
    keywords: [],
    element: (
      <>
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-[#2d3748]"></div>
        {/* 公园背景 */}
        <div className="absolute bottom-10 left-0 right-0 h-32 bg-gradient-to-t from-[#4a5568] to-blue-400"></div>
        {/* 草地 */}
        <div className="absolute bottom-10 left-0 right-0 h-16 bg-green-600"></div>
        {/* 河流 */}
        <div className="absolute bottom-20 left-4 w-full h-8 bg-blue-400 rounded-sm opacity-70"></div>
        {/* 树木 */}
        <div className="absolute bottom-10 left-10 w-8 h-16 bg-green-800 rounded-t-full"></div>
        <div className="absolute bottom-18 left-10 w-2 h-4 bg-green-600"></div>
        <div className="absolute bottom-10 left-20 w-6 h-12 bg-green-800 rounded-t-full"></div>
        <div className="absolute bottom-16 left-20 w-2 h-3 bg-green-600"></div>
        <div className="absolute bottom-10 right-10 w-10 h-20 bg-green-800 rounded-t-full"></div>
        <div className="absolute bottom-20 right-10 w-2 h-5 bg-green-600"></div>
        {/* 花朵 */}
        {[...Array(5)].map((_, i) => (
          <div key={`flower-${i}`} className="absolute bottom-12 left-30 w-3 h-3 bg-red-500 rounded-full" style={{ left: `${30 + i*6}px` }}></div>
        ))}
      </>
    )
  }
];

// 互动按钮动画配置
export const interactionAnimations: Record<string, InteractionAnimation> = {
  // 投喂TA动画
  feed: {
    name: '投喂TA',
    animation: (
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="animate-feed-food">
          <span className="text-2xl animate-bounce">🍖</span>
        </div>
      </div>
    ),
    duration: 1500
  },
  
  // 安慰一下动画
  comfort: {
    name: '安慰一下',
    animation: (
      <div className="absolute inset-0 pointer-events-none">
        <div className="animate-comfort-heart">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i} 
              className="absolute text-xl opacity-70"
              style={{
                top: `${30 + Math.random() * 40}%`,
                left: `${40 + Math.random() * 20}%`,
                animationDelay: `${i * 100}ms`
              }}
            >
              ❤️
            </div>
          ))}
        </div>
      </div>
    ),
    duration: 2000
  },
  
  // 拉去加班动画
  overtime: {
    name: '拉去加班',
    animation: (
      <div className="absolute inset-0 pointer-events-none">
        {/* 公文包动画 */}
        <div className="animate-briefcase absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <span className="text-2xl">💼</span>
        </div>
        {/* 工作文档动画 */}
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2">
          {[...Array(4)].map((_, i) => (
            <div 
              key={i} 
              className="w-12 h-8 bg-white/90 border-2 border-gray-400 absolute shadow-md animate-work-document"
              style={{
                top: `${-20 - i * 15}px`,
                transform: `rotate(${-10 + i * 5}deg)`,
                animationDelay: `${i * 200}ms`
              }}
            >
              {/* 文档内容线 */}
              <div className="w-10 h-0.5 bg-gray-300 mx-auto mt-1.5"></div>
              <div className="w-10 h-0.5 bg-gray-300 mx-auto mt-1.5"></div>
              <div className="w-10 h-0.5 bg-gray-300 mx-auto mt-1.5"></div>
            </div>
          ))}
        </div>
      </div>
    ),
    duration: 2000
  },
  
  // 水桶倒水效果
  water: {
    name: '泼冷水',
    animation: (
      <div className="absolute inset-0 pointer-events-none">
        {/* 水桶和水流组合容器 */}
        <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2">
          {/* 水桶 - 预倾斜角度使口朝下 */}
          <div className="animate-bucket transform -rotate-45 origin-center">
            <span className="text-3xl">🪣</span>
          </div>
          {/* 水流效果 - 使用弯曲的水流形状 */}
          <div className="absolute top-14 left-2 animate-water-stream">
            <svg width="10" height="80" viewBox="0 0 10 80" className="overflow-visible">
              <path 
                d="M5,0 C5,10 2,20 5,30 C8,40 3,50 5,60 C7,70 5,80 5,80" 
                fill="none" 
                stroke="#60A5FA" 
                strokeWidth="4" 
                strokeLinecap="round" 
              />
            </svg>
          </div>
          {/* 水滴效果 */}
          <div className="absolute top-94 left-0 animate-water-drops">
            {[...Array(10)].map((_, i) => (
              <div 
                key={i} 
                className="w-2 h-3 bg-blue-400 rounded-b-md absolute opacity-80"
                style={{
                  left: `${4 + Math.random() * 12}px`,
                  animationDelay: `${i * 100 + 300}ms`
                }}
              ></div>
            ))}
          </div>
        </div>
        {/* 水花溅起效果 */}
        <div className="absolute bottom-1/3 left-1/4 transform -translate-x-1/2 animate-splash-effect">
          {[...Array(12)].map((_, i) => (
            <div 
              key={i} 
              className="w-2 h-2 bg-blue-300 rounded-full absolute opacity-90"
              style={{
                left: `${Math.random() * 30}px`,
                top: `${-Math.random() * 20}px`,
                animationDelay: `${i * 50 + 800}ms`
              }}
            ></div>
          ))}
        </div>
      </div>
    ),
    duration: 2200
  }
};