

interface IGrid {
  row: number;
  col: number;
}

/**
 * 用于渲染字帖描述每个单元格
 */
export interface IFontItem {
    /** 字符 */
    char: string; 
    /** 笔画数 */
    strokes?: number;
    /** 拼音 */
    pinyin?: string;
    /** 部首 */
    radical?: string;
    /** 是否为笔画顺序格子 */
    isStrokeOrder?: boolean;
    /** 笔画顺序索引（从1开始，表示第几笔） */
    strokeOrderIndex?: number;
    /** 原始汉字（用于笔画顺序格子记录对应的汉字） */
    originalChar?: string;
}

/**
 * 字帖行元素描述
 */
export interface IGridRow {
    pinyin: boolean; // 是否展示拼音
    strokes: boolean; // 是否展示笔画
    radicalColor: string; // 部首颜色
    strokeColor: string; // 笔画颜色
}

export interface IDefaultTemplateConfig {
    column: number; // 模板列数
    wordsPerRow: number; // 每个字占几行
    wordsPreCol: number; // 一行几个字 
    pinyin: boolean; // 是否展示拼音
    showStroke: boolean; // 是否展示笔画（米字格内展示的笔画）
    strokeNumber: number; // 展示几笔 (当 showStroke 为true时有效)
    showStrokeOrder: boolean; // 是否展示笔画顺序(顶部tips区域展示的笔画顺序，如果为true，则展示全部笔画)
}

 
