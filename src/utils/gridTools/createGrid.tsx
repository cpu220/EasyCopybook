import React from 'react'; 

import { IFontItem } from '@/interface';

import gridStyles from '@/pages/content/components/gridTemplate/baseGrid/index.less'


const cellClassName = gridStyles['grid-item']
const rowClassName = gridStyles['grid-row']



// 计算行数的通用方法
function calculateRows(strLength: number, column: number): number { 
   
    return Math.ceil(strLength / column);
}


// 构建二维数组的方法
function createCharArray(str: string, column: number): IFontItem[][] {
    const result: IFontItem[][] = [];
    const rows = Math.ceil(str.length / column);

    for (let i = 0; i < rows; i++) {
        const start = i * column;
        const end = Math.min(start + column, str.length);
        const rowItem: IFontItem[] = [];

        for (let j = start; j < end; j++) {
            const fontItem = {
                char: str[j]
            };
            rowItem.push(fontItem);
        }

        result.push(rowItem);
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
    // const row = calculateRows(str.length, column)
    // step.2  创建字符数组
    const charArr = createCharArray(str, column)
    //  返回格式化后的二维数组
    return charArr
}

// baseGrid 模版
/**
     * 创建网格项 单项
     * @param item 字体项
     * @param row 行索引
     * @param col 列索引
     * @returns 
     */
const createGridItem = (item: IFontItem, row: number, col: number) => {
    const key = `grid-item-${row}-${col}`
    // console.log('createGridItem', key)
    return (
        <div
            id={key}
            key={key}
            data-font={item.char}
            className={cellClassName}>
            {item.char}
        </div>
    )
}


/**
 * 创建网格行 行
 * @param arr 行数据
 * @param row 行索引
 * @returns 
 */
const createGridRow = (arr: IFontItem[], row: number) => {

    const resultDOM = []

    for (let x = 0; x < arr.length; x++) {
        const item: IFontItem = arr[x]
        const itemDOM = createGridItem(item, row, x)
        resultDOM.push(itemDOM)
    }
    const key = `grid-row-${row}`
    // console.log('createGridRow', key)
    return (
        <div key={key} id={key} className={rowClassName}>
            {resultDOM}
        </div>
    )
}

    /**
     * 创建网格 网格项数组
     * @returns 
     */
export const createGrid = (list: string, column: number) => {

    const arr = formatGridData(list, column)

    const result = []

    for (let y = 0; y < arr.length; y++) {
        // 行元素 
        const rowDOM = createGridRow(arr[y], y)
        result.push(rowDOM)
    }

    return (
        <>
            {result}
        </>
    )

}