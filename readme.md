# 易贴

> 这是一个字帖生成器


## 技术栈
- React
- TypeScript
- Styled Components
- 汉字渲染引擎：hanzi-writer，离线字库：hanzi-writer-data


## 规范
- 所有类型声明和默认值，均按照功能类型，以及用途分类，
- 所有默认值，均放在 const 下维护
- 类型声明，均放在 interface 下维护

## 通用方法
所有通用方法均放在 utils 下维护
- lib
  - 和业务无关的通用方法
- gridTools
  - 和字帖网格生成的方法相关的通用方法，根据string和模板规则，创建对应网格（样式命名规范在文件内）
- export
  - 和字帖导出相关的通用方法
  - 文件生成
- render
  - 汉字渲染引擎，存放和渲染汉字的所有相关方法
