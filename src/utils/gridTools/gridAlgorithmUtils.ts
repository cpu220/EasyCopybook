/**
 * 网格算法工具函数 - 提供重复使用的算法逻辑
 */

/**
 * 计算最大可显示的笔画格子数
 * @param params 配置参数
 * @param params.actualStrokeCount 实际笔画数
 * @param params.requestedStrokes 请求的笔画数
 * @param params.availableSpace 可用空间
 * @returns 计算得到的最大笔画格子数
 */
export const calculateMaxStrokeCells = (
  { actualStrokeCount, requestedStrokes, availableSpace }: {
    actualStrokeCount: number;
    requestedStrokes: number;
    availableSpace: number;
  }
): number => {
  // 取请求的笔画数、实际笔画数和可用空间的最小值
  return Math.min(
    requestedStrokes,
    actualStrokeCount > 0 ? actualStrokeCount : requestedStrokes,
    availableSpace
  );
};

/**
 * 计算需要的行数
 * @param params 配置参数
 * @param params.totalItems 总项目数
 * @param params.itemsPerRow 每行项目数
 * @returns 计算得到的行数
 */
export const calculateRows = (
  { totalItems, itemsPerRow }: {
    totalItems: number;
    itemsPerRow: number;
  }
): number => {
  if (itemsPerRow <= 0) {
    throw new Error('每行项目数必须大于0');
  }
  return Math.ceil(totalItems / itemsPerRow);
};

/**
 * 计算每行项目数
 * @param params 配置参数
 * @param params.totalItems 总项目数
 * @param params.totalRows 总行数
 * @returns 计算得到的每行项目数
 */
export const calculateItemsPerRow = (
  { totalItems, totalRows }: {
    totalItems: number;
    totalRows: number;
  }
): number => {
  if (totalRows <= 0) {
    throw new Error('总行数必须大于0');
  }
  return Math.ceil(totalItems / totalRows);
};

/**
 * 将字符串分割为指定长度的块
 * @param str 输入字符串
 * @param chunkSize 块大小
 * @returns 分割后的字符串数组
 */
export const splitStringIntoChunks = (
  str: string,
  chunkSize: number
): string[] => {
  if (chunkSize <= 0) {
    throw new Error('块大小必须大于0');
  }
  
  const chunks: string[] = [];
  for (let i = 0; i < str.length; i += chunkSize) {
    chunks.push(str.slice(i, i + chunkSize));
  }
  return chunks;
};

/**
 * 计算字符在网格中的位置
 * @param index 字符索引
 * @param column 列数
 * @returns 包含行索引和列索引的对象
 */
export const calculateGridPosition = (
  index: number,
  column: number
): { row: number; col: number } => {
  if (column <= 0) {
    throw new Error('列数必须大于0');
  }
  
  const row = Math.floor(index / column);
  const col = index % column;
  return { row, col };
};

/**
 * 计算空格分布
 * @param params 配置参数
 * @param params.totalSpace 总空间
 * @param params.gaps 需要的间隙数
 * @returns 每个间隙的空格数
 */
export const calculateSpaceDistribution = (
  { totalSpace, gaps }: {
    totalSpace: number;
    gaps: number;
  }
): number => {
  if (gaps <= 0) {
    return 0;
  }
  return Math.floor(totalSpace / gaps);
};

/**
 * 获取字符的实际笔画数
 * @param char 字符
 * @param charStrokeCounts 汉字及其实际笔画数的映射
 * @returns 实际笔画数，如果没有找到则返回0
 */
export const getActualStrokeCount = (
  char: string,
  charStrokeCounts?: Map<string, number>
): number => {
  if (!charStrokeCounts || char.length !== 1) {
    return 0;
  }
  return charStrokeCounts.get(char) || 0;
};

/**
 * 确保值在指定范围内
 * @param value 要检查的值
 * @param min 最小值
 * @param max 最大值
 * @returns 调整后的值
 */
export const clamp = (
  value: number,
  min: number,
  max: number
): number => {
  return Math.max(min, Math.min(max, value));
};

/**
 * 计算网格的总大小
 * @param rows 行数
 * @param columns 列数
 * @returns 网格的总大小
 */
export const calculateGridSize = (
  rows: number,
  columns: number
): number => {
  return rows * columns;
};