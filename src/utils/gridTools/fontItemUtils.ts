/**
 * 字体项工具函数 - 提供创建字体项对象的实用函数
 */
import { IFontItem } from '@/interface';

/**
 * 创建字体项
 * @param options 配置选项
 * @param options.char 字符内容
 * @param options.isStrokeOrder 是否为笔画顺序项
 * @param options.strokeOrderIndex 笔画索引
 * @param options.originalChar 原始字符
 * @returns 字体项对象
 */
export const createFontItem = ({ 
  char = '', 
  isStrokeOrder = false, 
  strokeOrderIndex = 0, 
  originalChar = '' 
}: Partial<IFontItem>): IFontItem => {
  return {
    char,
    isStrokeOrder,
    strokeOrderIndex,
    originalChar
  };
};

/**
 * 创建标准字体项（非笔画顺序）
 * @param char 字符内容
 * @returns 字体项对象
 */
export const createStandardFontItem = (char: string): IFontItem => {
  return createFontItem({ char });
};

/**
 * 创建空字符字体项
 * @returns 空字符字体项对象
 */
export const createEmptyFontItem = (): IFontItem => {
  return createFontItem({ char: '' });
};

/**
 * 创建笔画顺序字体项
 * @param originalChar 原始字符
 * @param strokeOrderIndex 笔画索引
 * @returns 笔画顺序字体项对象
 */
export const createStrokeOrderFontItem = (originalChar: string, strokeOrderIndex: number): IFontItem => {
  return createFontItem({
    char: '', // 空字符，实际内容由渲染组件处理
    isStrokeOrder: true,
    strokeOrderIndex,
    originalChar
  });
};

/**
 * 批量创建字体项
 * @param count 数量
 * @param creator 字体项创建函数
 * @returns 字体项对象数组
 */
export const createFontItemsBatch = <T extends any[]>(
  count: number,
  creator: (index: number, ...args: T) => IFontItem,
  ...args: T
): IFontItem[] => {
  const items: IFontItem[] = [];
  for (let i = 0; i < count; i++) {
    items.push(creator(i, ...args));
  }
  return items;
};

/**
 * 批量创建标准字体项
 * @param chars 字符数组
 * @returns 字体项对象数组
 */
export const createStandardFontItems = (chars: string[]): IFontItem[] => {
  return chars.map(char => createStandardFontItem(char));
};

/**
 * 批量创建空字符字体项
 * @param count 数量
 * @returns 空字符字体项对象数组
 */
export const createEmptyFontItems = (count: number): IFontItem[] => {
  return createFontItemsBatch(count, () => createEmptyFontItem());
};

/**
 * 批量创建笔画顺序字体项
 * @param originalChar 原始字符
 * @param startIndex 起始索引
 * @param endIndex 结束索引
 * @returns 笔画顺序字体项对象数组
 */
export const createStrokeOrderFontItems = (
  originalChar: string,
  startIndex: number,
  endIndex: number
): IFontItem[] => {
  const items: IFontItem[] = [];
  for (let i = startIndex; i <= endIndex; i++) {
    items.push(createStrokeOrderFontItem(originalChar, i));
  }
  return items;
};