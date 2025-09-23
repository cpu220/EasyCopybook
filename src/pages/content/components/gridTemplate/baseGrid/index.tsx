/**
 * 基础网格布局
 */


import React, { useEffect, useRef } from 'react'
import { useModel } from 'umi';
import { createGrid } from '@/utils'
import { renderHanziInContainer } from '@/utils'
import { DEFAULT_CONFIG } from '@/const'
import styles from './index.less'


const BaseGrid: React.FC = () => {

    // 从CONTENT model中获取所有渲染相关的依赖内容
    const {
        fontLibraryItem,
        templateConfig,
        fontStyleConfig,
        borderStyleConfig,
        backgroundType
    } = useModel('CONTENT');

    const containerRef = useRef<HTMLDivElement>(null);

    // 当任何渲染相关配置发生变化时，重新渲染字帖
    useEffect(() => {
      
        if (containerRef.current && fontLibraryItem && fontLibraryItem.list) {
            console.log('重新渲染字帖', fontLibraryItem.name, templateConfig); 
            // 合并渲染配置，确保所有必要的配置项都可用 
            const newRenderConfig = {
                fontStyleConfig,
                borderStyleConfig,
                backgroundType
            }
 

            renderHanziInContainer('grid-container', newRenderConfig);
        }
    }, [fontLibraryItem, templateConfig, fontStyleConfig, borderStyleConfig, backgroundType]);

    // 安全处理字库列表为空的情况
    const safeFontList = fontLibraryItem?.list || '';
    // const safeColumnCount = templateConfig?.column || 10;
    const safeTemplateConfig = templateConfig ||  DEFAULT_CONFIG.templateConfig

    return (
        <div
            id="grid-container"
            ref={containerRef}
            className={styles['grid-container']}
        >
            {createGrid(safeFontList, safeTemplateConfig)}
        </div>
    )
}

export default BaseGrid