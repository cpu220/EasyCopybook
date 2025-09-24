/**
 * 基于 hanzi-writer 的汉字渲染工具
 * 提供统一的字体大小控制和汉字渲染功能
 */

import HanziWriter from 'hanzi-writer';
import { message } from 'antd'
import { DEFAULT_CONFIG, BACKGROUND_TYPE } from '@/const';
import { IDefaultBorderStyleConfig, IRenderConfig } from '@/interface'
import { RENDER_SIZES } from '@/const/core/render';

// 使用统一的默认配置选项
const defaultOptions = DEFAULT_CONFIG.renderConfig.fontStyleConfig;


// 本地字库数据缓存开关
const useLocalData = true;

// 任务错开时间
const defaultTimes = 5

// 存储已创建的writer实例引用
const writerInstances = new Map<string, any>();

// 本地字库数据缓存
const localCharacterDataCache = new Map<string, any>();

// 笔画数据全局缓存 - 避免重复获取
const strokeDataCache = new Map<string, string[]>();

/**
 * 清理笔画数据缓存
 * @param character 可选，指定要清理的字符，不传则清理所有缓存
 */
export const clearStrokeDataCache = (character?: string) => {
  if (character) {
    strokeDataCache.delete(character);
    console.log(`已清理字符"${character}"的笔画数据缓存`);
  } else {
    const cacheSize = strokeDataCache.size;
    strokeDataCache.clear();
    console.log(`已清理所有笔画数据缓存 (${cacheSize}个字符)`);
  }
};

/**
 * 获取缓存统计信息
 */
export const getStrokeDataCacheStats = () => {
  return {
    size: strokeDataCache.size,
    characters: Array.from(strokeDataCache.keys())
  };
};

/**
 * 安全清理容器内容
 * @param container 容器元素
 * @returns 是否清理成功
 */
export const safelyClearContainer = (container: HTMLElement | null): boolean => {
  if (!container) {
    return false;
  }

  try {
    // 清空所有子元素
    container.innerHTML = '';
    // 重置容器样式
    container.style.position = '';
    return true;
  } catch (error) {
    console.warn('清理容器内容时出错:', error);
    return false;
  }
};

/**
 * 创建米字格SVG元素,然后再进行米字格的绘制
 * @param width 宽度
 * @param height 高度
 * @param borderStyleConfig 额外选项
 * @returns SVG元素
 */
export const createGridSVG = (width: number, height: number, borderStyleConfig: IDefaultBorderStyleConfig): SVGElement => {

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', width.toString());
  svg.setAttribute('height', height.toString());
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

  // 为网格SVG添加统一的T-HZ类名
  svg.setAttribute('class', 'T-HZ');

  addGridLinesToSVG(svg, width, height, borderStyleConfig);

  return svg;
};

/**
 * 创建多色笔画SVG元素
 * 每个笔画使用不同的颜色
 * @param strokePaths 笔画路径数组
 * @param size SVG尺寸
 * @param colors 颜色数组
 * @returns SVG元素
 */
export const createMultiColorStrokeSVG = (strokePaths: string[], size: number, colors: readonly string[]): SVGElement => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

  // 添加统一的hanzi-writer标识类名
  svg.setAttribute('class', 'T-HZ');
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

  svg.style.width = `${size}px`;
  svg.style.height = `${size}px`;

  const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');

  // 设置变换属性，使字符在指定尺寸下渲染
  const transformData = HanziWriter.getScalingTransform(size, size);
  group.setAttributeNS(null, 'transform', transformData.transform);
  svg.appendChild(group);

  // 为每个笔画设置不同的颜色
  strokePaths.forEach((strokePath: string, index: number, arr:any[]) => {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttributeNS(null, 'd', strokePath);

    // 如果颜色数组不够，超出的笔画使用默认颜色
    let strokeColor: string;
    
    // if (index < colors.length) {
    //   // 在颜色数组范围内，使用对应颜色
    //   strokeColor = colors[index];
    // } else {
    //   // 超出颜色数组范围，使用默认填充颜色
    //   strokeColor = DEFAULT_CONFIG.renderConfig.fontStyleConfig.strokeColor;
    // }

    if(index < arr.length-1) { 
      strokeColor = DEFAULT_CONFIG.renderConfig.fontStyleConfig.strokeColor; 
    }else {
       strokeColor = colors[0]
      
    }

    // console.log('createMultiColorStrokeSVG', index, strokeColor,arr.length)
    

    path.style.fill = strokeColor;
    group.appendChild(path);
  });

  return svg;
};

/**
 * 向SVG元素添加米字格线条
 * @param svg SVG元素
 * @param width 宽度
 * @param height 高度
 * @param options 选项
 */
export const addGridLinesToSVG = (svg: SVGElement, width: number, height: number, borderStyleConfig: IDefaultBorderStyleConfig): void => {
  const {
    lineColor, borderColor, 
    lineWidth,
    useDashedLines = true,
    showBorder = true
  } = borderStyleConfig;

  const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  group.setAttribute('class', 'grid-lines');

  const halfWidth = Math.round(width / 2) + 0.5;
  const halfHeight = Math.round(height / 2) + 0.5;
  const dashArray = useDashedLines ? '3,3' : undefined;

  // 边框矩形
  if (showBorder) {
    const border = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    border.setAttribute('x', '0');
    border.setAttribute('y', '0');
    border.setAttribute('width', width.toString());
    border.setAttribute('height', height.toString());
    border.setAttribute('fill', 'none');
    border.setAttribute('stroke', borderColor);
    border.setAttribute('stroke-width', (lineWidth * 1.5).toString()); // 边框稍粗一些
    group.appendChild(border);
  }

  // 水平中线
  const horizontalLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  horizontalLine.setAttribute('x1', '0');
  horizontalLine.setAttribute('y1', halfHeight.toString());
  horizontalLine.setAttribute('x2', width.toString());
  horizontalLine.setAttribute('y2', halfHeight.toString());
  horizontalLine.setAttribute('stroke', lineColor);
  horizontalLine.setAttribute('stroke-width', lineWidth.toString());
  if (dashArray) horizontalLine.setAttribute('stroke-dasharray', dashArray);
  group.appendChild(horizontalLine);

  // 垂直中线
  const verticalLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  verticalLine.setAttribute('x1', halfWidth.toString());
  verticalLine.setAttribute('y1', '0');
  verticalLine.setAttribute('x2', halfWidth.toString());
  verticalLine.setAttribute('y2', height.toString());
  verticalLine.setAttribute('stroke', lineColor);
  verticalLine.setAttribute('stroke-width', lineWidth.toString());
  if (dashArray) verticalLine.setAttribute('stroke-dasharray', dashArray);
  group.appendChild(verticalLine);

  // 对角线1（左上到右下）
  const diagonal1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  diagonal1.setAttribute('x1', '0');
  diagonal1.setAttribute('y1', '0');
  diagonal1.setAttribute('x2', width.toString());
  diagonal1.setAttribute('y2', height.toString());
  diagonal1.setAttribute('stroke', lineColor);
  diagonal1.setAttribute('stroke-width', lineWidth.toString());
  if (dashArray) diagonal1.setAttribute('stroke-dasharray', dashArray);
  group.appendChild(diagonal1);

  // 对角线2（右上到左下）
  const diagonal2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  diagonal2.setAttribute('x1', width.toString());
  diagonal2.setAttribute('y1', '0');
  diagonal2.setAttribute('x2', '0');
  diagonal2.setAttribute('y2', height.toString());
  diagonal2.setAttribute('stroke', lineColor);
  diagonal2.setAttribute('stroke-width', lineWidth.toString());
  if (dashArray) diagonal2.setAttribute('stroke-dasharray', dashArray);
  group.appendChild(diagonal2);

  svg.appendChild(group);
};

/**
 * 创建空的米字格并添加到容器中
 * @param containerId 容器ID
 * @param width 宽度
 * @param height 高度
 * @param options 选项
 */
export const createEmptyGridInContainer = (
  containerId: string,
  width: number,
  height: number,
  borderOptions: IDefaultBorderStyleConfig): void => {

  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '';
  const svg = createGridSVG(width, height, borderOptions);
  container.appendChild(svg);
};

/**
 * 创建米字格背景（保持向后兼容）
 * 现在使用统一的createGridSVG函数实现
 * @param container 容器元素
 * @param width 宽度
 * @param height 高度
 * @param options 选项
 * @returns 新创建的SVG元素ID
 */
const createGridBackground = (container: HTMLElement, width: number, height: number, option: IDefaultBorderStyleConfig): string => {
  const svgId = `hanzi-grid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // 使用统一的createGridSVG函数创建SVG
  const svg = createGridSVG(width, height, option);

  // 设置ID和样式（保持向后兼容）
  svg.setAttribute('id', svgId);
  svg.style.display = 'block';
  // svg.style.border = `1px solid ${gridColor}`;  
  svg.style.boxSizing = 'border-box';

  // 将SVG添加到容器
  container.appendChild(svg);

  return svgId;
};

/**
 * 加载本地汉字数据
 * @param character 汉字字符
 * @returns 汉字数据或null
 */
const loadLocalCharacterData = (character: string): any => {
  try {
    // 先检查缓存
    if (localCharacterDataCache.has(character)) {
      return localCharacterDataCache.get(character);
    }

    // 尝试从本地字库加载
    // 注意：在Webpack等构建工具中，动态require可能会导致问题
    // 这里使用try-catch来处理可能的错误
    const characterData = require(`hanzi-writer-data/${character}`);
    localCharacterDataCache.set(character, characterData);
    return characterData;
  } catch (error) {
    console.warn(`本地字库中未找到字符"${character}"，将使用在线数据`);
    return null;
  }
};

/**
 * 在指定容器中渲染汉字，grid-item
 * @param svgId 容器ID
 * @param character 要渲染的汉字
 * @param renderConfig 可选配置项
 * @returns HanziWriter实例
 */
export const renderHanziForItem = (svgId: string, character: string, renderConfig:any) => {
  const { fontStyleConfig, borderStyleConfig,backgroundType} = renderConfig
  // 字体渲染参数
  const _opt = {
    ...defaultOptions,
    ...fontStyleConfig,
  };

  // 获取容器元素
  const container = document.getElementById(svgId);
  if (!container) {
    console.error(`未找到ID为"${svgId}"的容器`);
    return;
  }

  // 字符验证
  if (!character || character.length === 0) {
    console.log('字符为空，渲染为空白米字格');
    // 直接创建空白米字格
    const { width, height } = fontStyleConfig;
    createEmptyGridInContainer(svgId, width, height, borderStyleConfig);
    return;
  }

  // 只取第一个字符
  const str = character.length > 1 ? character[0] : character;
  if (!container) {
    console.error(`未找到ID为"${svgId}"的容器`);
    return;
  }

  try {
    // 统一字体大小计算：直接使用 fontSize 参数
    const fontSize = _opt.fontSize || _opt.width || RENDER_SIZES.grid.width;

    // 创建配置对象
    const writerOptions = {
      ..._opt,
      width: fontSize,
      height: fontSize,
      padding: _opt.padding || RENDER_SIZES.spacing.gridRowPadding,
      charDataLoader: () => { }
    };



    // 如果需要使用本地字库，根据官方API方式设置charDataLoader
    if (useLocalData) {
      writerOptions.charDataLoader = function () {
        // 尝试加载本地数据，如果失败则返回null，让hanzi-writer使用在线数据
        try {
          return loadLocalCharacterData(str);
        } catch (error) {
          console.warn(`加载本地数据失败，将使用在线数据:`, error);
          return null;
        }
      };
    }

    // 检查是否已有writer实例
    if (writerInstances.has(svgId)) {
      const writer = writerInstances.get(svgId);
      if (writer && typeof writer.setCharacter === 'function') {
        // 如果使用了米字格，需要重新创建writer实例
        if (backgroundType === BACKGROUND_TYPE.DOT_GRID) {
          safelyClearContainer(container);
          const targetSvgId = createGridBackground(container, fontSize, fontSize, borderStyleConfig);
          const newWriter = HanziWriter.create(targetSvgId, str, writerOptions);
          writerInstances.set(svgId, newWriter);

          // 为HanziWriter创建的SVG添加统一的T-HZ类名
          setTimeout(() => {
            const targetElement = document.getElementById(targetSvgId);
            if (targetElement) {
              const svgElement = targetElement.querySelector('svg');
              if (svgElement && !svgElement.classList.contains('T-HZ')) {
                svgElement.classList.add('T-HZ');
              }
            }
          }, 0);

          // 暂时不需要动画
          // if (_opt.delayBetweenLoops) {
          //   newWriter.loopCharacterAnimation();
          // }

          return newWriter;
        }

        // 没有使用米字格时，直接更新字符
        writer.setCharacter(str);
        return writer;
      }
    } else {
      safelyClearContainer(container);

      let targetSvgId = svgId;
      // 如果需要米字格，先创建背景
      if (backgroundType === BACKGROUND_TYPE.DOT_GRID) {
        targetSvgId = createGridBackground(container, fontSize, fontSize, borderStyleConfig);
      }

      const writer = HanziWriter.create(targetSvgId, str, writerOptions);
      writerInstances.set(svgId, writer);

      // 为HanziWriter创建的SVG添加统一的T-HZ类名
      setTimeout(() => {
        const targetElement = document.getElementById(targetSvgId);
        if (targetElement) {
          const svgElement = targetElement.querySelector('svg');
          if (svgElement && !svgElement.classList.contains('T-HZ')) {
            svgElement.classList.add('T-HZ');
          }
        }
      }, 0);

      // 暂时不需要动画
      // if (_opt.delayBetweenLoops) {
      //   writer.loopCharacterAnimation();
      // }

      return writer;
    }

  } catch (error) {
    console.error('渲染汉字出错:', error);

    // 降级处理：显示纯文字
    const fallbackFontSize = _opt.fontSize || _opt.width || DEFAULT_CONFIG.renderConfig.fontStyleConfig.fontSize;

    container.innerHTML = `<div style="
      display: flex;
      align-items: center;
      justify-content: center;
      width: ${fallbackFontSize}px;
      height: ${fallbackFontSize}px;
      font-size: ${Math.floor(fallbackFontSize * 0.8)}px;
      color: ${_opt.strokeColor || '#333'};
      font-family: serif;
      border: ${_opt.useGridBackground ? '1px solid ' + (borderStyleConfig.lineColor || DEFAULT_CONFIG.renderConfig.borderStyleConfig.lineColor) : 'none'};
    ">${str}</div>`;

    return null;
  }
};

/**
 * 对指定容器进行遍历渲染
 * @param ContainerId 容器ID
 * @param renderConfig 渲染配置
 */

export const renderHanziInContainer = async (ContainerId: string, renderConfig: IRenderConfig) => {

  const { borderStyleConfig, fontStyleConfig, backgroundType } = renderConfig

  // Steps.1 获取容器
  const container = document.getElementById(ContainerId);
  if (!container) {
    message.error('未找到网格容器');
    return;
  }

  const gridItems = container.querySelectorAll('div[class^="grid-item"]');
  if (gridItems.length === 0) {
    message.warning('没有找到可转换的网格项');
    return;
  }
  // 显示加载状态
  message.loading('正在转换为字帖...', 2);
  // 遍历所有网格项，转换为汉字字帖
  const promises = Array.from(gridItems).map((item, index) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const gridItem = item as HTMLElement;

        const char = gridItem.dataset.font || ''; // 网格对应的汉字
        const originalChar = gridItem.dataset.originalChar || ''; // 网格对应的原始字符

        const isStrokeOrderShadow = gridItem.dataset.isStrokeOrderShadow === 'true';
        const strokeOrderIndex = parseInt(gridItem.dataset.strokeOrder || '0');

        console.log('renderHanziInContainer', char, originalChar,isStrokeOrderShadow,strokeOrderIndex);

        if (!char&& originalChar && isStrokeOrderShadow && strokeOrderIndex > 0) {
          // 展示汉字不存在，原始汉字存在，当前网格是笔画阴影，笔画数大于0，则进行笔画渲染
          // 笔画顺序格子的特殊处理
          console.log('渲染笔画顺序格子', char, strokeOrderIndex);
          
          gridItem.innerHTML = '';
          renderStrokeProgressInContainer(gridItem.id, originalChar, strokeOrderIndex, renderConfig);
        } else if (char) {
          // 展示汉字存在，渲染为普通汉字格子
          gridItem.innerHTML = '';
          renderHanziForItem(gridItem.id, char, renderConfig);
        } else {
          // 目前只有2种类型，其他的均渲染为空格子
          // 空格子，渲染为米字格
          console.log('字符为空,渲染为米字格', char)
          const { width, height } = renderConfig.fontStyleConfig
          createEmptyGridInContainer(
            gridItem.id, width, height, borderStyleConfig)
        }
        resolve();
      }, index * defaultTimes); // 错开执行时间，避免性能问题
    });
  });

  // 等待所有转换完成
  await Promise.all(promises);

  // 隐藏加载状态，显示成功消息
  message.destroy();
  message.success('字帖生成成功');


}

/**
 * 清理HanziWriter资源
 * @param svgId 容器ID
 */
export const cleanupHanziWriter = (svgId: string) => {
  try {
    // 从map中删除实例引用
    if (writerInstances.has(svgId)) {
      const writer = writerInstances.get(svgId);
      // 如果writer有destroy方法，调用它
      if (writer && typeof writer.destroy === 'function') {
        writer.destroy();
      }
      writerInstances.delete(svgId);
    }

    // 获取容器并清空
    const container = document.getElementById(svgId);
    if (container) {
      safelyClearContainer(container);
    }
  } catch (error) {
    console.error('清理HanziWriter资源出错:', error);
  }
};

/**
 * 预加载本地汉字数据到缓存
 * @param characters 要预加载的汉字数组
 */
export const preloadLocalCharacterData = (characters: string[]) => {
  try {
    characters.forEach(char => {
      if (!localCharacterDataCache.has(char)) {
        try {
          // 尝试预加载本地字库数据
          // 注意：动态import在某些环境可能会有限制
          loadLocalCharacterData(char);
        } catch (error) {
          // 预加载失败时静默处理
        }
      }
    });
  } catch (error) {
    // 预加载失败时静默处理
  }
};

// 默认导出
/**
 * 获取汉字的笔画数据
 * @param character 汉字字符
 * @returns 笔画路径数组
 */
export const getCharacterStrokeData = async (character: string): Promise<string[]> => {
  try {
    if (!character || character.length === 0) {
      return [];
    }

    // 先检查全局缓存
    if (strokeDataCache.has(character)) {
      return strokeDataCache.get(character)!;
    }

    let strokes: string[] = [];
    let dataSource = '';

    // 优先尝试本地数据
    const localData = loadLocalCharacterData(character);
    if (localData && localData.strokes) {
      strokes = localData.strokes;
      dataSource = '本地数据';
    } else {
      // 降级到 CDN 数据
      const charData = await HanziWriter.loadCharacterData(character);
      strokes = charData?.strokes || [];
      dataSource = 'CDN数据';
    }

    // 缓存结果
    strokeDataCache.set(character, strokes);

    // 只在首次获取时打印日志
    if (strokes.length > 0) {
      console.log(`首次获取字符"${character}"的笔画数据 (${dataSource}, ${strokes.length}笔)`);
    } else {
      console.warn(`字符"${character}"无笔画数据`);
    }

    return strokes;
  } catch (error) {
    console.warn(`获取字符"${character}"的笔画数据失败:`, error);
    return [];
  }
};

/**
 * 创建单个笔画SVG元素
 * @param strokePaths 笔画路径数组
 * @param size SVG尺寸
 * @param options 配置选项
 * @returns SVG元素
 */
export const createStrokeSVG = (strokePaths: string[], size: number, options: {
  fillColor?: string;
  className?: string;
} = {}): SVGElement => {
  const { fillColor = DEFAULT_CONFIG.renderConfig.fontStyleConfig.strokeColor, className } = options;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

  // 添加统一的hanzi-writer标识类名
  const classes = ['T-HZ'];
  if (className) {
    classes.push(className);
  }
  svg.setAttribute('class', classes.join(' '));
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

  svg.style.width = `${size}px`;
  svg.style.height = `${size}px`;

  const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');

  // 设置变换属性，使字符在指定尺寸下渲染
  const transformData = HanziWriter.getScalingTransform(size, size);
  group.setAttributeNS(null, 'transform', transformData.transform);
  svg.appendChild(group);

  strokePaths.forEach((strokePath: string) => {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttributeNS(null, 'd', strokePath);
    path.style.fill = fillColor;
    group.appendChild(path);
  });

  return svg;
};


// export const renderHanziInContainer = (svgId: string, character: string, options: any = {}) => {





/**
 * 生成笔画数据（通用API）
 * 纯数据生成，不涉及JSX，供模板组件使用
 * hanzi-writer的通用封装方法
 */
export const generateStrokeData = async (
  character: string,
  config: any = {}
): Promise<any> => {
  // 使用默认配置
  const defaultStrokeSize = DEFAULT_CONFIG.renderConfig.fontStyleConfig.fontSize;

  // 定义默认的笔画颜色数组
  const defaultStrokeColors = [
    '#FF6B6B', '#54A0FF', '#5F27CD', 
  ];

  const {
    strokeSize = defaultStrokeSize,
    colorMode = 'single',
    fillColor = DEFAULT_CONFIG.renderConfig.fontStyleConfig.strokeColor,
    radicalColor = DEFAULT_CONFIG.renderConfig.fontStyleConfig.radicalColor,
    customColors,
    includeArrows = true,
    arrowChar = '→'
  } = config;

  // 简单的箭头字体大小计算函数
  const calculateArrowFontSize = (size: number) => {
    return Math.max(8, Math.floor(size / 8));
  };

  if (!character) {
    return {
      character: '',
      strokeCount: 0,
      strokeSVGs: [],
      strokeColors: [],
      includeArrows,
      arrowChar,
      arrowFontSize: calculateArrowFontSize(strokeSize),
      hasError: true,
      errorMessage: '字符不能为空'
    };
  }

  try {
    const strokes = await getCharacterStrokeData(character);

    if (strokes.length === 0) {
      return {
        character,
        strokeCount: 0,
        strokeSVGs: [],
        strokeColors: [],
        includeArrows,
        arrowChar,
        arrowFontSize: calculateArrowFontSize(strokeSize),
        hasError: true,
        errorMessage: '暂无笔画数据'
      };
    }

    const strokeSVGs: string[] = [];
    const strokeColors: string[] = [];

    // 生成每个笔画的SVG数据
    for (let i = 0; i < strokes.length; i++) {
      const strokesPortion = strokes.slice(0, i + 1);

      // 根据颜色模式创建SVG
      let strokeSVG: SVGElement;

      if (colorMode === 'stroke') {
        // 每个笔画不同颜色模式：需要为每一笔设置不同颜色
        // 第1个SVG：第1笔用颜色a
        // 第2个SVG：第1笔用颜色a，第2笔用颜色b
        // 第3个SVG：第1笔用颜色a，第2笔用颜色b，第3笔用颜色c
        strokeSVG = createMultiColorStrokeSVG(strokesPortion, strokeSize, defaultStrokeColors);

        // 记录当前SVG包含的所有笔画颜色
        const currentStrokeColors = strokesPortion.map((_, index) => {
          if (index < defaultStrokeColors.length) {
            // 在颜色数组范围内，使用对应颜色
            return defaultStrokeColors[index];
          } else {
            // 超出颜色数组范围，使用默认填充颜色
            return fillColor;
          }
        });
        strokeColors.push(currentStrokeColors.join(','));
      } else {
        // 其他颜色模式：统一颜色
        let currentColor: string;
        switch (colorMode) {
          case 'radical':
            // TODO: 实现偏旁部首颜色逻辑，暂时使用默认颜色
            currentColor = radicalColor || fillColor;
            break;
          case 'custom':
            // 使用自定义颜色数组
            currentColor = customColors && customColors.length > 0
              ? customColors[i % customColors.length]
              : fillColor;
            break;
          case 'single':
          default:
            // 单一颜色模式
            currentColor = fillColor;
            break;
        }

        strokeColors.push(currentColor);

        // 创建单色笔画SVG
        strokeSVG = createStrokeSVG(strokesPortion, strokeSize, {
          fillColor: currentColor
        });
      }

      strokeSVGs.push(strokeSVG.outerHTML);
    }

    return {
      character,
      strokeCount: strokes.length,
      strokeSVGs,
      strokeColors,
      includeArrows,
      arrowChar,
      arrowFontSize: calculateArrowFontSize(strokeSize),
      hasError: false
    };
  } catch (error) {
    console.warn(`生成笔画数据失败:`, error);
    return {
      character,
      strokeCount: 0,
      strokeSVGs: [],
      strokeColors: [],
      includeArrows,
      arrowChar,
      arrowFontSize: calculateArrowFontSize(strokeSize),
      hasError: true,
      errorMessage: '笔画加载失败'
    };
  }
};

/**
 * 在指定容器中渲染汉字的笔画进度
 * @param containerId 容器ID
 * @param character 汉字字符
 * @param strokeCount 要显示的笔画数量（1表示显示第1笔，2表示显示第1+2笔）
 * @param renderConfig 渲染选项
 */
export const renderStrokeProgressInContainer = async (
  containerId: string,
  character: string,
  strokeCount: number,
  renderConfig: any = {}
): Promise<void> => {
  // 添加默认值，确保对象存在
  const { 
    fontStyleConfig = DEFAULT_CONFIG.renderConfig.fontStyleConfig,
    borderStyleConfig = DEFAULT_CONFIG.renderConfig.borderStyleConfig,
    backgroundType = DEFAULT_CONFIG.renderConfig.backgroundType 
  } = renderConfig;

  const container = document.getElementById(containerId);
  if (!container) {
    console.warn(`容器 ${containerId} 不存在`);
    return;
  }

  try {
    // 获取笔画数据
    const strokes = await getCharacterStrokeData(character);
    if (strokes.length === 0 || strokeCount <= 0) {
      // 如果没有笔画数据或笔画数量为0，渲染空的米字格
      // 兜底用
      createEmptyGridInContainer(
        containerId,
        fontStyleConfig.width || DEFAULT_CONFIG.renderConfig.fontStyleConfig.width,
        fontStyleConfig.height || DEFAULT_CONFIG.renderConfig.fontStyleConfig.height,
        borderStyleConfig
      );
      return;
    }

    // 限制笔画数量不超过实际笔画数
    const actualStrokeCount = Math.min(strokeCount, strokes.length);
    const strokesPortion = strokes.slice(0, actualStrokeCount);

    // 清空容器
    safelyClearContainer(container);
    const { lineWidth } = borderStyleConfig;

    // 创建SVG容器
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', (fontStyleConfig.width || DEFAULT_CONFIG.renderConfig.fontStyleConfig.width).toString());
    svg.setAttribute('height', (fontStyleConfig.height || DEFAULT_CONFIG.renderConfig.fontStyleConfig.height).toString());
    svg.setAttribute('class', 'T-HZ stroke-progress');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

    // 添加米字格背景
    if (backgroundType === BACKGROUND_TYPE.DOT_GRID) {
      addGridLinesToSVG(
        svg,
        fontStyleConfig.width || DEFAULT_CONFIG.renderConfig.fontStyleConfig.width,
        fontStyleConfig.height || DEFAULT_CONFIG.renderConfig.fontStyleConfig.height,
        borderStyleConfig);
    }

    // 创建笔画SVG并添加到容器
    const strokeSVG = createStrokeSVG(
      strokesPortion,
      fontStyleConfig.width || DEFAULT_CONFIG.renderConfig.fontStyleConfig.width,
      {
        fillColor: fontStyleConfig.strokeColor || DEFAULT_CONFIG.renderConfig.fontStyleConfig.strokeColor
      }
    );

    // 将笔画路径添加到主SVG中
    const strokeGroup = strokeSVG.querySelector('g');
    if (strokeGroup) {
      svg.appendChild(strokeGroup.cloneNode(true));
    }

    container.appendChild(svg);
  } catch (error) {
    console.error(`渲染笔画进度失败:`, error);
    // 出错时渲染空的米字格，确保使用默认配置
    createEmptyGridInContainer(
      containerId,
      fontStyleConfig?.width || DEFAULT_CONFIG.renderConfig.fontStyleConfig.width,
      fontStyleConfig?.height || DEFAULT_CONFIG.renderConfig.fontStyleConfig.height,
      borderStyleConfig,
    );
  }
};

export default {
  renderHanziInContainer,
  renderHanziForItem,
  cleanupHanziWriter,
  preloadLocalCharacterData,
  safelyClearContainer,
  getCharacterStrokeData,
  createStrokeSVG,
  createMultiColorStrokeSVG,
  generateStrokeData,
  renderStrokeProgressInContainer
};