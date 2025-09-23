

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
    column: number;
    wordsPerRow: number;
    wordsPreCol: number;
}

 
