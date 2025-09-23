
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

/**
 * 默认参数
 */
const DefaultGridConfig = {
    width: 60,
    height: 60,
    fontSize: 60,
    defaultCol: 10
};

const DefaultCharsheetColors = {
    BORDER_COLOR: '#ddd',
    GRID_COLOR: '#ddd'
} as const;


/**
 * 字帖渲染类型
 */
const enum RENDER_TYPE {
    NORMAL = 'normal', // 普通模式
    ANIMATION = 'animation', // 动画模式
    STROKE = 'stroke', // 笔画模式
}

/**
 * 背景类型枚举
 */
export const enum BACKGROUND_TYPE {
    NONE = 'none', // 没有背景
    DOT_GRID = 'dotGrid', // 米字格
    SQUARE_GRID = 'squareGrid', // 田字格
}


/**
 * 模版信息
 * 定位是网格布局信息
 */
const DefaultTemplateConfig: IDefaultTemplateConfig = {
    column: DefaultGridConfig.defaultCol,
    wordsPerRow: 1, // 每个字占几行
    wordsPreCol: 1, // 一行几个字 
    pinyin:true, // 是否展示拼音
    showStroke:true, // 是否展示笔画（米字格内展示的笔画）
    strokeNumber:3, // 展示几笔 (当 showStroke 为true时有效)
    showStrokeOrder:true, // 是否展示笔画顺序(顶部tips区域展示的笔画顺序，如果为true，则展示全部笔画)
}




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
    showBorder: true
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



