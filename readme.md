# 易贴 - 智能字帖生成器

> 一款基于React和TypeScript开发的在线汉字字帖生成工具，帮助用户轻松创建个性化的书法练习字帖。

## 功能特点
- 支持多种汉字书法字体样式
- 可自定义字帖模板配置
- 丰富的边框样式选择
- 多种背景类型（如米字格、田字格、点阵等）
- 支持汉字笔画渲染和书写演示
- 导出和打印功能

## 技术栈
- **框架**：React + TypeScript
- **构建工具**：Umi.js
- **UI组件库**：Ant Design
- **汉字渲染引擎**：hanzi-writer
- **离线字库**：hanzi-writer-data

## 项目结构
```
├── src/
│   ├── components/         # 公共组件
│   ├── const/              # 常量定义
│   │   ├── core/           # 核心常量
│   │   ├── data/           # 数据常量
│   │   └── index.ts        # 常量导出
│   ├── context/            # React上下文
│   ├── interface/          # TypeScript类型定义
│   │   ├── core/           # 核心类型
│   │   └── index.ts        # 类型导出
│   ├── layouts/            # 布局组件
│   ├── models/             # Umi数据流模型
│   ├── pages/              # 页面组件
│   │   ├── content/        # 内容区域
│   │   ├── foot/           # 页脚
│   │   ├── form/           # 表单组件
│   │   ├── left/           # 左侧面板
│   │   └── index.tsx       # 主页
│   └── utils/              # 工具函数
│       ├── export/         # 导出相关工具
│       ├── gridTools/      # 网格生成工具
│       ├── lib/            # 基础工具库
│       └── render/         # 渲染相关工具
├── .umirc.ts               # Umi配置文件
├── package.json            # 项目依赖
└── tsconfig.json           # TypeScript配置
```

## 安装与运行

### 前置要求
- Node.js 14+ 
- Yarn 或 npm

### 安装依赖
```bash
# 使用yarn
npm run setup
# 或直接使用
npm install
# 或
cd /Users/chenpengwei/Documents/3_Code/Tools/HHT/EasyCopybook
npm install
```

### 开发模式运行
```bash
npm run dev
# 或
npm start
```

### 构建生产版本
```bash
npm run build
```

### 预览生产版本
```bash
npm run serve
```

## 开发规范
- **类型声明和默认值**按照功能类型和用途分类管理
- **默认值**统一放在 `const` 目录下维护
- **类型声明**统一放在 `interface` 目录下维护
- **通用方法**统一放在 `utils` 目录下，按功能模块分类
  - `lib`: 与业务无关的通用方法
  - `gridTools`: 字帖网格生成相关方法
  - `export`: 字帖导出相关方法
  - `render`: 汉字渲染相关方法

## 数据流管理
项目使用Umi.js的Model机制进行全局状态管理，主要数据模型位于`src/models/CONTENT.ts`，包括：
- 模板配置 (`templateConfig`)
- 字体样式配置 (`fontStyleConfig`)
- 边框样式配置 (`borderStyleConfig`)
- 背景类型 (`backgroundType`)
- 字库选择 (`fontLibraryItem`)

## 注意事项
1. 项目使用本地字库数据缓存来提高性能，可通过`clearStrokeDataCache()`函数清理缓存
2. 渲染大量汉字时可能会有性能影响，建议分批渲染
3. 如需自定义新的模板或样式，可在`const`目录下扩展相关配置

## License
MIT License
