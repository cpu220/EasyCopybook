/**
 * 诗词布局策略 - 专门用于展示唐诗宋词的布局
 * 布局格式：
 * - 第一排：诗词名
 * - 第二排：朝代 作者
 * - 下面每一排：一句古诗词
 */

import { IFontItem } from '@/interface';
import { IPoetryItem } from '@/interface/poetry';
import { BaseGridLayoutStrategy } from '../baseGridLayoutStrategy';

/**
 * 诗词数据结构接口
 */
export interface PoetryData {
  title: string;
  dynasty: string;
  author: string;
  content: string | string[];
  type: string;
}

/**
 * 诗词布局策略类
 */
export class PoetryLayoutStrategy extends BaseGridLayoutStrategy {
  /**
   * 构造函数
   * @param charStrokeCounts 可选，汉字及其实际笔画数的映射
   */
  constructor(charStrokeCounts?: Map<string, number>) {
    super(charStrokeCounts);
  }

  /**
   * 计算行数 - 诗词布局固定为：标题1行 + 作者1行 + 诗句行数
   * @param str 输入的字符串（JSON格式的诗词数据）
   * @param column 列数（此策略不使用）
   * @returns 计算得到的行数
   */
  calculateRows(str: string, column: number): number {
    try {
      // 尝试解析输入的字符串为诗词数据对象
      const poetryData: PoetryData = typeof str === 'string' && str.startsWith('{') ? 
        JSON.parse(str) : { title: '未知标题', author: '未知作者', content: str, type: '未知类型' };

        
      
      // 计算行数：标题1行 + 作者1行 + 诗句行数
      if (Array.isArray(poetryData.content)) {
        return 1 + 1 + poetryData.content.length;
      } else if (typeof poetryData.content === 'string') {
        const contentLines = this.splitPoetryContent(poetryData.content);
        return 1 + 1 + contentLines.length;
      }
    } catch (error) {
      console.warn('计算行数时解析诗词数据失败:', error);
    }
    
    return 3; // 标题1行 + 作者1行 + 至少1行诗句
  }

  /**
   * 创建字符数组 - 实现诗词布局
   * @param params 参数对象
   * @param params.str 输入的字符串（这里应该是JSON格式的诗词数据）
   * @param params.column 列数
   * @param params.showStrokeOrderShadow 是否显示笔画顺序（诗词布局默认不显示）
   * @param params.strokeNumber 笔画数量（诗词布局默认不使用）
   * @returns 二维数组，包含诗词标题、作者和内容
   */
  createCharArray(params: {
    str: string;
    column: number;
    showStrokeOrderShadow?: boolean;
    strokeNumber?: number;
  }): IFontItem[][] {
    const { str, column, showStrokeOrderShadow, strokeNumber } = params;
    const result: IFontItem[][] = [];

    try {
      // 尝试解析输入的字符串为诗词数据对象
      const poetryData: PoetryData = typeof str === 'string' && str.startsWith('{') ? 
        JSON.parse(str) :str;

      // 1. 添加诗词标题行（第一排）
      const titleRow = this.createCenterAlignedRow(poetryData.title, column);
      result.push(titleRow);

      // 2. 添加朝代和作者行（第二排）
      const authorText = `${poetryData.dynasty} ${poetryData.author}`;
      const authorRow = this.createCenterAlignedRow(authorText, column);
      result.push(authorRow);

      // 3. 添加诗词内容行（每行一句古诗词）
      if (Array.isArray(poetryData.content)) {
        // 直接使用数组中的每一项作为一行
        poetryData.content.forEach(line => {
          const contentRow = this.createCenterAlignedRow(line, column);
          result.push(contentRow);
        });
      } else if (typeof poetryData.content === 'string') {
        const contentLines = this.splitPoetryContent(poetryData.content);
        contentLines.forEach(line => {
          const contentRow = this.createCenterAlignedRow(line, column);
          result.push(contentRow);
        });
      }

    } catch (error) {
      // 如果解析失败，将输入字符串按行处理
      console.warn('诗词数据解析失败，使用默认处理方式:', error);
      const lines = str.split(/[，。；！？]/).filter(line => line.trim());
      
      if (lines.length > 0) {
        // 将第一行作为标题
        result.push(this.createCenterAlignedRow(lines[0], column));
        // 将第二行作为作者（如果有）
        if (lines.length > 1) {
          result.push(this.createCenterAlignedRow(lines[1], column));
        }
        // 将剩余行作为内容
        for (let i = 2; i < lines.length; i++) {
          result.push(this.createCenterAlignedRow(lines[i], column));
        }
      } else {
        // 如果没有有效行，添加一个空行
        result.push(this.createCenterAlignedRow(str, column));
      }
    }

    return result;
  }

  /**
   * 创建居中对齐的行
   * @param text 文本内容
   * @param column 列数
   * @returns 居中对齐的行数组
   */
  private createCenterAlignedRow(text: string, column: number): IFontItem[] {
    const rowItem: IFontItem[] = [];
    const textLength = text.length;

    // 计算左侧和右侧的空格数，使文本居中
    const totalSpaces = Math.max(0, column - textLength);
    const leftSpaces = Math.floor(totalSpaces / 2);
    const rightSpaces = totalSpaces - leftSpaces;

    // 添加左侧空格
    for (let i = 0; i < leftSpaces; i++) {
      rowItem.push(this.createFontItem(''));
    }

    // 添加文本字符
    for (let i = 0; i < text.length; i++) {
      rowItem.push(this.createFontItem(text[i]));
    }

    // 添加右侧空格
    for (let i = 0; i < rightSpaces; i++) {
      rowItem.push(this.createFontItem(''));
    }

    return rowItem;
  }

  /**
   * 分割诗词内容为句子
   * @param content 诗词内容
   * @returns 分割后的句子数组
   */
  private splitPoetryContent(content: string): string[] {
    // 使用中文标点符号分割诗词内容
    const punctuation = /[，。；！？]/;
    const lines: string[] = [];
    let currentLine = '';

    for (let i = 0; i < content.length; i++) {
      const char = content[i];
      currentLine += char;

      // 如果遇到标点符号，将当前行添加到结果数组
      if (punctuation.test(char)) {
        lines.push(currentLine.trim());
        currentLine = '';
      }
    }

    // 添加最后一行（如果有）
    if (currentLine.trim()) {
      lines.push(currentLine.trim());
    }

    return lines;
  }
}