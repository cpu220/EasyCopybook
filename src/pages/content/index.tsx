import React, { useEffect } from 'react';
import { Card, Button, Input, Space, Typography, Alert, Divider, Tag, message } from 'antd';
import { useModel } from 'umi';
// import { useGlobalValue, useGlobalActions } from '@/context/GlobalContext';

import BaseGrid from './components/gridTemplate/baseGrid/index';
import { renderCopybookInDOM, initCnchar } from '@/utils';
 

const ContentBox: React.FC = () => {
    // 使用 UMI 4.x 数据流
    const { templateInfo, updateTemplateInfo } = useModel('CONTENT');

    // 初始化 cnchar
    useEffect(() => {
        initCnchar();
        console.log('初始化cnchar完成');
        console.log('templateInfo', templateInfo);
    }, []); // 只在组件挂载时初始化一次



    /**
     * 将指定的字体列表转换为网格数据格式
     */
    const handleTransition = ()=>{
        const key =  'grid-container'
        console.log('开始转换为字帖', key)
        
        // 调用 cnchar 工具渲染字帖效果
        renderCopybookInDOM(key);
        
        // 显示转换成功的提示消息
        message.success('已成功转换为字帖！');
    }
    

    return (
        <div > 
            <div>
                <Button type="primary" onClick={handleTransition}>生成字帖</Button>
            </div>
            <BaseGrid  />
        </div>
    );
};

export default ContentBox;