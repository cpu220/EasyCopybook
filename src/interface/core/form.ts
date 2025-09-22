/**
 * 用于表单相关的类型声明
 */



/**
 * 字库接口,用于字体选择
 */
export interface IFontLibrary {
  /** 字库名称 */
  name: string;
  /** 字符列表 */
  list: string;
  /** 是否选中 */
  select?: boolean;
}


