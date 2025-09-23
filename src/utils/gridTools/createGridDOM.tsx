/**
 * 用于 根据 json， 创建 grid DOM 的方法合集
 */

// import React from 'react';

import { IFontItem, IDefaultTemplateConfig } from '@/interface';
import { formatGridData } from './createGridData';
import gridStyles from '@/pages/content/components/gridTemplate/baseGrid/index.less'


const cellClassName = gridStyles['grid-item']
const rowClassName = gridStyles['grid-row']
const rowTipClassName = gridStyles['grid-row-tip-container']





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
const createGridRow = ({ arr, row, templateConfig, char }: {
    arr: IFontItem[],
    row: number,
    templateConfig: IDefaultTemplateConfig,
    char: string
}) => {
    const { pinyin, showStroke, strokeNumber, showStrokeOrder } = templateConfig;


    const resultDOM = []

    for (let x = 0; x < arr.length; x++) {
        const item: IFontItem = arr[x]
        const itemDOM = createGridItem(item, row, x)
        resultDOM.push(itemDOM)
    }
    const key = `grid-row-${row}`

    let tipDOM = null;
    let pinyinDOM = null
    let strokeOrderDOM = null
    if (pinyin) {
        // pinyinDOM = getPinYin()
        pinyinDOM = <div className={gridStyles['grid-row-pinyin']}>pinyin</div>
    }

    if (showStrokeOrder) {
        // strokeOrderDOM = getStrokeOrder(char)
        strokeOrderDOM = <div className={gridStyles['grid-row-storke']}>笔画顺序</div>
    }


    if(pinyin || showStrokeOrder){
        tipDOM = (
            <div id={`${key}-tips-container`} className={rowTipClassName}>
                {pinyinDOM}
                {strokeOrderDOM}
            </div>
        )
    } 
    

    return (
        <div key={key} id={key} className={rowClassName}>
            {tipDOM} 
            <div id={`${key}-item-container`} className={gridStyles['grid-row-item-container']}>
                {resultDOM}
            </div>

        </div>
    )
}

/**
 * 创建网格 网格项数组
 * @returns 
 */
export const createGrid = (list: string, templateConfig: IDefaultTemplateConfig) => {

    const arr = formatGridData(list, templateConfig)

    const result = []

    for (let y = 0; y < arr.length; y++) {
        // 行元素 
        const rowDOM = createGridRow({
            arr: arr[y],
            row: y,
            templateConfig,
            char: arr[y][0].char
        })
        result.push(rowDOM)
    }

    return (
        <>
            {result}
        </>
    )

}