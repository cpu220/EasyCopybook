/**
 * 根据配置项，生成字帖模板的二维数组
 */

import { IFontItem, IDefaultTemplateConfig } from '@/interface';
import { GridLayoutStrategy, BaseGridLayoutStrategy } from './baseGridLayoutStrategy';
import { calculateRows } from './gridAlgorithmUtils';

/**
 * 类型1: 几排展示1个字的策略 - 一个字占据多行，每行的第一个单元格显示相同的字
 * 这种策略适用于需要重复练习同一个汉字的情况
 */
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
   * @param str 输入的字符串
   * @param column 列数
   * @param showStrokeOrder 是否显示笔画顺序
   * @param strokeNumber 笔画数量
   * @returns 二维数组，每个字占据多行
   */
  createCharArray(str: string, column: number, showStrokeOrder?: boolean, strokeNumber?: number): IFontItem[][] {
    const result: IFontItem[][] = [];
    const strLength = str.length;
    
    for (let i = 0; i < strLength; i++) {
      const char = str[i];
      // 为每个字生成rowsPerWord排
      for (let rowIndex = 0; rowIndex < this.rowsPerWord; rowIndex++) {
        const rowItem: IFontItem[] = [this.createFontItem(char)];
        
        // 如果启用了笔画顺序展示，并且有strokeNumber参数
        if (showStrokeOrder && strokeNumber && strokeNumber > 0) {
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
   * @param str 输入的字符串
   * @param column 列数
   * @param showStrokeOrder 是否显示笔画顺序
   * @param strokeNumber 笔画数量
   * @returns 二维数组，每行显示固定数量的汉字，汉字之间有空格
   */
  createCharArray(str: string, column: number, showStrokeOrder?: boolean, strokeNumber?: number): IFontItem[][] {
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
          if (showStrokeOrder && strokeNumber && strokeNumber > 0) {
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
          if (showStrokeOrder && strokeNumber && strokeNumber > 0) {
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
            if (showStrokeOrder && strokeNumber && strokeNumber > 0 && k < wordsCount - 1) {
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
   * 创建字符数组 - 按行列顺序填充所有字符，没有额外空格
   * @param str 输入的字符串
   * @param column 列数
   * @param showStrokeOrder 是否显示笔画顺序
   * @param strokeNumber 笔画数量
   * @returns 二维数组，按顺序填充所有字符
   */
  createCharArray(str: string, column: number, showStrokeOrder?: boolean, strokeNumber?: number): IFontItem[][] {
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


/**
 * 布局策略工厂类 - 根据配置参数返回对应的布局策略实例
 * 注意：笔画顺序展示现在作为通用扩展能力处理，不再通过特定的策略类实现
 */
export class GridLayoutStrategyFactory {
  /**
   * 获取布局策略实例
   * @param config 配置参数
   * @param config.wordsPerRow 每行的字数
   * @param config.wordsPreCol 每列的字数
   * @param config.column 总列数
   * @param config.charStrokeCounts 可选，汉字及其实际笔画数的映射
   * @returns 对应的布局策略实例
   */
  static getStrategy(config: { 
    wordsPerRow: number; 
    wordsPreCol: number; 
    column: number; 
    charStrokeCounts?: Map<string, number>;
  }): GridLayoutStrategy {
    const { wordsPerRow, wordsPreCol, column, charStrokeCounts } = config;
    
    // 类型1: 几排展示1个字的策略 (wordsPreCol === 1)
    if (wordsPreCol === 1 && wordsPerRow >= 1) {
      // wordsPerRow 在这里表示每个字占据的行数
      return new MultiRowsOneWordStrategy(wordsPerRow, charStrokeCounts);
    }
    
    // 类型2: 一排展示n个字的策略 (wordsPerRow === 1 且 wordsPreCol < column)
    if (wordsPerRow === 1 && wordsPreCol > 0 && wordsPreCol < column) {
      // wordsPreCol 在这里表示每行显示的字数
      return new FewWordsPerRowStrategy(wordsPreCol, charStrokeCounts);
    }
    
    // 类型3: 一排展示column个字的策略 (wordsPerRow === 1 且 wordsPreCol === column)
    if (wordsPerRow === 1 && wordsPreCol === column) {
      return new FullRowWordsStrategy();
    }
    
    // 默认策略: 一排展示column个字
    return new FullRowWordsStrategy();
  }
}

/**
 * 格式化字符信息为表格所需的二维数组
 * @param str 输入的字符串
 * @param templateConfig 模板配置
 * @param charStrokeCounts 可选，汉字及其实际笔画数的映射
 * @returns 二维数组，每个元素是一个字符
 */
export const formatGridData = (str: string, templateConfig: IDefaultTemplateConfig, charStrokeCounts?: Map<string, number>) => {
  const { column, wordsPerRow, wordsPreCol, showStrokeOrder, strokeNumber } = templateConfig
  // 获取对应的布局策略
  const strategy = GridLayoutStrategyFactory.getStrategy({ 
    wordsPerRow, 
    wordsPreCol, 
    column,
    charStrokeCounts
  });
  // 创建字符数组
    const charArr = strategy.createCharArray(str, column, showStrokeOrder, strokeNumber);
  // 返回格式化后的二维数组
  return charArr;
}

