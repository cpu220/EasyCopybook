/**
 * 基础网格布局
 */


import react, { useEffect } from 'react'
import { useModel } from 'umi';
import { formatGridData } from '@/utils'
import { IFontItem } from '@/interface'

import styles from './index.less'


const BaseGrid: React.FC = () => {

    const { fontList } = useModel('CONTENT');

    useEffect(() => {
        console.log('fontList', fontList);
    }, [fontList]);


    /**
     * 创建网格项 单项
     * @param item 字体项
     * @param row 行索引
     * @param col 列索引
     * @returns 
     */
    const createGridItem = (item: IFontItem, row: number, col: number) => {
        const key = `grid-item-${row}-${col}`
        console.log('createGridItem', key)
        return (
            <div id={key} key={key} className={styles['grid-item']}>
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
        console.log('createGridRow', key)
        return (
            <div key={key} id={key} className={styles['grid-row']}>
                {resultDOM}
            </div>
        )
    }

    /**
     * 创建网格 网格项数组
     * @returns 
     */
    const createGrid = (list: string) => {

        const arr = formatGridData(list, 10)

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

    return (
        <div id="grid-container" className={styles['grid-container']}>
            {createGrid(fontList.list)}
        </div>
    )
}

export default BaseGrid