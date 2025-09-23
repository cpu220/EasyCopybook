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
   * @returns 格式化后的二维数组，每个元素包含一个字符
   */
  createCharArray(str: string, column: number): IFontItem[][];
}

/**
 * 类型1: 几排展示1个字的策略 - 一个字占据多行，每行的第一个单元格显示相同的字
 * 这种策略适用于需要重复练习同一个汉字的情况
 */
export class MultiRowsOneWordStrategy implements GridLayoutStrategy {
  private rowsPerWord: number;
  
  /**
   * 构造函数
   * @param rowsPerWord 每个字占据的行数
   */
  constructor(rowsPerWord: number) {
    this.rowsPerWord = rowsPerWord;
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
   * @returns 二维数组，每个字占据多行
   */
  createCharArray(str: string, column: number): IFontItem[][] {
    const result: IFontItem[][] = [];
    const strLength = str.length;
    
    for (let i = 0; i < strLength; i++) {
      // 为每个字生成rowsPerWord排
      for (let rowIndex = 0; rowIndex < this.rowsPerWord; rowIndex++) {
        const rowItem: IFontItem[] = [{ char: str[i] }];
        // 补齐整行的其余格子为空
        for (let j = 1; j < column; j++) {
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
  
  /**
   * 构造函数
   * @param wordsPerRow 每行显示的汉字数量
   */
  constructor(wordsPerRow: number) {
    this.wordsPerRow = wordsPerRow;
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
   * @returns 二维数组，每行显示固定数量的汉字，汉字之间有空格
   */
  createCharArray(str: string, column: number): IFontItem[][] {
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
          rowItem.push({ char: str[i] });
        } else {
          rowItem.push({ char: '' });
        }
        
        // 添加第一个字后面的空格
        for (let j = 1; j < halfColumn; j++) {
          rowItem.push({ char: '' });
        }
        
        // 第二个字
        if (i + 1 < strLength) {
          rowItem.push({ char: str[i + 1] });
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
            rowItem.push({ char: str[charIndex] });
          } else {
            rowItem.push({ char: '' });
          }
          
          // 在每个汉字后添加空格（除了最后一个）
          if (k < wordsCount - 1) {
            for (let j = 0; j < spacesPerGap; j++) {
              rowItem.push({ char: '' });
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
   * @returns 二维数组，按顺序填充所有字符
   */
  createCharArray(str: string, column: number): IFontItem[][] {
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
 * 布局策略工厂类 - 根据配置参数返回对应的布局策略实例
 */
export class GridLayoutStrategyFactory {
  /**
   * 获取布局策略实例
   * @param config 配置参数
   * @param config.wordsPerRow 每行的字数
   * @param config.wordsPreCol 每列的字数
   * @param config.column 总列数
   * @returns 对应的布局策略实例
   */
  static getStrategy(config: { wordsPerRow: number; wordsPreCol: number; column: number }): GridLayoutStrategy {
    const { wordsPerRow, wordsPreCol, column } = config;
    
    // 类型1: 几排展示1个字的策略 (wordsPreCol === 1)
    if (wordsPreCol === 1 && wordsPerRow >= 1) {
      // wordsPerRow 在这里表示每个字占据的行数
      return new MultiRowsOneWordStrategy(wordsPerRow);
    }
    
    // 类型2: 一排展示n个字的策略 (wordsPerRow === 1 且 wordsPreCol < column)
    if (wordsPerRow === 1 && wordsPreCol > 0 && wordsPreCol < column) {
      // wordsPreCol 在这里表示每行显示的字数
      return new FewWordsPerRowStrategy(wordsPreCol);
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
 * @returns 二维数组，每个元素是一个字符
 */
export const formatGridData = (str: string, templateConfig: IDefaultTemplateConfig) => {
  const { column, wordsPerRow, wordsPreCol } = templateConfig
  // 获取对应的布局策略
  const strategy = GridLayoutStrategyFactory.getStrategy({ wordsPerRow, wordsPreCol, column });
  // 创建字符数组
  const charArr = strategy.createCharArray(str, column);
  // 返回格式化后的二维数组
  return charArr;
}

