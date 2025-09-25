
// 规范： 
// 1. 枚举都是大写
// 2. 配置项都首字母大写，default开头

import {
    IDefaultTemplateConfig,
    IDefaultBorderStyleConfig,
    IBaseFontRenderConfig,
    IDefaultStrokeFontRenderConfig,
    IDEFAULT_CONFIG
} from '@/interface';

import {
    RENDER_TYPE,
    BACKGROUND_TYPE,
    TEMPLATE_LAYOUT_TYPE
} from './render.enum';

const scale = 1
/**
 * 网格基础配置
 * 与字帖渲染直接相关的基础尺寸配置
 * 注意：这里的值需要与 base.less 中的网格配置保持一致
 */
const DefaultGridConfig = {
    width: 60 * scale,   // 与 @grid-base-width 对应
    height: 60 * scale, // 与 @grid-base-height 对应
    fontSize: 60 * scale, // 与 @grid-base-font-size 对应
    defaultCol: 10, // 与 @grid-default-col 对应
    scale: scale, // 与 @charsheet-font-scale 对应 - 控制整体字体大小缩放
    
};

/**
 * 间距配置
 * 仅保留与字帖渲染相关的间距配置
 */
const DefaultSpacingConfig = {
    // 通用内边距 - 被hanziWriter.render.tsx使用
    gridRowPadding: 10,     // 网格行内边距
    formPadding: 16,        // 表单内边距 - 被form和foot组件使用
};

/**
 * 组件特定尺寸配置
 * 仅保留与字帖渲染相关的组件尺寸配置
 */
const DefaultComponentSizes = {
    // 表单组件 - 被form组件使用
    inputNumberMin: 1,      // 数字输入最小值
};

/**
 * 练字贴布局配置
 * 用于练字贴（n排一个字）布局的特定配置
 */
const DefaultPracticeConfig = {
    defaultRowsPerChar: 4,  // 默认每个字占据的行数
    strokeDisplayRows: 3,   // 用于显示笔画的行数（除去第一行显示汉字）
};

// 颜色配置保留但不导出到RENDER_SIZES中
const DefaultCharsheetColors = {
    BORDER_COLOR: '#ddd',
    GRID_COLOR: '#ddd',
    SHADOW_COLOR: '#dfdfdf', // 阴影颜色
} as const;



/**
 * 模版信息
 * 定位是网格布局信息
 */
const DefaultTemplateConfig: IDefaultTemplateConfig = {
    column: DefaultGridConfig.defaultCol,
    wordsPerRow: 1, // 每个字占几行
    wordsPreCol: 1, // 一行几个字  目前只有 2 和 column  其他的展示不对
    pinyin: true, // 是否展示拼音

    showStrokeOrderShadow: true, // 是否展示笔画（米字格内展示的笔画）
    strokeNumber: 3, // 展示几笔 (当 showStrokeShadow 为true时有效)

    showStrokeOrder: true, // 是否展示笔画顺序(顶部tips区域展示的笔画顺序，如果为true，则展示全部笔画)

    templateLayoutType: TEMPLATE_LAYOUT_TYPE.NORMAL, // 模板类型 是什么字帖
}

// 1. 先选择什么类型字帖
// 2. 再选择布局
// 3. 选择渲染引擎


/**
 * 基础渲染选项
 */
const BaseFontRenderConfig: IBaseFontRenderConfig = {
    width: DefaultGridConfig.width, // 设置合适的宽度
    height: DefaultGridConfig.height, // 设置合适的高度
    fontSize: DefaultGridConfig.fontSize, // 统一字体大小，默认等于宽度
    strokeWidth: 3, // 设置笔画宽度
    strokeColor: '#b8b8b8', // 笔画颜色（字体模式下也用作文字颜色）
    radicalColor: '#3889f2', // 偏旁颜色 
    padding: 5, // 内边距

};



/**
 * 笔画模式渲染选项
 */
const DefaultStrokeFontRenderConfig: IDefaultStrokeFontRenderConfig = {
    ...BaseFontRenderConfig,
    renderMode: RENDER_TYPE.STROKE,
    // 其他笔画模式配置
    showOutline: false, // 显示汉字轮廓
    radicalColor: '#3889f2', // 偏旁颜色
    fontSizeRatio: 1, // 默认字体大小比例
    showBorder: true,
    
    fontShadowColor: DefaultCharsheetColors.SHADOW_COLOR, // 字体阴影颜色
    // 其他配置...
};

/**
 * 字体模式渲染选项， 暂时不用，后面扩展用
 */
const DefaultFontRenderOptions = {
    ...BaseFontRenderConfig,
    renderMode: RENDER_TYPE.NORMAL,
    fontFamily: '"SimHei", "Heiti SC", "Microsoft YaHei", sans-serif', // 默认字体
    fontSize: DefaultGridConfig.width, // 默认字体大小
    fontWeight: 'normal' as const, // 默认字体粗细
    fontStyleConfig: 'normal' as const, // 默认字体样式
    fontSizeRatio: 0.8, // 默认字体大小比例
    // 其他字体模式配置...
};


/**
 * 表格样式的默认配置
 */
const DefaultBorderStyleConfig: IDefaultBorderStyleConfig = {
    showBorder: true, // 是否显示边框
    useDashedLines: true,  // 是否使用虚线边框
    backgroundColor: 'none', // 边框背景颜色
    lineWidth: 1, // 边框线宽
    lineColor: DefaultCharsheetColors.GRID_COLOR, // 线条颜色 '#ddd', 
    borderColor: DefaultCharsheetColors.BORDER_COLOR, // 边框颜色 '#ccc',
    borderDash: false, // 是否使用虚线边框 
}



/**
 * 字帖渲染默认参数
 * 模板信息， 用什么模板
 * 样式信息， 模板样式
 * 
 */
export const DEFAULT_CONFIG: IDEFAULT_CONFIG = {
    // 模板信息 
    templateConfig: {
        ...DefaultTemplateConfig
    },
    // 渲染配置信息
    renderConfig: {
        // 字体渲染配置信息
        fontStyleConfig: {
            ...DefaultStrokeFontRenderConfig
        },
        // 边框渲染配置信息
        borderStyleConfig: {
            ...DefaultBorderStyleConfig
        },
        backgroundType: BACKGROUND_TYPE.DOT_GRID, // 默认使用米字格

    }
};

/**
 * 导出所有尺寸配置，供其他模块使用
 */
export const RENDER_SIZES = {
    // 网格基础配置 - 与字帖渲染直接相关的尺寸
    grid: DefaultGridConfig,
    // 间距配置 - 与字帖渲染相关的间距
    spacing: DefaultSpacingConfig,
    // 组件特定尺寸配置 - 与字帖渲染相关的组件尺寸
    component: DefaultComponentSizes,
    // 练字贴配置
    practice: DefaultPracticeConfig,
} as const;



