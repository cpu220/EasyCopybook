import React, { useEffect } from 'react';
import { Card, Button, Input, Space, Typography, Alert, Divider, Tag, message } from 'antd';
import { useModel } from 'umi';
// import { useGlobalValue, useGlobalActions } from '@/context/GlobalContext';

import BaseGrid from './components/gridTemplate/baseGrid/index';
import { renderHanziForItem,renderHanziInContainer} from '@/utils/render';
import { DEFAULT_CONFIG } from '@/const/core/render';
const  {  renderConfig }  = DEFAULT_CONFIG

const ContentBox: React.FC = () => {
    // 使用 UMI 4.x 数据流
    const { templateInfo, updateTemplateInfo, fontList } = useModel('CONTENT');

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
            await renderHanziInContainer(key,renderConfig)
        // try {
        //     // 获取容器元素
        //     const container = document.getElementById(key);
        //     if (!container) {
        //         message.error('未找到网格容器');
        //         return;
        //     }
            
        //     // 获取所有网格项
        //     const gridItems = container.querySelectorAll('[data-font]');
            
        //     if (gridItems.length === 0) {
        //         message.warning('没有找到可转换的网格项');
        //         return;
        //     }
            
        //     // 显示加载状态
        //     message.loading('正在转换为字帖...', 0);
            
        //     // 遍历所有网格项，转换为汉字字帖
        //     const promises = Array.from(gridItems).map((item, index) => {
        //         return new Promise<void>((resolve) => {
        //             setTimeout(() => {
        //                 const gridItem = item as HTMLElement;
        //                 const char = gridItem.dataset.font || '';
                        
        //                 if (char) {
        //                     // 清空网格项内容
        //                     gridItem.innerHTML = '';
                            
        //                     // 使用渲染函数替换每个字符
        //                     renderHanziForItem( gridItem.id, char,{
        //                         ...DEFAULT_CONFIG.renderConfig.fontStyleConfig,
        //                         width: 60,
        //                         height: 60,
        //                         useGridBackground: true,
        //                         useLocalData: true, 
        //                     });
        //                 }
        //                 resolve();
        //             }, index * 50); // 错开执行时间，避免性能问题
        //         });
        //     });
            
        //     // 等待所有转换完成
        //     await Promise.all(promises);
            
        //     // 隐藏加载状态，显示成功消息
        //     message.destroy();
        //     message.success('字帖生成成功');
            
        // } catch (error) {
        //     console.error('生成字帖失败:', error);
        //     message.destroy();
        //     message.error('生成字帖失败，请重试');
        // }
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