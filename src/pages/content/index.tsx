import React, { useEffect, useState } from 'react';
import { Card, Button, Input, Space, Typography, Alert, Divider, Tag } from 'antd';
import { useModel } from 'umi';
// import { useGlobalValue, useGlobalActions } from '@/context/GlobalContext';

import BaseGrid from './components/gridTemplate/baseGrid'
 

const ContentBox: React.FC = () => {
    // 使用 UMI 4.x 数据流
    const { templateInfo, updateTemplateInfo } = useModel('CONTENT');


    useEffect(() => {
        console.log('templateInfo', templateInfo);
    }, [templateInfo]);


    

    return (
        <div > 
            这是主内容 content  
            <BaseGrid  />
        </div>
    );
};

export default ContentBox;