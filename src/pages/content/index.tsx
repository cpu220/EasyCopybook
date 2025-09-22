import React, { useEffect } from 'react';
import { Card, Button, Input, Space, Typography, Alert, Divider, Tag, message } from 'antd';
import { useModel } from 'umi';
// import { useGlobalValue, useGlobalActions } from '@/context/GlobalContext';

import BaseGrid from './components/gridTemplate/baseGrid/index';
 
 

const ContentBox: React.FC = () => {
    // 使用 UMI 4.x 数据流
    const { templateInfo, updateTemplateInfo } = useModel('CONTENT');

    // 注意：cnchar已在应用入口(app.tsx)中初始化，业务代码无需感知
    useEffect(() => {
        console.log('ContentBox组件挂载');
        console.log('templateInfo', templateInfo);
    }, []); // 只在组件挂载时执行一次



    /**
     * 将指定的字体列表转换为网格数据格式
     */
    const handleTransition = async ()=>{
        const key =  'grid-container'
        console.log('开始转换为字帖', key)
        
         
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