import { IPoetryItem } from '@/interface/poetry';
/**
 * 用于将输入的字符进行非法字符过滤
 * @param text 输入的字符串
 * @returns 清除空格后的字符串
 */
export const clearStringForLibrary = (text: string) => {
    return text.replace(/[^\u4e00-\u9fff]/g, '');
}

export const removeDuplicates = (str: string) => {
    return Array.from(new Set(str)).join('');
}

/**
 * 将诗词数据转换为字符串和textarea格式
 * @param jsonItem 诗词数据
 * @returns 
 */
export const poetryJsonToString = (jsonItem: IPoetryItem):{
    str: string;
    textarea: string;
} => {

    const { title, dynasty, author, content } = jsonItem;
    let contentStr = ''
    content.map((line: string, index: number) => {
        if (index % 2 === 0) {
            contentStr += line + ' '
        } else {
            contentStr += line + '\n';

        }
    })

    const textarea = `${title}\n${dynasty}  ${author}\n${contentStr}`;
    const str = removeDuplicates(`${title}${dynasty}${author}${content.join('')}`);
    return {
        str,
        textarea
    }
}

/**
 * 诗词数据结构接口
 */
export interface PoetryData {
    id?: string;
    title: string;
    dynasty: string;
    author: string;
    content: string | string[];
    type?: string;
}

/**
 * 解析字体库内容，如果是JSON格式的诗词数据则提取纯文本内容
 * @param fontLibraryContent 字体库内容，可能是普通字符串或JSON格式的诗词数据
 * @returns 处理后的纯汉字字符串
 */
export const parseFontLibraryContent = (fontLibraryContent: string): string => {
    if (!fontLibraryContent) {
        return '';
    }

    // 判断是否为JSON字符串
    if (typeof fontLibraryContent === 'string' && fontLibraryContent.trim().startsWith('{')) {
        try {
            // 尝试解析JSON格式的诗词数据
            const parsedData: PoetryData = JSON.parse(fontLibraryContent);

            if (parsedData.content) {
                let contentText = '';

                // 如果有content字段，将其转换为字符串
                if (Array.isArray(parsedData.content)) {
                    contentText = parsedData.content.join('');
                } else {
                    contentText = parsedData.content;
                }

                // 过滤所有非汉字字符并返回
                return clearStringForLibrary(contentText);
            }
        } catch (e) {
            console.warn('解析字体库内容失败，使用原始内容:', e);
        }
    }

    // 如果不是JSON格式或解析失败，直接过滤非汉字字符
    return clearStringForLibrary(fontLibraryContent);
}

/**
 * 根据诗词ID从诗词库中获取诗词数据并转换为JSON字符串
 * @param poetryId 诗词ID
 * @param poetryLibrary 诗词库数组
 * @returns JSON格式的诗词数据字符串，如果未找到则返回空字符串
 */
export const getPoetryJsonById = (poetryId: string, poetryLibrary: PoetryData[]): string => {
    if (!poetryId || !poetryLibrary) {
        return '';
    }

    const poetry = poetryLibrary.find((item: PoetryData) => item.id === poetryId);

    if (poetry) {
        return JSON.stringify(poetry);
    }

    return '';
}

/**
 * 检查字符串是否为诗词JSON格式
 * @param str 要检查的字符串
 * @returns 如果是诗词JSON格式返回true，否则返回false
 */
export const isPoetryJson = (str: string): boolean => {
    if (!str || typeof str !== 'string') {
        return false;
    }

    try {
        const parsed = JSON.parse(str);
        // 检查是否包含诗词数据的基本字段
        return parsed &&
            typeof parsed.title === 'string' &&
            typeof parsed.author === 'string' &&
            (typeof parsed.content === 'string' || Array.isArray(parsed.content));
    } catch (e) {
        return false;
    }
}