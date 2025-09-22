


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
 * 字帖渲染默认参数
 * 模板信息， 用什么模板
 * 样式信息， 模板样式
 * 
 */
export const DEFAULT_CONFIG = {
    templateConfig: {
        column: 10, // 列数

    }, // 模板信息
    styleConfig: {
        fontSize: GridConfig.fontSize,
    },
    renderConfig: {
        fontStyle: {
            showOutline: true, //: true,
            showCharacter: false, //: true,
            currentColor: '#b44', // 仅在stroke模式下有效
            length: GridConfig.width,
            padding: 5, // 数值, 默认 20。 画布的汉字和边缘之间的填充
            outlineColor: '#ddd', // 十六进制字符, 默认 '#DDD'。
            strokeColor: '#555', // 十六进制字符, 默认 '#555'。绘制每个笔划的颜色。
            radicalColor: '#3889f2',//: null, // 十六进制字符, 默认 null。 如果存在偏旁部首数据，则在笔划中绘制偏旁部首的颜色。 如果没有设置，激光将绘制与其他笔划相同的颜色。
            // strokeFadeDuration?: number; //400
        },
        borderStyle: {
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
         
    }
};