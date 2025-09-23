/**
 * 用于 根据 json， 创建 grid DOM 的方法合集
 */

// import React from 'react';

import { IFontItem } from '@/interface';
import { formatGridData } from './createGridData';
import gridStyles from '@/pages/content/components/gridTemplate/baseGrid/index.less'


const cellClassName = gridStyles['grid-item']
const rowClassName = gridStyles['grid-row']




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
export const createGrid = (list: string, templateConfig: any) => {

    const arr = formatGridData(list, templateConfig)

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