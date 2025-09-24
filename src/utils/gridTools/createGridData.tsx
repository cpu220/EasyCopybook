/**
 * 根据配置项，生成字帖模板的二维数组
 */

import { IFontItem, IDefaultTemplateConfig } from '@/interface';

/**
 * 布局策略接口 - 定义所有布局策略需要实现的方法
 */
export interface GridLayoutStrategy {
  /**
   * 计算需要的行数
   * @param str 输入的字符串
   * @param column 列数
   * @returns 计算得到的行数
   */
  calculateRows(str: string, column: number): number;
  
  /**
   * 创建字符二维数组
   * @param str 输入的字符串
   * @param column 列数
   * @param showStrokeOrder 是否显示笔画顺序
   * @param strokeNumber 笔画数量
   * @returns 格式化后的二维数组，每个元素包含一个字符
   */
  createCharArray(str: string, column: number, showStrokeOrder?: boolean, strokeNumber?: number): IFontItem[][];
}

/**
 * 类型1: 几排展示1个字的策略 - 一个字占据多行，每行的第一个单元格显示相同的字
 * 这种策略适用于需要重复练习同一个汉字的情况
 */
export class MultiRowsOneWordStrategy implements GridLayoutStrategy {
  private rowsPerWord: number;
  private charStrokeCounts?: Map<string, number>;
  
  /**
   * 构造函数
   * @param rowsPerWord 每个字占据的行数
   * @param charStrokeCounts 可选，汉字及其实际笔画数的映射
   */
  constructor(rowsPerWord: number, charStrokeCounts?: Map<string, number>) {
    this.rowsPerWord = rowsPerWord;
    this.charStrokeCounts = charStrokeCounts;
  }
  
  /**
   * 计算行数 - 总行数 = 字符串长度 * 每个字占据的行数
   * @param str 输入的字符串
   * @param column 列数（此策略不使用）
   * @returns 计算得到的行数
   */
  calculateRows(str: string, column: number): number {
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
        const rowItem: IFontItem[] = [{ char }];
        
        // 如果启用了笔画顺序展示，并且有strokeNumber参数
        if (showStrokeOrder && strokeNumber && strokeNumber > 0) {
          // 获取当前汉字的实际笔画数
          const actualStrokeCount = this.charStrokeCounts?.get(char) || 0;
          // 取传入的strokeNumber和实际笔画数的最小值
          const maxStrokeCells = Math.min(strokeNumber, actualStrokeCount > 0 ? actualStrokeCount : strokeNumber);
          
          // 后面跟maxStrokeCells个笔画顺序格子
          for (let j = 1; j <= maxStrokeCells && j < column; j++) {
            rowItem.push({
              char: '', // 空字符，实际内容由渲染组件处理
              isStrokeOrder: true,
              strokeOrderIndex: j,
              originalChar: char
            });
          }
        }
        
        // 补齐整行的其余格子为空
        for (let j = rowItem.length; j < column; j++) {
          rowItem.push({ char: '' });
        }
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
export class FewWordsPerRowStrategy implements GridLayoutStrategy {
  private wordsPerRow: number;
  private charStrokeCounts?: Map<string, number>;
  
  /**
   * 构造函数
   * @param wordsPerRow 每行显示的汉字数量
   * @param charStrokeCounts 可选，汉字及其实际笔画数的映射
   */
  constructor(wordsPerRow: number, charStrokeCounts?: Map<string, number>) {
    this.wordsPerRow = wordsPerRow;
    this.charStrokeCounts = charStrokeCounts;
  }
  
  /**
   * 计算行数 - 总行数 = 字符串长度 / 每行字数，向上取整
   * @param str 输入的字符串
   * @param column 列数（此策略不使用）
   * @returns 计算得到的行数
   */
  calculateRows(str: string, column: number): number {
    return Math.ceil(str.length / this.wordsPerRow);
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
          rowItem.push({ char: currentChar });
          
          // 如果启用了笔画顺序展示，并且是第一个字且有足够空间
          if (showStrokeOrder && strokeNumber && strokeNumber > 0) {
            // 获取当前汉字的实际笔画数
            const actualStrokeCount = this.charStrokeCounts?.get(currentChar) || 0;
            // 取传入的strokeNumber和实际笔画数的最小值
            const maxStrokeCells = Math.min(strokeNumber, actualStrokeCount > 0 ? actualStrokeCount : strokeNumber, halfColumn - 1);
            for (let k = 1; k <= maxStrokeCells; k++) {
              rowItem.push({
                char: '',
                isStrokeOrder: true,
                strokeOrderIndex: k,
                originalChar: currentChar
              });
            }
            // 补齐剩余空格
            for (let k = rowItem.length; k < halfColumn; k++) {
              rowItem.push({ char: '' });
            }
          } else {
            // 添加第一个字后面的空格
            for (let j = 1; j < halfColumn; j++) {
              rowItem.push({ char: '' });
            }
          }
        } else {
          rowItem.push({ char: '' });
          // 添加第一个字后面的空格
          for (let j = 1; j < halfColumn; j++) {
            rowItem.push({ char: '' });
          }
        }
        
        // 第二个字
        if (i + 1 < strLength) {
          const currentChar = str[i + 1];
          rowItem.push({ char: currentChar });
          
          // 如果启用了笔画顺序展示，并且还有空间
          if (showStrokeOrder && strokeNumber && strokeNumber > 0) {
            // 获取当前汉字的实际笔画数
            const actualStrokeCount = this.charStrokeCounts?.get(currentChar) || 0;
            // 取传入的strokeNumber和实际笔画数的最小值
            const remainingSpace = column - rowItem.length;
            const maxStrokeCells = Math.min(strokeNumber, actualStrokeCount > 0 ? actualStrokeCount : strokeNumber, remainingSpace);
            for (let k = 1; k <= maxStrokeCells; k++) {
              rowItem.push({
                char: '',
                isStrokeOrder: true,
                strokeOrderIndex: k,
                originalChar: currentChar
              });
            }
          }
        } else {
          rowItem.push({ char: '' });
        }
        
        // 添加第二个字后面的空格（补齐整行）
        for (let j = rowItem.length; j < column; j++) {
          rowItem.push({ char: '' });
        }
        
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
          rowItem.push({ char: '' });
        }
        
        // 填充汉字和它们之间的空格
        for (let k = 0; k < wordsCount; k++) {
          const charIndex = i + k;
          if (charIndex < strLength) {
            const currentChar = str[charIndex];
            rowItem.push({ char: currentChar });
            
            // 如果启用了笔画顺序展示，并且不是最后一个字
            if (showStrokeOrder && strokeNumber && strokeNumber > 0 && k < wordsCount - 1) {
              // 获取当前汉字的实际笔画数
              const actualStrokeCount = this.charStrokeCounts?.get(currentChar) || 0;
              // 取传入的strokeNumber和实际笔画数的最小值
              const maxStrokeCells = Math.min(strokeNumber, actualStrokeCount > 0 ? actualStrokeCount : strokeNumber, spacesPerGap);
              for (let m = 1; m <= maxStrokeCells; m++) {
                rowItem.push({
                  char: '',
                  isStrokeOrder: true,
                  strokeOrderIndex: m,
                  originalChar: currentChar
                });
              }
              // 补齐剩余空格
              for (let m = rowItem.length; m < rowItem.length + spacesPerGap - maxStrokeCells; m++) {
                rowItem.push({ char: '' });
              }
            } else if (k < wordsCount - 1) {
              // 在每个汉字后添加空格（除了最后一个）
              for (let j = 0; j < spacesPerGap; j++) {
                rowItem.push({ char: '' });
              }
            }
          } else {
            rowItem.push({ char: '' });
            
            // 在每个汉字后添加空格（除了最后一个）
            if (k < wordsCount - 1) {
              for (let j = 0; j < spacesPerGap; j++) {
                rowItem.push({ char: '' });
              }
            }
          }
        }
        
        // 补齐整行
        for (let j = rowItem.length; j < column; j++) {
          rowItem.push({ char: '' });
        }
        
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
export class FullRowWordsStrategy implements GridLayoutStrategy {
  /**
   * 计算行数 - 总行数 = 字符串长度 / 列数，向上取整
   * @param str 输入的字符串
   * @param column 列数
   * @returns 计算得到的行数
   */
  calculateRows(str: string, column: number): number {
    return Math.ceil(str.length / column);
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
        rowItem.push({
          char: index < strLength ? str[index] : ''
        });
      }
      result.push(rowItem);
    }
    
    return result;
  }
}

/**
 * 类型4: 笔画顺序展示策略 - 第一个格子显示汉字，后面跟strokeNumber个笔画顺序格子，剩余格子为空
 * 这种策略适用于需要展示汉字笔画顺序的情况
 */
export class StrokeOrderStrategy implements GridLayoutStrategy {
  private strokeNumber: number;
  private charStrokeCounts?: Map<string, number>;
  
  /**
   * 构造函数
   * @param strokeNumber 要展示的笔画数量
   * @param charStrokeCounts 可选，汉字及其实际笔画数的映射
   */
  constructor(strokeNumber: number, charStrokeCounts?: Map<string, number>) {
    this.strokeNumber = strokeNumber;
    this.charStrokeCounts = charStrokeCounts;
  }
  
  /**
   * 计算行数 - 每个汉字占一行
   * @param str 输入的字符串
   * @param column 列数（此策略不使用）
   * @returns 计算得到的行数
   */
  calculateRows(str: string, column: number): number {
    return str.length;
  }
  
  /**
   * 创建字符数组 - 每行第一个格子显示汉字，后面跟笔画顺序格子，剩余格子为空
   * @param str 输入的字符串
   * @param column 列数
   * @param showStrokeOrder 是否显示笔画顺序
   * @param strokeNumber 笔画数量
   * @returns 二维数组，每行包含汉字和笔画顺序格子
   */
  createCharArray(str: string, column: number, showStrokeOrder?: boolean, strokeNumber?: number): IFontItem[][] {
    const result: IFontItem[][] = [];
    const strLength = str.length;
    
    for (let i = 0; i < strLength; i++) {
      const char = str[i];
      const rowItem: IFontItem[] = [];
      
      // 第一个格子：显示汉字
      rowItem.push({ char });
      
      // 获取当前汉字的实际笔画数，如果没有则使用传入的strokeNumber
      const actualStrokeCount = this.charStrokeCounts?.get(char) || 0;
      // 取传入的strokeNumber和实际笔画数的最小值
      const maxStrokeCells = Math.min(this.strokeNumber, actualStrokeCount > 0 ? actualStrokeCount : this.strokeNumber);
      
      // 后面跟maxStrokeCells个笔画顺序格子
      for (let j = 1; j <= maxStrokeCells && j < column; j++) {
        rowItem.push({
          char: '', // 空字符，实际内容由渲染组件处理
          isStrokeOrder: true,
          strokeOrderIndex: j,
          originalChar: char
        });
      }
      
      // 剩余格子为空（米字格）
      for (let j = rowItem.length; j < column; j++) {
        rowItem.push({ char: '' });
      }
      
      result.push(rowItem);
    }
    
    return result;
  }
}
/**
 * 布局策略工厂类 - 根据配置参数返回对应的布局策略实例
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

