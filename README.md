# 角色观察站 (Character Observation Station)

一个基于Next.js、React和Tailwind CSS的AI角色观察器，让用户能够实时监控AI角色的生活轨迹，感受活灵活现的数字生命。

## 项目特色

- 🎭 **活灵活现的角色**: 基于大模型自动生成角色，每个角色都有独特的性格、背景和动机
- 📊 **实时监控**: 实时显示角色的当前状态、情绪和行为
- 🎨 **像素风格UI**: 采用监控站风格的界面设计，增强沉浸感
- 📱 **响应式设计**: 完美适配桌面端和移动端
- ⚡ **动态更新**: 角色状态每10秒自动更新，模拟真实生活节奏

## 技术栈

- **前端框架**: Next.js 15.4.6 + React 19.1.0
- **样式**: Tailwind CSS 4.1
- **语言**: TypeScript
- **图标**: Font Awesome 4.7.0
- **后端API**: FastAPI (Python)

## 项目结构

```
src/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # 主页
│   ├── observation-station/      # 观察站页面
│   │   └── page.tsx             # 观察站主页面
│   ├── layout.tsx               # 根布局
│   └── globals.css              # 全局样式
├── components/                   # React组件
│   └── observation-station/     # 观察站相关组件
│       ├── Header.tsx           # 头部组件
│       ├── ControlPanel.tsx     # 控制面板
│       ├── CharacterWindow.tsx  # 角色观察窗口
│       ├── EventTicker.tsx      # 事件滚动条
│       └── CharacterModal.tsx   # 角色详情模态框
├── types/                       # TypeScript类型定义
│   └── character.ts             # 角色相关类型
├── services/                    # API服务
│   └── api.ts                   # API调用服务
└── styles/                      # 样式文件
    └── globals.css              # 全局样式和动画
```

## 核心功能

### 1. 角色观察窗口
- 显示角色的基本信息（姓名、年龄、职业）
- 实时情绪状态指示器
- 当前行为动画
- 像素风格的角色形象

### 2. 控制面板
- 角色数量统计
- 时间流速控制（暂停、1x、2x、10x）
- 添加新角色功能

### 3. 角色详情模态框
- 完整的角色信息展示
- 情绪状态条
- 今日行为时间线
- 人际关系网络

### 4. 事件滚动条
- 实时显示角色行为事件
- 自动滚动动画
- 基于角色性格的行为描述

## 角色数据模型

每个角色包含以下核心属性：

```typescript
interface Character {
  name: string;                    // 角色姓名
  age: number;                     // 年龄
  gender: 'male' | 'female' | 'neutral'; // 性别
  occupation: string;              // 职业
  mbti_type: string;               // MBTI人格类型
  personality: string[];           // 性格特征
  hobbies: string[];               // 爱好
  mood: string;                    // 当前心情
  habits: string[];                // 习惯
  relationships: Record<string, string>; // 人际关系
  event_profile?: EventProfile;    // 事件配置
  // ... 更多属性
}
```

## 安装和运行

### 前端 (Next.js)

```bash
# 安装依赖
npm install

# 开发模式运行
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

### 后端 (FastAPI)

```bash
# 进入后端目录
cd ../soluna

# 安装Python依赖
pip install -r requirements.txt

# 启动后端服务
uvicorn src.main:app --reload --port 8000
```

## 环境变量

创建 `.env.local` 文件：

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## API接口

### 角色管理
- `POST /api/characters/list` - 获取角色列表
- `POST /api/characters/{id}` - 获取角色详情
- `POST /api/characters/generate` - 生成新角色
- `POST /api/characters/delete/{id}` - 删除角色

## 自定义和扩展

### 添加新的角色类型
1. 在 `src/app/observation-station/page.tsx` 中的 `getRandomAction` 函数添加新的职业类型
2. 在 `CharacterWindow.tsx` 中添加对应的环境元素渲染逻辑

### 修改动画效果
1. 在 `src/styles/globals.css` 中修改或添加CSS动画
2. 在 `tailwind.config.ts` 中添加自定义样式类

### 扩展角色属性
1. 在 `src/types/character.ts` 中扩展类型定义
2. 更新相关的组件以显示新属性

## 贡献

欢迎提交Issue和Pull Request来改进这个项目！

## 许可证

MIT License
