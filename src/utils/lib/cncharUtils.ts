// 导入cnchar-all库，这是一个包含所有功能的集成包
import cnchar from 'cnchar-all';
import { IFontItem } from '@/interface';
import { DEFAULT_CONFIG } from '@/const/core/render';

// cnchar-all包已经包含了所有必要的数据，可以直接使用本地数据而不需要远程请求

/**
 * 将普通字符转换为字帖样式
 * @param char 要转换的字符
 * @returns 包含字帖信息的对象
 */
export const transformToCopybook = (char: string): IFontItem => {
  // 使用 cnchar 获取字符的笔画信息
  const strokes = Number(cnchar.stroke(char));
  // 获取拼音信息
  const pinyin = String(cnchar.spell(char, 'low'));
  // 获取部首信息 - 尝试使用radical方法，如果不存在则返回空字符串
  const radical = typeof cnchar.radical === 'function' ? String(cnchar.radical(char)) : '';
  
  return {
    char,
    // 添加字帖相关的扩展属性
    strokes,
    pinyin,
    radical,
  };
};

/**
 * 将字符数组转换为字帖数组
 * @param charArray 字符二维数组
 * @returns 字帖二维数组
 */
export const transformCharArrayToCopybook = (charArray: IFontItem[][]): IFontItem[][] => {
  return charArray.map(row => 
    row.map(item => transformToCopybook(item.char))
  );
};

/**
 * 在DOM中渲染字帖效果
 * @param containerId 容器ID
 */
export const renderCopybookInDOM = (containerId: string): void => {
  // 在React环境中，确保DOM已经渲染完成后再进行操作
  requestAnimationFrame(() => {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container with id ${containerId} not found`);
      return;
    }
    
    const { renderConfig } = DEFAULT_CONFIG;
    
    // 查找网格容器内的所有网格项
    const gridItems = container.querySelectorAll('[data-font]');
    
    console.log(`找到 ${gridItems.length} 个网格项需要处理`);
    
    // 遍历所有网格项并逐个处理
    gridItems.forEach((item, index) => {
      // 使用setTimeout为每个项添加一个小延迟，避免阻塞UI线程
      setTimeout(() => {
        // 确保item是一个HTML元素
        if (!(item instanceof HTMLElement)) return;
        
        // 获取要渲染的汉字
        const char = item.getAttribute('data-font') || item.textContent?.trim() || '';
        
        if (!char || !/[一-龥]/.test(char)) {
          console.warn(`跳过非汉字字符: ${char}`);
          return;
        }
        
        try {
          // 确保cnchar.draw功能可用
          if (typeof cnchar.draw === 'function') {
            // 准备基础渲染配置
            const drawConfig = {
              el:`#${item.id}`,
              clear:true,
              onComplete:()=>{
                console.log(`${char} 渲染完成`);
              },
              style:{
                ...renderConfig.fontStyle
              },
              line:{
                ...renderConfig.borderStyle
              }
             
            };
            
           
            
            // 保存原始字符信息
            item.setAttribute('data-original-char', char);
            cnchar.draw(char, drawConfig);
           
             // 创建SVG元素
             
          }
        } catch (error) {
          console.error(`渲染汉字 '${char}' 时出错:`, error);
          item.textContent = char;
        }
      }, 0); // 每个项之间5ms的延迟，确保平滑处理
    });
  });
};

/**
 * 初始化 cnchar 配置
 */
export const initCnchar = (): void => {
  // 初始化 cnchar 配置
  try {
    console.log('初始化cnchar配置');
    
    // 验证draw插件是否可用
    console.log('cnchar.draw功能可用状态:', typeof cnchar.draw === 'function');
  } catch (error) {
    console.error('Error initializing cnchar:', error);
  }
};