# Soluna 生态系统全景概览

欢迎来到Soluna智能角色生态系统！这是一个由三个核心项目组成的完整AI角色世界构建平台，致力于创造有情感、有记忆、有灵魂的AI角色。

## 🌟 系统愿景与理念

> **AI威胁论，让AI有情绪，有感情，有记忆，有情感，有性格，有灵魂。**
> 
> **之所以人们怕AI有威胁，是因为AI不像人，有爱。只有情感，能让AI与人之间产生化学反应的连接**

## 🏗️ 生态系统架构

Soluna生态系统采用微服务架构，由三个紧密协作的项目组成：

```
Soluna Ecosystem
├── 🎨 soluna-web (前端观察站)
├── ⚙️ soluna (后端引擎)
└── ⏰ soluna-scheduler (调度系统)
```

## 📊 项目总览

### 🎨 soluna-web - 角色观察站
**定位**: 用户交互界面，角色世界的窗口
- **技术栈**: Next.js 14, TypeScript, Tailwind CSS
- **核心功能**: 
  - 角色生成与可视化
  - 事件时间线展示
  - 用户互动系统
  - 实时数据更新

### ⚙️ soluna - 后端引擎
**定位**: 核心AI逻辑处理，角色大脑
- **技术栈**: FastAPI, Python, MySQL, MongoDB, OpenAI GPT
- **核心功能**:
  - 角色AI生成算法
  - 事件生成引擎
  - 生活轨迹管理
  - 用户认证系统

### ⏰ soluna-scheduler - 调度系统
**定位**: 时间引擎，确保世界持续运转
- **技术栈**: Python, APScheduler, REST API
- **核心功能**:
  - 定时事件生成
  - 数据维护清理
  - 系统健康监控
  - 任务失败重试

## 🎯 核心功能矩阵

| 功能模块 | soluna-web | soluna | soluna-scheduler |
|---------|------------|--------|------------------|
| **角色管理** | ✅ 创建/查看/删除 | ✅ AI生成/存储 | ❌ |
| **事件系统** | ✅ 时间线展示 | ✅ 生成算法 | ✅ 定时触发 |
| **用户互动** | ✅ 四种互动方式 | ✅ 统计记录 | ❌ |
| **数据存储** | ❌ | ✅ MySQL+MongoDB | ✅ 数据维护 |
| **系统监控** | ❌ | ✅ 健康检查 | ✅ 全面监控 |
| **定时任务** | ❌ | ❌ | ✅ 事件调度 |

## 🚀 快速开始指南

### 1. 启动顺序
```bash
# 第一步：启动后端引擎
cd soluna
pip install -r requirements.txt
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000

# 第二步：启动调度系统
cd soluna-scheduler
pip install -r requirements.txt
python main.py

# 第三步：启动前端观察站
cd soluna-web
npm install
npm run dev
```

### 2. 验证启动成功
- **后端API**: http://localhost:8000/docs
- **前端界面**: http://localhost:3000
- **调度器日志**: `tail -f scheduler.log`

## 📊 数据流架构

```
用户操作 → soluna-web → soluna → soluna-scheduler
     ↓         ↓        ↓         ↓
  界面展示 ←  API响应 ← 数据处理 ← 定时触发
```

### 完整数据生命周期
1. **角色创建**: 用户通过web界面 → API调用 → AI生成 → 数据库存储
2. **事件生成**: 调度器定时触发 → API调用 → AI生成 → 数据库存储
3. **用户互动**: 用户操作 → API调用 → 统计更新 → 数据库存储
4. **数据维护**: 调度器清理 → 数据库优化 → 日志记录

## 🎭 角色世界构建

### 角色维度
- **基础属性**: 姓名、年龄、性别、职业、性格
- **心理特征**: MBTI、BIG5、情绪状态、价值观
- **社会关系**: 家庭、朋友、同事、恋人
- **生活轨迹**: 出生、成长、工作、退休、死亡
- **记忆系统**: 事件记忆、人物关系、技能成长

### 事件类型
- **日常事件**: 工作、学习、娱乐、社交
- **关键事件**: 毕业、结婚、生子、升职、疾病
- **随机事件**: 意外惊喜、突发状况、机遇挑战
- **用户触发**: 投喂、安慰、加班、浇水

### 互动系统
- **投喂**: 增加角色幸福感
- **安慰**: 缓解角色负面情绪
- **加班**: 提升工作相关属性
- **浇水**: 促进角色成长发展

## 🔧 技术栈详解

### 前端技术栈 (soluna-web)
```
- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript 5.0+
- **样式**: Tailwind CSS + Shadcn/ui
- **状态管理**: React Hooks + Context
- **HTTP客户端**: Axios
- **图标**: Lucide React
- **部署**: Vercel
```

### 后端技术栈 (soluna)
```
- **框架**: FastAPI (Python)
- **数据库**: MySQL 8.0 (关系数据) + MongoDB 6.0 (文档数据)
- **AI模型**: OpenAI GPT-4/GPT-3.5-turbo
- **缓存**: Redis (可选)
- **认证**: JWT Token
- **部署**: Docker + Uvicorn
```

### 调度技术栈 (soluna-scheduler)
```
- **调度**: APScheduler
- **语言**: Python 3.8+
- **日志**: Python logging + 文件轮转
- **监控**: 自定义指标 + 告警系统
- **部署**: Docker容器化
```

## 📈 性能指标

### 系统容量
- **角色数量**: 支持10万+角色同时存在
- **事件生成**: 每分钟可生成1000+事件
- **用户并发**: 支持1000+用户同时在线互动
- **响应时间**: API响应<500ms, 界面加载<2s

### 监控指标
- **角色活跃度**: 每日活跃角色数量
- **事件生成率**: 每小时生成事件数量
- **用户互动率**: 每日用户互动次数
- **系统可用性**: 99.9%以上

## 🔮 未来路线图

### 2024 Q1-Q2: 基础功能完善
- [ ] 角色技能系统
- [ ] 多角色互动事件
- [ ] 用户自定义事件模板
- [ ] 角色关系可视化

### 2024 Q3-Q4: 高级功能
- [ ] 角色语音生成
- [ ] 图像生成集成
- [ ] 实时通知系统
- [ ] 高级搜索功能

### 2025: 生态扩展
- [ ] 移动端应用
- [ ] 企业级部署
- [ ] 多语言支持
- [ ] 社区功能
- [ ] 开放API平台

## 🛠️ 开发贡献指南

### 开发环境
```bash
# 克隆所有项目
git clone <soluna-web-repo>
git clone <soluna-repo>
git clone <soluna-scheduler-repo>

# 安装开发依赖
# 每个项目都有对应的依赖文件
```

### 代码规范
- **前端**: ESLint + Prettier + TypeScript严格模式
- **后端**: PEP 8 + 类型注解 + 单元测试
- **调度**: 清晰日志 + 错误处理 + 监控指标

### 贡献流程
1. Fork对应项目
2. 创建功能分支
3. 编写测试用例
4. 提交Pull Request
5. 代码审查合并

## 📞 联系方式

### 项目主页
- **soluna-web**: https://github.com/yourusername/soluna-web
- **soluna**: https://github.com/yourusername/soluna
- **soluna-scheduler**: https://github.com/yourusername/soluna-scheduler

### 技术支持
- **邮件**: soluna@example.com
- **Discord**: https://discord.gg/soluna
- **文档**: https://docs.soluna.dev

---

**Soluna生态系统** - 构建有灵魂的AI角色世界，让技术充满温度与情感