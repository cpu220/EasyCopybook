import React from 'react';


import { IFontItem } from '@/interface';






// 计算行数的通用方法
function calculateRows(strLength: number, column: number): number {
    return Math.ceil(strLength / column);
}

// 构建二维数组的方法
function createCharArray(str: string, row: number, column: number): IFontItem[][] {

    const result: IFontItem[][] = [];
    let i = 0;
    for (let x = 0; x < row; x += 1) {
        const rowItem: IFontItem[] = []
        for (let y = 0; y < column; y += 1) {
            // 创建单个网格对象
            const fontItem = {
                char: str[i++]
            }
            rowItem.push(fontItem)
        }
        result.push(rowItem)
    }
    return result;
}


/**
 * 格式化字符信息魏表格所需要的二维数组
 * @param str 输入的字符串
 * @param column 列数
 * @returns 二维数组，每个元素是一个字符
 */
export const formatGridData = (str: string, column: number) => {

    // step。1  计算行数
    const row = calculateRows(str.length, column)
    // step.2  创建字符数组
    const charArr = createCharArray(str, row, column)

    return charArr
}

