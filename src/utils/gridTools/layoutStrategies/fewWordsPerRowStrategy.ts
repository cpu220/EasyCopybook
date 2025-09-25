import { IFontItem } from '@/interface';
import { BaseGridLayoutStrategy } from '../baseGridLayoutStrategy';
import { calculateRows } from '../gridAlgorithmUtils';

/**
 * 类型2: 一排展示n个字的策略 - 每行显示n个汉字，n < column，汉字之间有空格
 * 这种策略适用于需要在一行中展示较少汉字，留有更多空白空间的情况
 */
export class FewWordsPerRowStrategy extends BaseGridLayoutStrategy {
  private wordsPerRow: number;
  
  /**
   * 构造函数
   * @param wordsPerRow 每行显示的汉字数量
   * @param charStrokeCounts 可选，汉字及其实际笔画数的映射
   */
  constructor(wordsPerRow: number, charStrokeCounts?: Map<string, number>) {
    super(charStrokeCounts);
    this.wordsPerRow = wordsPerRow;
  }
  
  /**
   * 计算行数 - 总行数 = 字符串长度 / 每行字数，向上取整
   * @param str 输入的字符串
   * @param column 列数（此策略不使用）
   * @returns 计算得到的行数
   */
  calculateRows(str: string, column: number): number {
    // 使用工具函数计算行数
    return calculateRows({
      totalItems: str.length,
      itemsPerRow: this.wordsPerRow
    });
  }
  
  /**
   * 创建字符数组 - 每行显示固定数量的汉字，汉字之间平均分布空格
   * @param params 参数对象
   * @param params.str 输入的字符串
   * @param params.column 列数
   * @param params.showStrokeOrderShadow 是否显示笔画顺序
   * @param params.strokeNumber 笔画数量
   * @returns 二维数组，每行显示固定数量的汉字，汉字之间有空格
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
    
    // 每行的汉字数量
    const wordsCount = this.wordsPerRow;
    
    if (wordsCount === 2) {
      // 特殊处理一排2个字的情况（根据之前的实现）
      const halfColumn = Math.floor(column / 2); // 计算每侧的格子数
      
      for (let i = 0; i < strLength; i += 2) {
        const rowItem: IFontItem[] = [];
        
        // 第一个字
        if (i < strLength) {
          const currentChar = str[i];
          rowItem.push(this.createFontItem(currentChar));
          
          // 如果启用了笔画顺序展示，并且是第一个字且有足够空间
          if (showStrokeOrderShadow && strokeNumber && strokeNumber > 0) {
            const maxStrokeCells = this.calculateMaxStrokeCells(currentChar, strokeNumber, halfColumn - 1);
            this.addStrokeOrderCells(rowItem, currentChar, strokeNumber, maxStrokeCells);
            // 补齐剩余空格到halfColumn
            while (rowItem.length < halfColumn) {
              rowItem.push(this.createFontItem(''));
            }
          } else {
            // 添加第一个字后面的空格
            for (let j = 1; j < halfColumn; j++) {
              rowItem.push(this.createFontItem(''));
            }
          }
        } else {
          rowItem.push(this.createFontItem(''));
          // 添加第一个字后面的空格
          for (let j = 1; j < halfColumn; j++) {
            rowItem.push(this.createFontItem(''));
          }
        }
        
        // 第二个字
        if (i + 1 < strLength) {
          const currentChar = str[i + 1];
          rowItem.push(this.createFontItem(currentChar));
          
          // 如果启用了笔画顺序展示，并且还有空间
          if (showStrokeOrderShadow && strokeNumber && strokeNumber > 0) {
            const remainingSpace = column - rowItem.length;
            const maxStrokeCells = this.calculateMaxStrokeCells(currentChar, strokeNumber, remainingSpace);
            this.addStrokeOrderCells(rowItem, currentChar, strokeNumber, maxStrokeCells);
          }
        } else {
          rowItem.push(this.createFontItem(''));
        }
        
        // 添加第二个字后面的空格（补齐整行）
        this.fillRow(rowItem, column);
        
        result.push(rowItem);
      }
    } else {
      // 通用的一排n个字的实现（n>2）
      // 计算每个汉字之间的空格数量
      const spacesPerGap = Math.floor(column / (wordsCount + 1));
      
      for (let i = 0; i < strLength; i += wordsCount) {
        const rowItem: IFontItem[] = [];
        
        // 行首空格
        for (let j = 0; j < spacesPerGap; j++) {
          rowItem.push(this.createFontItem(''));
        }
        
        // 填充汉字和它们之间的空格
        for (let k = 0; k < wordsCount; k++) {
          const charIndex = i + k;
          if (charIndex < strLength) {
            const currentChar = str[charIndex];
            rowItem.push(this.createFontItem(currentChar));
            
            // 如果启用了笔画顺序展示，并且不是最后一个字
            if (showStrokeOrderShadow && strokeNumber && strokeNumber > 0 && k < wordsCount - 1) {
              const maxStrokeCells = this.calculateMaxStrokeCells(currentChar, strokeNumber, spacesPerGap);
              this.addStrokeOrderCells(rowItem, currentChar, strokeNumber, maxStrokeCells);
              // 补齐剩余空格
              for (let m = 0; m < spacesPerGap - maxStrokeCells; m++) {
                rowItem.push(this.createFontItem(''));
              }
            } else if (k < wordsCount - 1) {
              // 在每个汉字后添加空格（除了最后一个）
              for (let j = 0; j < spacesPerGap; j++) {
                rowItem.push(this.createFontItem(''));
              }
            }
          } else {
            rowItem.push(this.createFontItem(''));
            
            // 在每个汉字后添加空格（除了最后一个）
            if (k < wordsCount - 1) {
              for (let j = 0; j < spacesPerGap; j++) {
                rowItem.push(this.createFontItem(''));
              }
            }
          }
        }
        
        // 补齐整行
        this.fillRow(rowItem, column);
        
        result.push(rowItem);
      }
    }
    
    return result;
  }
}