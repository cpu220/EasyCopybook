/**
 * 这个文件用于总结 DEFAULT_CONFIG ， 不参与实际代码运行
 */
 
// 
/**
 * 背景类型枚举
 */
export const enum BACKGROUND_TYPE {
    NONE = 'none', // 没有背景
    DOT_GRID = 'dotGrid', // 米字格
    SQUARE_GRID = 'squareGrid', // 田字格
}


/**
 * AI字帖模板配置接口
 * 完全映射DEFAULT_CONFIG的结构，包含详细的字段说明和限制
 */
export interface IAITemplate {
  /** 
   * 模板配置 - 控制字帖的布局和显示内容
   */
  templateConfig: {
    /** 
     * 列数 - 每行显示多少个字符格子
     * 限制: 1-20之间的整数
     * 默认: 10
     */
    column: number;
    
    /** 
     * 每个字占几行 - 控制单个汉字的垂直占用空间
     * 限制: 1-5之间的整数
     * 默认: 1
     */
    wordsPerRow: number;
    
    /** 
     * 一行几个字 - 控制每行实际显示的汉字数量
     * 限制: 1-10之间的整数
     * 默认: 1
     */
    wordsPreCol: number;
    
    /** 
     * 是否展示拼音 - 控制是否在汉字上方显示拼音
     * 默认: true
     */
    pinyin: boolean;
    
    /** 
     * 是否展示笔画阴影 - 控制是否在米字格内显示笔画轮廓
     * 默认: true
     */
    showStrokeOrderShadow: boolean;
    
    /** 
     * 展示几笔 - 当showStrokeOrderShadow为true时，控制显示前几笔
     * 限制: 1-20之间的整数
     * 默认: 3
     */
    strokeNumber: number;
    
    /** 
     * 是否展示笔画顺序 - 控制是否在顶部区域显示完整笔画顺序
     * 默认: true
     */
    showStrokeOrder: boolean;
  };
  
  /** 
   * 渲染配置 - 控制字帖的视觉样式和渲染效果
   */
  renderConfig: {
    /** 
     * 字体样式配置 - 控制汉字的渲染样式
     */
    fontStyleConfig: {
      /** 
       * 格子宽度 - 每个字符格子的宽度(像素)
       * 限制: 20-200之间的整数
       * 默认: 60
       */
      width: number;
      
      /** 
       * 格子高度 - 每个字符格子的高度(像素)
       * 限制: 20-200之间的整数
       * 默认: 60
       */
      height: number;
      
      /** 
       * 字体大小 - 汉字的字体大小(像素)
       * 限制: 12-150之间的整数
       * 默认: 60
       */
      fontSize: number;
      
      /** 
       * 笔画宽度 - 汉字笔画的线条宽度
       * 限制: 1-10之间的数字
       * 默认: 3
       */
      strokeWidth: number;
      
      /** 
       * 笔画颜色 - 汉字笔画的颜色
       * 限制: 有效的CSS颜色值(如#000000, rgb(0,0,0), red等)
       * 默认: "#b8b8b8"
       */
      strokeColor: string;
      
      /** 
       * 偏旁颜色 - 汉字偏旁部分的颜色
       * 限制: 有效的CSS颜色值
       * 默认: "#3889f2"
       */
      radicalColor: string;
      
      /** 
       * 内边距 - 汉字在格子内的内边距(像素)
       * 限制: 0-20之间的整数
       * 默认: 5
       */
      padding: number;
      
      /** 
       * 渲染模式 - 汉字的渲染方式
       * 限制: "normal" | "animation" | "stroke"
       * 默认: "stroke"
       */
      renderMode: string;
      
      /** 
       * 显示汉字轮廓 - 是否显示汉字的外轮廓线
       * 默认: false
       */
      showOutline: boolean;
      
      /** 
       * 字体大小比例 - 相对于格子大小的字体缩放比例
       * 限制: 0.1-2.0之间的数字
       * 默认: 1
       */
      fontSizeRatio: number;
      
      /** 
       * 显示边框 - 是否显示字符格子的边框
       * 默认: true
       */
      showBorder: boolean;
    };
    
    /** 
     * 边框样式配置 - 控制格子边框的样式
     */
    borderStyleConfig: {
      /** 
       * 显示边框 - 是否显示格子边框
       * 默认: true
       */
      showBorder: boolean;
      
      /** 
       * 使用虚线边框 - 是否使用虚线样式的边框
       * 默认: true
       */
      useDashedLines: boolean;
      
      /** 
       * 背景颜色 - 格子的背景颜色
       * 限制: 有效的CSS颜色值或"none"
       * 默认: "none"
       */
      backgroundColor: string;
      
      /** 
       * 边框线宽 - 边框线条的宽度(像素)
       * 限制: 0.5-5之间的数字
       * 默认: 1
       */
      lineWidth: number;
      
      /** 
       * 线条颜色 - 格子内辅助线的颜色
       * 限制: 有效的CSS颜色值
       * 默认: "#ddd"
       */
      lineColor: string;
      
      /** 
       * 边框颜色 - 格子边框的颜色
       * 限制: 有效的CSS颜色值
       * 默认: "#ddd"
       */
      borderColor: string;
      
      /** 
       * 虚线边框 - 是否使用虚线边框样式
       * 默认: false
       */
      borderDash: boolean;
    };
    
    /** 
     * 背景类型 - 格子内的辅助线类型
     * 限制: BACKGROUND_TYPE.NONE | BACKGROUND_TYPE.DOT_GRID | BACKGROUND_TYPE.SQUARE_GRID
     * - NONE: 无辅助线
     * - DOT_GRID: 米字格(十字交叉线)
     * - SQUARE_GRID: 田字格(四等分网格)
     * 默认: BACKGROUND_TYPE.DOT_GRID
     */
    backgroundType: BACKGROUND_TYPE;
  };
  
  /** 
   * 字库配置 - 控制要练习的汉字内容
   */
  fontLibrary: {
    /** 
     * 字库名称 - 字库的显示名称
     * 限制: 1-50个字符的字符串
     */
    name: string;
    
    /** 
     * 字库编码 - 字库的唯一标识符
     * 限制: 非负整数
     */
    code: number;
    
    /** 
     * 字符列表 - 要练习的汉字字符串
     * 限制: 1-1000个汉字字符
     * 注意: 只支持常用汉字，特殊字符可能无法正确渲染
     */
    list: string;
    
    /** 
     * 是否选中 - 标识该字库是否被选中使用
     * 默认: true
     */
    select?: boolean;
  };
}

/**
 * AI生成请求参数
 * 用于向AI描述字帖生成需求
 */
export interface IAIGenerateRequest {
  /** 
   * 需求描述 - 对字帖需求的自然语言描述
   * 示例: "适合小学三年级学生的汉字练习字帖"
   */
  description: string;
  
  /** 
   * 目标年级 - 字帖的目标使用年级
   * 限制: "幼儿园" | "1年级" | "2年级" | "3年级" | "4年级" | "5年级" | "6年级" | "初中" | "高中" | "成人"
   * 影响: 不同年级会自动调整字体大小、列数等参数
   */
  grade?: string;
  
  /** 
   * 使用场景 - 字帖的使用场景
   * 限制: "练习" | "考试" | "书法" | "启蒙" | "复习"
   * 影响: 不同场景会调整显示内容和样式
   */
  scenario?: string;
  
  /** 
   * 自定义字符 - 要练习的具体汉字
   * 限制: 1-1000个汉字字符
   * 注意: 如果提供此参数，将覆盖默认的字库内容
   */
  characters?: string;
}

/**
 * AI生成响应
 * AI模板生成的结果
 */
export interface IAIGenerateResponse {
  /** 
   * 是否成功 - 标识生成是否成功
   */
  success: boolean;
  
  /** 
   * 生成的模板 - 成功时返回的完整模板配置
   */
  template?: IAITemplate;
  
  /** 
   * 错误信息 - 失败时的错误描述
   */
  error?: string;
}