/**
 * 类型1: 几排展示1个字的策略 - 一个字占据多行，每行的第一个单元格显示相同的字
 * 这种策略适用于需要重复练习同一个汉字的情况
 */

import { IFontItem } from '@/interface';
import { BaseGridLayoutStrategy } from '../baseGridLayoutStrategy';

export class MultiRowsOneWordStrategy extends BaseGridLayoutStrategy {
  private rowsPerWord: number;
  
  /**
   * 构造函数
   * @param rowsPerWord 每个字占据的行数
   * @param charStrokeCounts 可选，汉字及其实际笔画数的映射
   */
  constructor(rowsPerWord: number, charStrokeCounts?: Map<string, number>) {
    super(charStrokeCounts);
    this.rowsPerWord = rowsPerWord;
  }
  
  /**
   * 计算行数 - 总行数 = 字符串长度 * 每个字占据的行数
   * @param str 输入的字符串
   * @param column 列数（此策略不使用）
   * @returns 计算得到的行数
   */
  calculateRows(str: string, column: number): number {
    // 使用工具函数计算行数
    return Math.ceil(str.length * this.rowsPerWord);
  }
  
  /**
   * 创建字符数组 - 每个字占据多行，每行的第一个单元格显示相同的字
   * @param params 参数对象
   * @param params.str 输入的字符串
   * @param params.column 列数
   * @param params.showStrokeOrderShadow 是否显示笔画顺序
   * @param params.strokeNumber 笔画数量
   * @returns 二维数组，每个字占据多行
   */
  createCharArray(params: {
    str: string;
    column: number;
    showStrokeOrderShadow?: boolean;
    strokeNumber?: number;
  }): IFontItem[][] {
    const { str, column, showStrokeOrderShadow, strokeNumber } = params;
    const result: IFontItem[][] = [];
    const strLength = str.length;
    
    for (let i = 0; i < strLength; i++) {
      const char = str[i];
      // 为每个字生成rowsPerWord排
      for (let rowIndex = 0; rowIndex < this.rowsPerWord; rowIndex++) {
        const rowItem: IFontItem[] = [this.createFontItem(char)];
        
        // 如果启用了笔画顺序展示，并且有strokeNumber参数
        if (showStrokeOrderShadow && strokeNumber && strokeNumber > 0) {
           
          const maxStrokeCells = this.calculateMaxStrokeCells(char, strokeNumber, column - 1);
          this.addStrokeOrderCells(rowItem, char, strokeNumber, maxStrokeCells);
        }
        
        // 补齐整行的其余格子为空
        this.fillRow(rowItem, column);
        result.push(rowItem);
      }
    }
    
    return result;
  }
}