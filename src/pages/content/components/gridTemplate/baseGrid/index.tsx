/**
 * 基础网格布局
 */


import React, { useRef, useEffect } from 'react';
import { useModel } from 'umi';
import { DEFAULT_CONFIG } from '@/const';
import { createGrid, poetryJsonToString } from '@/utils';
import styles from './index.less';

interface BaseGridProps {
    fontLibraryItem: any;
    //   templateConfig?: any;
}

const BaseGrid: React.FC<BaseGridProps> = ({ fontLibraryItem }) => {
    const { charStrokeCounts, fetchCharStrokeCounts } = useModel('CHAR_CACHE');
    const { templateConfig } = useModel('CONTENT')

    const containerRef = useRef<HTMLDivElement>(null);
    const safeTemplateConfig = templateConfig || DEFAULT_CONFIG.templateConfig;

    // 使用新创建的字符缓存模型

    useEffect(() => {
        // 当字库列表变化时，获取所有汉字的笔画数据
        if (fontLibraryItem?.list) {
            if (typeof fontLibraryItem?.list === 'string') {
                fetchCharStrokeCounts(fontLibraryItem.list);
            } else {
                // 如果是诗词布局，使用诗词的JSON数据
                const { str } = poetryJsonToString(fontLibraryItem.list);
                fetchCharStrokeCounts(str);
            }
        }
    }, [fontLibraryItem?.list, fetchCharStrokeCounts]);

    const safeFontList = fontLibraryItem?.list || [];

    return (
        <div
            id="grid-container"
            ref={containerRef}
            className={styles['grid-container']}
        >
            {createGrid(safeFontList, safeTemplateConfig, charStrokeCounts)}
        </div>
    )
}

export default BaseGrid