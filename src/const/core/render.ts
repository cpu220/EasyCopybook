
// 规范： 
// 1. 枚举都是大写
// 2. 配置项都首字母大写，default开头

import { IDefaultBorderStyle, IBaseFontRenderOptions, IStrokeFontRenderOptions } from '@/interface';

/**
 * 默认参数
 */
const DefaultGridConfig = {
    width: 60,
    height: 60,
    fontSize: 60,
    defaultCol: 10
};

const CharsheetColors = {
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
 * 基础渲染选项
 */
const BaseFontRenderOptions: IBaseFontRenderOptions = {
    width: DefaultGridConfig.width, // 设置合适的宽度
    height: DefaultGridConfig.height, // 设置合适的高度
    fontSize: DefaultGridConfig.fontSize, // 统一字体大小，默认等于宽度
    strokeWidth: 3, // 设置笔画宽度
    strokeColor: '#b8b8b8', // 笔画颜色（字体模式下也用作文字颜色）
    radicalColor: '#3889f2', // 偏旁颜色
    useGridBackground: true, // 使用米字格背景
    gridColor: CharsheetColors.GRID_COLOR, // 设置米字格线条颜色
    padding: 5, // 内边距
    useLocalData: true, // 使用本地字库数据
};



/**
 * 笔画模式渲染选项
 */
const StrokeFontRenderOptions: IStrokeFontRenderOptions = {
    ...BaseFontRenderOptions,
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
const FontRenderOptions = {
    ...BaseFontRenderOptions,
    renderMode: RENDER_TYPE.NORMAL,
    fontFamily: '"SimHei", "Heiti SC", "Microsoft YaHei", sans-serif', // 默认字体
    fontSize: DefaultGridConfig.width, // 默认字体大小
    fontWeight: 'normal' as const, // 默认字体粗细
    fontStyle: 'normal' as const, // 默认字体样式
    fontSizeRatio: 0.8, // 默认字体大小比例
    // 其他字体模式配置...
};


const DefaultBorderStyle: IDefaultBorderStyle = {
    showBorder: true,
    useDashedLines: true,
    backgroundColor: 'none',
    lineWidth: 1,
    lineColor: CharsheetColors.GRID_COLOR, // : '#ddd', 
    borderColor: CharsheetColors.BORDER_COLOR, // : '#ccc',
    borderDash: false, // : false,
}



/**
 * 字帖渲染默认参数
 * 模板信息， 用什么模板
 * 样式信息， 模板样式
 * 
 */
export const DEFAULT_CONFIG = {
    templateConfig: {
        column: DefaultGridConfig.defaultCol, // 列数  
    }, // 模板信息
    styleConfig: {
        fontSize: DefaultGridConfig.fontSize,
    },
    renderConfig: {
        fontStyle: {
            ...StrokeFontRenderOptions
        },
        borderStyle: {
            ...DefaultBorderStyle
        },
        backgroundType: BACKGROUND_TYPE.DOT_GRID, // 默认使用米字格

    }
};