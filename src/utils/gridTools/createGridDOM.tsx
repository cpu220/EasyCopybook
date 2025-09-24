/**
 * 用于 根据 json， 创建 grid DOM 的方法合集
 */

// import React from 'react';

import { IFontItem, IDefaultTemplateConfig } from '@/interface';
import { formatGridData } from './createGridData';
import TipsContainer from '@/pages/content/components/gridTemplate/tipsContainer';
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
    
    // 如果是笔画顺序格子，需要特殊处理
    if (item.isStrokeOrderShadow && item.originalChar && item.strokeOrderIndex) {
        // debugger
        return (
            <div
                id={key}
                key={key}
                data-font={item.char}
                data-original-char={item.originalChar}
                data-stroke-order={item.strokeOrderIndex}
                data-is-stroke-order-shadow="true"
                className={cellClassName}>
                {/* 笔画顺序格子内容为空，由渲染引擎处理 */}
            </div>
        )
    }
    
    // 普通格子的处理逻辑
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
    const { pinyin,  showStrokeOrder } = templateConfig;


    const resultDOM = []

    for (let x = 0; x < arr.length; x++) {
        const item: IFontItem = arr[x]
        const itemDOM = createGridItem(item, row, x)
        resultDOM.push(itemDOM)
    }
    const key = `grid-row-${row}`

    let tipDOM = null;

    // 使用TipsContainer组件封装拼音和笔画顺序展示
    if (pinyin || showStrokeOrder) {
        tipDOM = (
            <TipsContainer
                id={`${key}-tips-container`}
                char={char}
                showPinyin={pinyin}
                showStrokeOrder={showStrokeOrder}
                pinyinConfig={{ withTone: true }}
                strokeOrderConfig={{ className: gridStyles['grid-row-storke'] }}
            />
        );
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
export const createGrid = (list: string, templateConfig: IDefaultTemplateConfig, charStrokeCounts?: Map<string, number>) => {

    const arr = formatGridData(list, templateConfig, charStrokeCounts)
    console.log('createGrid', arr)
    // 检查arr是否为空数组或undefined
    if (!arr || arr.length === 0) {
        console.warn('No data to create grid');
        return null;
    }
    
    const result = []

    for (let y = 0; y < arr.length; y++) {
        // 行元素 
        const rowData = arr[y];
        
        // 检查当前行是否为空数组
        if (!rowData || rowData.length === 0) {
            continue;
        }
        
        // 确保有第一个字符
        const firstChar = rowData[0]?.char || '';
        
        const rowDOM = createGridRow({
            arr: rowData,
            row: y,
            templateConfig,
            char: firstChar
        })
        result.push(rowDOM)
    }

    return (
        <>
            {result}
        </>
    )

}