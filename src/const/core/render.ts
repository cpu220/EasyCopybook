


/**
 * 默认参数
 */
const GridConfig = {
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
const BaseRenderOptions = {
  width: GridConfig.width, // 设置合适的宽度
  height: GridConfig.height, // 设置合适的高度
  fontSize: GridConfig.fontSize, // 统一字体大小，默认等于宽度
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
const StrokeRenderOptions = {
  ...BaseRenderOptions,
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
  ...BaseRenderOptions,
  renderMode: RENDER_TYPE.NORMAL,
  fontFamily: '"SimHei", "Heiti SC", "Microsoft YaHei", sans-serif', // 默认字体
  fontSize: GridConfig.width, // 默认字体大小
  fontWeight: 'normal' as const, // 默认字体粗细
  fontStyle: 'normal' as const, // 默认字体样式
  fontSizeRatio: 0.8, // 默认字体大小比例
  // 其他字体模式配置...
};

 

/**
 * 字帖渲染默认参数
 * 模板信息， 用什么模板
 * 样式信息， 模板样式
 * 
 */
export const DEFAULT_CONFIG = {
    templateConfig: {
        column: GridConfig.defaultCol, // 列数 

    }, // 模板信息
    styleConfig: {
        fontSize: GridConfig.fontSize,
    },
    renderConfig: {
        type: RENDER_TYPE.NORMAL, // 渲染类型
        fontStyle: {
            showOutline: true, //: true,
            showCharacter: true, //: true,
            currentColor: '#ddd', // 仅在stroke模式下有效
            length: GridConfig.width,
            padding: 5, // 数值, 默认 20。 画布的汉字和边缘之间的填充
            outlineColor: '#ddd', // 十六进制字符, 默认 '#DDD'。
            strokeColor: '#555', // 十六进制字符, 默认 '#555'。绘制每个笔划的颜色。
            radicalColor: '#3889f2',//: null, // 十六进制字符, 默认 null。 如果存在偏旁部首数据，则在笔划中绘制偏旁部首的颜色。 如果没有设置，激光将绘制与其他笔划相同的颜色。
            // strokeFadeDuration?: number; //400
        },
        borderStyle: {
            backgroundColor: 'none',
            lineStraight: true, // : true,
            lineCross: true, // : true,
            lineWidth: 1, // : 1,
            lineColor: CharsheetColors.GRID_COLOR, // : '#ddd',
            lineDash: true, // : true,
            border: true, // : true,
            borderWidth: 1, // : 1,
            borderColor: CharsheetColors.BORDER_COLOR, // : '#ccc',
            borderDash: false, // : false,
        },
        backgroundType: BACKGROUND_TYPE.DOT_GRID, // 默认使用米字格
          
    }
};