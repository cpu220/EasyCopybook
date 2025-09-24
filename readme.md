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

### 目录规范
项目采用模块化结构设计，各目录职责明确，便于维护和扩展：

- **src/components/**: 存放可复用的公共组件
- **src/const/**: 统一管理项目中的所有常量定义
  - **core/**: 核心常量定义（如渲染配置、默认参数等）
  - **data/**: 业务数据常量（如字体库数据等）
  - **index.ts**: 常量统一导出入口
- **src/context/**: React Context API 上下文定义
- **src/interface/**: TypeScript类型定义
  - **core/**: 核心业务接口定义
  - **index.ts**: 类型统一导出入口
- **src/layouts/**: 布局组件和样式
- **src/models/**: Umi.js数据流模型（全局状态管理）
- **src/pages/**: 页面组件和业务逻辑
  - **content/**: 内容区域组件
  - **foot/**: 页脚组件
  - **form/**: 表单相关组件
  - **left/**: 左侧面板组件
- **src/utils/**: 工具函数库，按功能模块化
  - **export/**: 导出相关工具方法
  - **gridTools/**: 字帖网格生成相关工具
  - **lib/**: 与业务无关的通用工具方法
  - **render/**: 汉字渲染相关工具方法

### 命名规范
项目遵循以下命名约定，保持代码风格一致性：

#### 文件命名
- 组件文件：使用小驼峰命名，React组件文件后缀为 `.tsx`
- 工具文件：使用小驼峰命名，纯TypeScript文件后缀为 `.ts`
- 样式文件：使用小驼峰或短横线命名，后缀为 `.less`
- 目录入口：统一使用 `index.ts` 作为模块导出文件

#### 变量与常量命名
- 枚举类型：使用全大写字母，单词间用下划线分隔，如 `RENDER_TYPE`
- 配置项常量：使用大驼峰命名，如 `DefaultGridConfig`
- 普通常量：使用大驼峰或全大写命名，如 `DefaultCharsheetColors` 或 `BORDER_COLOR`
- 函数名：使用小驼峰命名，如 `createGridItem`
- 变量名：使用小驼峰命名，如 `cellClassName`

#### 类型与接口命名
- 接口：以 `I` 开头，使用大驼峰命名法，如 `IFontLibraryItem`
- 类型别名：使用大驼峰命名法，如 `FontStyleConfig`

#### 代码组织规范
- **类型声明**：统一放在 `interface` 目录下维护，按功能模块分类
- **默认值与常量**：统一放在 `const` 目录下维护
- **通用方法**：统一放在 `utils` 目录下，按功能模块分类
- **组件拆分**：复杂页面拆分为多个子组件，提高复用性和可维护性
- **样式管理**：使用CSS Modules (Less) 管理组件样式，避免样式冲突

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
