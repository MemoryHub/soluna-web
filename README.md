# Soluna Web - 角色观察站

一个基于Next.js、React和Tailwind CSS的AI角色观察器，让用户能够实时监控AI角色的生活轨迹，感受活灵活现的数字生命。

## 🌟 项目特色

- 🎭 **活灵活现的角色**: 基于大模型自动生成角色，每个角色都有独特的性格、背景和动机
- 📊 **实时监控**: 实时显示角色的当前状态、情绪和行为
- 🎨 **像素风格UI**: 采用监控站风格的界面设计，增强沉浸感
- 📱 **响应式设计**: 完美适配桌面端和移动端
- ⚡ **动态更新**: 角色状态每10秒自动更新，模拟真实生活节奏

## 🏗️ 技术栈

- **前端框架**: Next.js 15.4.6 + React 19.1.0
- **样式**: Tailwind CSS 4.1
- **语言**: TypeScript
- **图标**: Font Awesome 4.7.0
- **后端API**: FastAPI (Python)

## 📁 项目结构

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

## ✨ 核心功能

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

### 5. 互动系统
- **四种互动类型**:
  - 🍔 **投喂**: 给角色提供食物
  - 💝 **安慰**: 安抚角色的情绪
  - ⚡ **加班**: 让角色工作加班
  - 💧 **浇水**: 给角色补充水分
- **互动统计**: 记录用户与每个角色的互动次数
- **每日限制**: 每个角色每天只能互动一次

### 6. 筛选与搜索
- **字母筛选**: 按角色姓名首字母筛选
- **分页浏览**: 支持大量角色的分页展示
- **搜索功能**: 即将支持角色名称和特征搜索

## 🎭 角色数据模型

每个角色包含以下核心属性：

```typescript
interface Character {
  name: string;                    // 角色姓名
  age: number;                     // 年龄
  gender: 'male' | 'female' | 'neutral'; // 性别
  occupation: string;              // 职业
  background: string;              // 背景故事
  mbti_type: string;               // MBTI人格类型
  personality: string[];           // 性格特征
  big5: Record<string, number>;    // BIG5人格特质
  hobbies: string[];               // 爱好
  mood: string;                    // 当前心情
  habits: string[];                // 习惯
  relationships: Record<string, string>; // 人际关系
  event_profile?: EventProfile;    // 事件配置
  character_id: string;            // 唯一标识符
  created_at?: number;             // 创建时间戳
  updated_at?: number;             // 更新时间戳
}
```

## 🚀 安装和运行

### 安装依赖
```bash
npm install
```

### 开发模式运行
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 启动生产服务器
```bash
npm start
```

## 🔧 环境变量

创建 `.env.local` 文件：

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 📊 API接口

### 角色管理
- `POST /api/characters/list` - 获取角色列表
- `POST /api/characters/{id}` - 获取角色详情
- `POST /api/characters/generate` - 生成新角色
- `POST /api/characters/delete/{id}` - 删除角色

### 事件系统
- `POST /api/event-profiles/get-by-character-ids` - 批量获取角色事件配置

### 互动系统
- `POST /api/interaction/perform` - 执行角色互动
- `POST /api/interaction/stats/{character_id}` - 获取互动统计
- `POST /api/interaction/stats/batch` - 批量获取互动统计

## 🎨 界面特色

### 像素风格设计
- 复古像素风格的UI界面
- 科技感十足的监控站布局
- 动态背景和环境元素
- 流畅的CSS动画效果

### 响应式设计
- 完美适配桌面端（1920x1080）
- 移动端优化（375x667及以上）
- 平板端适配（768x1024及以上）

### 交互体验
- 悬停效果和过渡动画
- 加载状态和进度指示
- 错误处理和用户反馈
- 键盘快捷键支持

## 🔮 未来规划

### 短期功能 (1-2个月)
- [ ] 角色搜索功能
- [ ] 角色关系可视化网络图
- [ ] 批量角色操作
- [ ] 用户偏好设置面板
- [ ] 移动端手势操作优化

### 中期功能 (2-4个月)
- [ ] 角色技能成长系统
- [ ] 多角色互动事件
- [ ] 用户自定义事件模板
- [ ] 角色成就系统
- [ ] 数据导出功能（JSON/CSV）

### 长期功能 (4-6个月)
- [ ] 角色语音对话功能
- [ ] 3D角色形象展示
- [ ] 虚拟现实观察模式
- [ ] 社交网络分享功能
- [ ] 跨平台移动应用

## 🎯 使用场景

### 个人娱乐
- 观察AI角色的日常生活
- 与虚拟角色建立情感连接
- 体验数字生命的成长过程

### 创作灵感
- 为作家提供角色设定灵感
- 为游戏开发者提供NPC原型
- 为内容创作者提供故事素材

### 技术研究
- 学习AI角色生成技术
- 研究大语言模型应用场景
- 探索人机交互新模式

## 🤝 贡献指南

我们欢迎所有形式的贡献！

### 如何贡献
1. Fork 本项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

### 开发规范
- 使用TypeScript进行类型安全开发
- 遵循ESLint代码规范
- 添加适当的组件测试
- 保持提交信息清晰明了

## 📄 许可证

MIT License

## 💬 联系方式

- 项目主页: https://github.com/yourusername/soluna-web
- 问题反馈: https://github.com/yourusername/soluna-web/issues
