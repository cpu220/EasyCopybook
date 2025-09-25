import { IFontItem } from '@/interface';
import { BaseGridLayoutStrategy } from '../baseGridLayoutStrategy';
import { calculateRows } from '../gridAlgorithmUtils';

/**
 * 类型3: 一排展示column个字的策略 - 所有格子都显示对应的汉字，排满一行
 * 这种策略适用于需要在有限空间内展示最多汉字的情况
 */
export class FullRowWordsStrategy extends BaseGridLayoutStrategy {
  /**
   * 计算行数 - 总行数 = 字符串长度 / 列数，向上取整
   * @param str 输入的字符串
   * @param column 列数
   * @returns 计算得到的行数
   */
  calculateRows(str: string, column: number): number {
    // 使用工具函数计算行数
    return calculateRows({
      totalItems: str.length,
      itemsPerRow: column
    });
  }
  
  /**
   * 创建字符数组
   * @param params 参数对象
   * @param params.str 输入字符串
   * @param params.column 列数
   * @param params.showStrokeOrder 是否显示笔画顺序
   * @param params.strokeNumber 笔画数
   * @returns 二维数组
   */
  createCharArray(params: {
    str: string;
    column: number;
    showStrokeOrder?: boolean;
    strokeNumber?: number;
  }): IFontItem[][] {
    const { str, column, showStrokeOrder, strokeNumber } = params;
    const result: IFontItem[][] = [];
    const strLength = str.length;
    const rows = this.calculateRows(str, column);
    
    for (let i = 0; i < rows; i++) {
      const rowItem: IFontItem[] = [];
      for (let j = 0; j < column; j++) {
        const index = i * column + j;
        const char = index < strLength ? str[index] : '';
        rowItem.push(this.createFontItem(char));
      }
      result.push(rowItem);
    }
    
    return result;
  }
}