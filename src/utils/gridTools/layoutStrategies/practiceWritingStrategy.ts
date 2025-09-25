import { IFontItem } from '@/interface';
import { BaseGridLayoutStrategy } from '../baseGridLayoutStrategy';
import { RENDER_SIZES } from '@/const/core/render';
import { getActualStrokeCount } from '../gridAlgorithmUtils';

/**
 * 练字贴布局策略 - n排一个字的布局
 * 规则：
 * 1. 第一排第一个格子渲染对应的汉字
 * 2. 后面一排剩下的格子，按顺序展示对应汉字笔画阴影，有多少展示多少，超过这一行就换到下面一行继续展示
 * 3. 默认一个字拥有4行，笔画数 + 第一排第一个用来展示汉字的 < row*col 的数量，那后面的就空白展示米字格
 */
export class PracticeWritingStrategy extends BaseGridLayoutStrategy {
  private rowsPerChar: number;
  
  /**
   * 构造函数
   * @param rowsPerChar 每个字占据的行数，默认从配置中获取
   * @param charStrokeCounts 可选，汉字及其实际笔画数的映射
   */
  constructor(rowsPerChar?: number, charStrokeCounts?: Map<string, number>) {
    super(charStrokeCounts);
    this.rowsPerChar = rowsPerChar || RENDER_SIZES.practice.defaultRowsPerChar;
  }
  
  /**
   * 计算行数 - 总行数 = 字符串长度 * 每个字占据的行数
   * @param str 输入的字符串
   * @param column 列数（此策略不使用）
   * @returns 计算得到的行数
   */
  calculateRows(str: string, column: number): number {
    return str.length * this.rowsPerChar;
  }
  
  /**
   * 创建字符数组
   * @param params 参数对象
   * @param params.str 输入字符串
   * @param params.column 列数
   * @param params.showStrokeOrderShadow 是否显示笔画顺序阴影
   * @param params.strokeNumber 笔画数
   * @returns 二维数组
   */
  createCharArray(params: {
    str: string;
    column: number;
    showStrokeOrderShadow?: boolean;
    strokeNumber?: number;
  }): IFontItem[][] {
    const { str, column, showStrokeOrderShadow, strokeNumber } = params;
    const result: IFontItem[][] = [];
    
    for (let i = 0; i < str.length; i++) {
      const currentChar = str[i];
      
      // 获取当前字符的实际笔画数
      const actualStrokeCount = getActualStrokeCount(currentChar, this.charStrokeCounts);
      
      // 跟踪已经显示的笔画数量
      let displayedStrokes = 0;
      
      for (let rowIndex = 0; rowIndex < this.rowsPerChar; rowIndex++) {
        const rowItem: IFontItem[] = [];
        
        if (rowIndex === 0) {
          // 第一行：第一个格子显示汉字，后续格子显示笔画阴影
          rowItem.push(this.createFontItem(currentChar));
          
          // 第一行剩余格子数
          const remainingCellsInFirstRow = column - 1;
          
          // 计算第一行可以显示的笔画数
          const strokesInFirstRow = Math.min(actualStrokeCount, remainingCellsInFirstRow);
          
          // 添加第一行的笔画阴影格子
          for (let strokeIndex = 0; strokeIndex < strokesInFirstRow; strokeIndex++) {
            rowItem.push(this.createStrokeOrderItem(currentChar, strokeIndex + 1));
          }
          
          // 更新已显示的笔画数
          displayedStrokes = strokesInFirstRow;
          
          // 补齐第一行剩余的空格子
          for (let emptyIndex = strokesInFirstRow; emptyIndex < remainingCellsInFirstRow; emptyIndex++) {
            rowItem.push(this.createFontItem(''));
          }
        } else {
          // 后续行：全部用于显示笔画阴影
          // 计算当前行可以显示的笔画数
          const strokesLeftToDisplay = Math.max(0, actualStrokeCount - displayedStrokes);
          const strokesInCurrentRow = Math.min(strokesLeftToDisplay, column);
          
          // 添加当前行的笔画阴影格子
          for (let strokeIndex = 0; strokeIndex < strokesInCurrentRow; strokeIndex++) {
            const globalStrokeIndex = displayedStrokes + strokeIndex + 1;
            rowItem.push(this.createStrokeOrderItem(currentChar, globalStrokeIndex));
          }
          
          // 更新已显示的笔画数
          displayedStrokes += strokesInCurrentRow;
          
          // 补齐当前行剩余的空格子
          for (let emptyIndex = strokesInCurrentRow; emptyIndex < column; emptyIndex++) {
            rowItem.push(this.createFontItem(''));
          }
        }
        
        result.push(rowItem);
      }
    }
    
    return result;
  }
  
  /**
   * 创建笔画顺序项
   * @param char 汉字
   * @param strokeIndex 笔画索引（从1开始）
   * @returns 笔画顺序项
   */
  private createStrokeOrderItem(char: string, strokeIndex: number): IFontItem {
    return this.createStrokeOrderFontItem(char, strokeIndex);
  }
}