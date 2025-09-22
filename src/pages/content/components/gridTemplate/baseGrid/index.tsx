/**
 * 基础网格布局
 */


import React, { useEffect } from 'react'
import { useModel } from 'umi';
import { formatGridData } from '@/utils'
import { IFontItem } from '@/interface'
import { DEFAULT_CONFIG } from '@/const/core/render'
import { createGrid } from '@/utils'



const { templateConfig } = DEFAULT_CONFIG

import styles from './index.less'


const BaseGrid: React.FC = () => {

    const { fontList } = useModel('CONTENT');

    useEffect(() => {
        console.log('fontList', fontList);
    }, [fontList]);


    

    return (
        <div id="grid-container" className={styles['grid-container']}>
            {createGrid(fontList.list, templateConfig.column)}
        </div>
    )
}

export default BaseGrid