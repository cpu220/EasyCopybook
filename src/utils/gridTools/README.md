# GridTools 功能设计文档

## 目录结构

当前 `src/utils/gridTools` 目录下包含以下文件：

```
├── baseGridLayoutStrategy.ts    # 布局策略抽象基类
├── createGridDOM.tsx           # 网格DOM创建工具
├── createGridData.tsx          # 网格数据生成工具
├── fontItemUtils.ts            # 字体项工具函数
├── gridAlgorithmUtils.ts       # 网格算法工具函数
└── index.ts                    # 模块入口文件
```

## 文件保留建议

当前目录下的所有文件都是必要的：

- `baseGridLayoutStrategy.ts` - 核心抽象基类，封装布局策略通用逻辑
- `createGridDOM.tsx` - 负责渲染网格DOM
- `createGridData.tsx` - 生成网格数据，包含布局策略实现
- `fontItemUtils.ts` - 字体项工具函数
- `gridAlgorithmUtils.ts` - 通用算法逻辑库
- `index.ts` - 模块入口（可考虑更新导出内容）

*注意：fontItemFactory.ts 文件已被删除，因为它已被 fontItemUtils.ts 替代。*

## 功能设计说明

GridTools 模块主要负责生成和渲染字帖网格，核心功能包括：

### 1. 字体项创建 (`fontItemUtils.ts`)

提供了创建和管理 `IFontItem` 对象的工具函数：

- `createFontItem()` - 通用字体项创建函数，支持多种配置选项
- 派生函数：`createStandardFontItem()`, `createEmptyFontItem()`, `createStrokeOrderFontItem()`
- 批量创建函数：`createFontItemsBatch()`, `createStandardFontItems()`, `createEmptyFontItems()`, `createStrokeOrderFontItems()`

设计特点：
- 使用函数式编程风格，简化调用方式
- 支持对象参数传递，提高代码可读性和可维护性
- 提供批量创建方法，优化性能

### 2. 网格算法 (`gridAlgorithmUtils.ts`)

提供了各种网格计算算法：

- `calculateMaxStrokeCells()` - 计算最大可显示的笔画格子数
- `calculateRows()` - 计算需要的行数
- `calculateItemsPerRow()` - 计算每行的项目数
- `calculateSpaceDistribution()` - 计算空间分布

设计特点：
- 函数参数采用对象格式，增强代码可读性
- 抽象通用算法逻辑，避免重复代码
- 提供边界条件处理，增强健壮性

### 3. 布局策略 (`baseGridLayoutStrategy.ts` 和 `createGridData.tsx`)

采用策略模式实现不同的网格布局算法：

- **BaseGridLayoutStrategy** - 抽象基类，封装通用布局逻辑
  - 提供 `calculateMaxStrokeCells()`, `addStrokeOrderCells()`, `fillRow()` 等通用方法

- **具体策略实现** (`createGridData.tsx`):
  - `MultiRowsOneWordStrategy` - 几排展示1个字的策略
  - `FewWordsPerRowStrategy` - 每行显示少数几个字的策略
  - `FullRowWordsStrategy` - 整行显示多个字的策略
  - `GridLayoutStrategyFactory` - 工厂类，根据配置创建相应的布局策略

设计特点：
- 采用面向对象的策略模式，便于扩展新的布局算法
- 基类封装通用逻辑，减少代码重复
- 工厂模式简化策略选择和创建过程

### 4. DOM 渲染 (`createGridDOM.tsx`)

负责将生成的网格数据转换为实际的DOM元素：

- `createGridItem()` - 创建单个网格项
- 其他辅助函数用于构建完整的网格DOM结构

设计特点：
- 与数据生成逻辑分离，关注点分离
- 便于与React等前端框架集成

### 5. 模块入口 (`index.ts`)

当前只导出 `createGridDOM`，建议根据实际需求更新导出内容。

## 典型使用流程

1. 通过 `GridLayoutStrategyFactory` 根据配置创建合适的布局策略
2. 调用策略的 `createCharArray()` 方法生成字符二维数组
3. 使用 `createGridDOM` 相关函数将字符数组转换为DOM元素
4. 将生成的DOM元素渲染到页面上

## 代码优化建议

1. 更新 `index.ts` 文件，导出所有公共API，方便外部模块使用
2. 删除不再使用的 `fontItemFactory.ts` 文件
3. 考虑为所有函数添加更详细的TypeScript类型定义和文档注释
4. 可以考虑将 `createGridDOM.tsx` 重构为更现代化的函数组件风格

## 总结

GridTools 模块通过合理的代码组织和设计模式，实现了灵活、可扩展的字帖网格生成和渲染功能。采用了策略模式和工厂模式来处理不同的布局需求，使用工具函数集合来封装通用算法和创建字体项，整体设计清晰、易于维护。