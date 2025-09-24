import React, { useEffect } from 'react';
import { Card, Button, Input, Space, Typography, Alert, Divider, Tag, message } from 'antd';
import {
  ExportOutlined,PrinterOutlined
} from '@ant-design/icons';
import { useModel } from 'umi';
// import { useGlobalValue, useGlobalActions } from '@/context/GlobalContext';

import BaseGrid from './components/gridTemplate/baseGrid/index';
import { renderHanziInContainer } from '@/utils';
import styles from './index.less'

const ContentBox: React.FC = () => {
    // 使用 UMI 4.x 数据流，从CONTENT model中获取所有必要的配置
    const {
        fontLibraryItem,
        templateConfig,
        fontStyleConfig,
        borderStyleConfig,
        backgroundType,
    } = useModel('CONTENT');

 
    useEffect(() => {
        console.log('ContentBox组件挂载');
        console.log('templateInfo', templateConfig,fontStyleConfig,backgroundType);
    }, [templateConfig,fontStyleConfig,backgroundType]);  

 

    // 在组件挂载后，当DOM渲染完成时自动触发handleTransition
    useEffect(() => {  
        // triggerTransition();
    }, []); // 只在组件挂载后执行一次

    const triggerTransition = async () => {
        try {
            // 确保DOM已经渲染完成
            await new Promise(resolve => setTimeout(resolve, 0));
            // await handleTransition();
        } catch (error) {
            console.error('自动触发转换失败:', error);
        }
    };
    /**
     * 将指定的字体列表转换为网格数据格式
     */
    const handleTransition = async () => {
        const key = 'grid-container'
        console.log('开始转换为字帖', key)

        // 合并所有必要的配置，确保渲染函数能获取到完整的配置信息
        const finalRenderConfig = {
            fontStyleConfig, 
            borderStyleConfig,
            backgroundType
        };
        console.log('finalRenderConfig',finalRenderConfig) 
        // await renderHanziInContainer(key, finalRenderConfig)
    }


    return (
        <div >
            <div id="top-button-content" className={styles['top-button-content']} >
                {/* <Button type="primary" onClick={handleTransition}>生成字帖</Button>
                 */}
                 <Space>
                    <Button shape="circle" icon={<ExportOutlined />}></Button>
                    <Button shape="circle" icon={<PrinterOutlined />}></Button>
                 </Space>
            </div>
            <BaseGrid />
        </div>
    );
};

export default ContentBox;