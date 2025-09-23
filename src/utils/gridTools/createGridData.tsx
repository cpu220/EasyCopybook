/**
 * 根据配置项，常见出字帖模板的二维数组
 */



import { IFontItem,IDefaultTemplateConfig } from '@/interface';


interface IcalculateRows{
    str: string,
    column: number,
    wordsPerRow: number,
    wordsPreCol: number,
}

// 暂定目前只有 1排1个字，1排column个字， 2排一个字,3排一个字,4排一个字  5种情况

// 计算行数的通用方法
function calculateRows({str, column, wordsPerRow, wordsPreCol}: IcalculateRows): number {
    
    const strLength = str.length;

    let _column = column;

    // if(wordsPreCol === 1){
    //     _column = wordsPerRow;
    // }

    return Math.ceil(strLength / _column);
}




/**
 * 格式化字符信息魏表格所需要的二维数组
 * @param str 输入的字符串
 * @param column 列数
 * @returns 二维数组，每个元素是一个字符
 */
export const formatGridData = (str: string, templateConfig: any) => {
    const { column, wordsPerRow, wordsPreCol } = templateConfig
    // step。1  计算行数
    // const row = calculateRows(str.length, column)
    // step.2  创建字符数组
    const charArr = createCharArray(str,  templateConfig)
    //  返回格式化后的二维数组
    return charArr
}


/**
 * 构建二维数组的方法
 * @param str 输入的字符串
 * @param column 列数
 * @returns 二维数组，每个元素是一个字符
 */
function createCharArray(str: string, templateConfig: IDefaultTemplateConfig): IFontItem[][] {
    
    const { column, wordsPerRow, wordsPreCol } = templateConfig;
    
    const result: IFontItem[][] = [];

    const rows = calculateRows({
        str, 
        column,
        wordsPerRow, 
        wordsPreCol
    })

    for (let i = 0; i < rows; i++) {
        const start = i * column;
        const end = Math.min(start + column, str.length);
        const rowItem: IFontItem[] = [];

        for (let j = start; j < end; j++) {
            const fontItem = {
                char: str[j],

            };
            rowItem.push(fontItem);
        }

        result.push(rowItem);
    }

    return result;
}

