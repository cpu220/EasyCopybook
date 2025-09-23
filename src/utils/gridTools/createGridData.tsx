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

    // 1排1个字：每个字单独占一行
    if (wordsPerRow === 1 && wordsPreCol === 1) {
        return Math.ceil(strLength / 1);
    }
    
    // 1排column个字：所有格子都显示对应的汉字
    if (wordsPerRow === 1 && wordsPreCol === column) {
        return Math.ceil(strLength / column);
    }
    
    // 2排一个字：每个字占2行
    if (wordsPerRow === 2 && wordsPreCol === 1) {
        return Math.ceil(strLength * 2 / 1);
    }
    
    // 3排一个字：每个字占3行
    if (wordsPerRow === 3 && wordsPreCol === 1) {
        return Math.ceil(strLength * 3 / 1);
    }
    
    // 4排一个字：每个字占4行
    if (wordsPerRow === 4 && wordsPreCol === 1) {
        return Math.ceil(strLength * 4 / 1);
    }
    
    // 一排2个字：每排显示2个汉字，中间有空格
    if (wordsPerRow === 1 && wordsPreCol === 2) {
        return Math.ceil(strLength / 2);
    }
    
    // 默认情况
    return Math.ceil(strLength / column);
}




/**
 * 格式化字符信息魏表格所需要的二维数组
 * @param str 输入的字符串
 * @param column 列数
 * @returns 二维数组，每个元素是一个字符
 */
export const formatGridData = (str: string, templateConfig: IDefaultTemplateConfig) => {
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
 * @param templateConfig 模板配置
 * @returns 二维数组，每个元素是一个字符
 */
function createCharArray(str: string, templateConfig: IDefaultTemplateConfig): IFontItem[][] {
    
    const { column, wordsPerRow, wordsPreCol } = templateConfig;
    
    const result: IFontItem[][] = [];
    const strLength = str.length;

    // 1排1个字：一排只有首格展示汉字，其他全是空格
    if (wordsPerRow === 1 && wordsPreCol === 1) {
        for (let i = 0; i < strLength; i++) {
            const rowItem: IFontItem[] = [];
            // 首格显示汉字，其他显示空字符串
            rowItem.push({ char: str[i] });
            for (let j = 1; j < column; j++) {
                rowItem.push({ char: '' });
            }
            result.push(rowItem);
        }
    }
    
    // 1排column个字：所有格子都显示对应的汉字
    else if (wordsPerRow === 1 && wordsPreCol === column) {
        const rows = Math.ceil(strLength / column);
        for (let i = 0; i < rows; i++) {
            const rowItem: IFontItem[] = [];
            for (let j = 0; j < column; j++) {
                const index = i * column + j;
                rowItem.push({
                    char: index < strLength ? str[index] : ''
                });
            }
            result.push(rowItem);
        }
    }
    
    // 2排一个字：2排首格都是同一个字，后面都是空格
    else if (wordsPerRow === 2 && wordsPreCol === 1) {
        for (let i = 0; i < strLength; i++) {
            // 第一排
            const row1: IFontItem[] = [{ char: str[i] }];
            for (let j = 1; j < column; j++) {
                row1.push({ char: '' });
            }
            result.push(row1);
            
            // 第二排
            const row2: IFontItem[] = [{ char: str[i] }];
            for (let j = 1; j < column; j++) {
                row2.push({ char: '' });
            }
            result.push(row2);
        }
    }
    
    // 3排一个字：3排首格都是同一个字，后面都是空格
    else if (wordsPerRow === 3 && wordsPreCol === 1) {
        for (let i = 0; i < strLength; i++) {
            // 生成3排
            for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
                const rowItem: IFontItem[] = [{ char: str[i] }];
                for (let j = 1; j < column; j++) {
                    rowItem.push({ char: '' });
                }
                result.push(rowItem);
            }
        }
    }
    
    // 4排一个字：4排首格都是同一个字，后面都是空格
    else if (wordsPerRow === 4 && wordsPreCol === 1) {
        for (let i = 0; i < strLength; i++) {
            // 生成4排
            for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
                const rowItem: IFontItem[] = [{ char: str[i] }];
                for (let j = 1; j < column; j++) {
                    rowItem.push({ char: '' });
                }
                result.push(rowItem);
            }
        }
    }
    
    // 一排2个字：2个字分一排，第一个格子展示对应的汉字，后面跟column/2 -1 个空格，第 column/2 +1 展示第2个要展示的汉字，后面跟column/2 -1 个空格
    else if (wordsPerRow === 1 && wordsPreCol === 2) {
        const halfColumn = Math.floor(column / 2);
        for (let i = 0; i < strLength; i += 2) {
            const rowItem: IFontItem[] = [];
            
            // 第一个字
            if (i < strLength) {
                rowItem.push({ char: str[i] });
            } else {
                rowItem.push({ char: '' });
            }
            
            // 添加第一个字后面的空格
            for (let j = 1; j < halfColumn; j++) {
                rowItem.push({ char: '' });
            }
            
            // 第二个字
            if (i + 1 < strLength) {
                rowItem.push({ char: str[i + 1] });
            } else {
                rowItem.push({ char: '' });
            }
            
            // 添加第二个字后面的空格（补齐整行）
            for (let j = rowItem.length; j < column; j++) {
                rowItem.push({ char: '' });
            }
            
            result.push(rowItem);
        }
    }
    
    // 默认情况
    else {
        const rows = calculateRows({
            str, 
            column,
            wordsPerRow, 
            wordsPreCol
        });
        
        for (let i = 0; i < rows; i++) {
            const start = i * column;
            const end = Math.min(start + column, str.length);
            const rowItem: IFontItem[] = [];
            
            for (let j = 0; j < column; j++) {
                const index = start + j;
                rowItem.push({
                    char: index < strLength ? str[index] : ''
                });
            }
            
            result.push(rowItem);
        }
    }

    return result;
}

