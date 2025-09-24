/**
 * 根据配置项，生成字帖模板的二维数组
 */

import { IFontItem, IDefaultTemplateConfig } from '@/interface';
import { GridLayoutStrategy } from './baseGridLayoutStrategy';
import { 
  MultiRowsOneWordStrategy,
  FewWordsPerRowStrategy,
  FullRowWordsStrategy,
  PracticeWritingStrategy,
  PoetryLayoutStrategy
} from './layoutStrategies';
import { TEMPLATE_LAYOUT_TYPE } from '@/const';


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
   * @param config.layoutType 布局类型（常规字帖或练字贴）
   * @param config.charStrokeCounts 可选，汉字及其实际笔画数的映射
   * @returns 对应的布局策略实例
   */
  static getStrategy(config: { 
    wordsPerRow: number; 
    wordsPreCol: number; 
    column: number; 
    templateLayoutType?: string;
    charStrokeCounts?: Map<string, number>;
  }): GridLayoutStrategy {
    const { wordsPerRow, wordsPreCol, column, templateLayoutType, charStrokeCounts } = config;
    
    // 诗词布局策略
    if (templateLayoutType === TEMPLATE_LAYOUT_TYPE.POETRY) {
      return new PoetryLayoutStrategy(charStrokeCounts);
    }
    
    // 练字贴布局 - n排一个字的策略
    if (templateLayoutType === TEMPLATE_LAYOUT_TYPE.PRACTICE) {
      return new PracticeWritingStrategy(undefined, charStrokeCounts);
    }
    
    // 常规字帖布局策略
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
  const { column, wordsPerRow, wordsPreCol, showStrokeOrderShadow, templateLayoutType,strokeNumber } = templateConfig
  console.log('formatGridData', templateConfig);
  // 获取对应的布局策略
  const strategy = GridLayoutStrategyFactory.getStrategy({ 
    wordsPerRow, 
    wordsPreCol, 
    column,
    templateLayoutType,
    charStrokeCounts
  });
  // 创建字符数组
    const charArr = strategy.createCharArray(str, column, showStrokeOrderShadow, strokeNumber);
  // 返回格式化后的二维数组
  return charArr;
}

