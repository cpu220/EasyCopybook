/**
 * 用于表单相关的类型声明
 */



/**
 * 字库接口,用于字体选择
 */
export interface IFontLibraryItem {
  /** 字库名称 */
  name: string;
  /**
   * 字库编码,用于区分不同的字库
   */
  code:number;
  /** 字符列表 */
  list: string;
  /** 是否选中 */
  select?: boolean;
}


