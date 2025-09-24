/**
 * 布局策略抽象基类 - 封装布局策略的通用逻辑
 */
import { IFontItem } from '@/interface';
import { 
  createStandardFontItem,
  createStrokeOrderFontItem as createStrokeItem,
  createStrokeOrderFontItems,
  createEmptyFontItems
} from './fontItemUtils';
import { calculateMaxStrokeCells, getActualStrokeCount } from './gridAlgorithmUtils';

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
   * @param showStrokeOrderShadow 是否显示笔画顺序阴影
   * @param strokeNumber 笔画数量
   * @returns 格式化后的二维数组，每个元素包含一个字符
   */
  createCharArray(str: string, column: number, showStrokeOrderShadow?: boolean, strokeNumber?: number): IFontItem[][];
}

/**
 * 布局策略抽象基类 - 提供通用的布局逻辑
 */
export abstract class BaseGridLayoutStrategy implements GridLayoutStrategy {
  protected charStrokeCounts?: Map<string, number>;
  
  /**
   * 构造函数
   * @param charStrokeCounts 可选，汉字及其实际笔画数的映射
   */
  constructor(charStrokeCounts?: Map<string, number>) {
    this.charStrokeCounts = charStrokeCounts;
  }
  
  /**
   * 计算行数 - 子类必须实现
   */
  abstract calculateRows(str: string, column: number): number;
  
  /**
   * 创建字符二维数组 - 子类必须实现
   */
  abstract createCharArray(str: string, column: number, showStrokeOrderShadow?: boolean, strokeNumber?: number): IFontItem[][];
  
  /**
   * 创建标准字体项
   * @param char 字符
   * @returns 字体项对象
   */
  protected createFontItem(char: string): IFontItem {
    return createStandardFontItem(char);
  }
  
  /**
   * 创建笔画顺序字体项
   * @param originalChar 原始字符
   * @param strokeOrderIndex 笔画索引
   * @returns 笔画顺序字体项对象
   */
  protected createStrokeOrderFontItem(originalChar: string, strokeOrderIndex: number): IFontItem {
    return createStrokeItem(originalChar, strokeOrderIndex);
  }
  
  /**
   * 计算最大可显示的笔画格子数
   * @param char 字符
   * @param requestedStrokes 请求的笔画数
   * @param availableSpace 可用空间
   * @returns 计算得到的最大笔画格子数
   */
  protected calculateMaxStrokeCells(char: string, requestedStrokes: number, availableSpace: number): number {
    // 获取当前汉字的实际笔画数
    const actualStrokeCount = getActualStrokeCount(char, this.charStrokeCounts);
    // 使用工具函数计算最大可显示的笔画格子数
    return calculateMaxStrokeCells({
      actualStrokeCount,
      requestedStrokes,
      availableSpace
    });
  }
  
  /**
   * 向行中添加笔画顺序格子
   * @param rowItem 行项目数组
   * @param char 字符
   * @param strokeNumber 笔画数量
   * @param maxCells 最大格子数
   */
  protected addStrokeOrderCells(
    rowItem: IFontItem[],
    char: string,
    strokeNumber: number,
    maxCells: number
  ): void {
    // 使用工具函数批量创建笔画顺序项
    const strokeItems = createStrokeOrderFontItems(char, 1, maxCells);
    rowItem.push(...strokeItems);
  }
  
  /**
   * 补齐行中的剩余格子
   * @param rowItem 行项目数组
   * @param column 总列数
   * @param fillChar 填充字符，默认为空字符串
   */
  protected fillRow(rowItem: IFontItem[], column: number, fillChar: string = ''): void {
    const remainingCount = column - rowItem.length;
    if (remainingCount <= 0) return;
    
    if (fillChar === '') {
      // 使用工具函数批量创建空项
      const emptyItems = createEmptyFontItems(remainingCount);
      rowItem.push(...emptyItems);
    } else {
      // 批量创建指定字符的项
      const items = Array.from({ length: remainingCount }, () => this.createFontItem(fillChar));
      rowItem.push(...items);
    }
  }
}