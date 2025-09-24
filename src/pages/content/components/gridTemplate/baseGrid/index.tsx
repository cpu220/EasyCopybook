/**
 * 基础网格布局
 */


import React, { useEffect, useRef, useState } from 'react'
import { useModel } from 'umi';
import { createGrid } from '@/utils'
import { renderHanziInContainer, getCharacterStrokeData } from '@/utils'
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

    // 当字库列表变化时，重新获取笔画数数据
    useEffect(() => {
        fetchCharStrokeCounts();
    }, [fontLibraryItem]);

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

    // 存储汉字及其实际笔画数的映射
    const [charStrokeCounts, setCharStrokeCounts] = useState<Map<string, number> | undefined>(undefined);

    // 获取所有汉字的实际笔画数
    const fetchCharStrokeCounts = async () => {
        if (!fontLibraryItem?.list) return;

        try {
            const charMap = new Map<string, number>();
            const characters = Array.from(new Set(fontLibraryItem.list)); // 去重

            // 并行获取所有汉字的笔画数据
            const promises = characters.map(async (char) => {
                const strokes = await getCharacterStrokeData(char);
                charMap.set(char, strokes.length);
            });

            await Promise.all(promises);
            setCharStrokeCounts(charMap);
        } catch (error) {
            console.error('获取汉字笔画数失败:', error);
            setCharStrokeCounts(undefined);
        }
    };

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