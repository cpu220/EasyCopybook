
/**
 * 用于将输入的字符进行非法字符过滤
 * @param text 输入的字符串
 * @returns 清除空格后的字符串
 */
export const clearStringForLibrary = (text: string) => {
 return text.replace(/[^\u4e00-\u9fff]/g, '');
}