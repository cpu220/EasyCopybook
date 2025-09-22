/**
 * 底部展示组件 - GlobalContext演示
 * 订阅全局Context中的值并显示
 */

import React from 'react';
import { Card, Typography, Empty } from 'antd';
import { useGlobalValue } from '@/context/GlobalContext';

const { Text, Paragraph } = Typography;

const FooterBox: React.FC = (): React.ReactNode => {
  // 订阅全局Context中的formValue值
  const { value: formValue, hasValue } = useGlobalValue('formValue', '');
  
  // 用于观察组件重新渲染
  console.log('FooterBox 重新渲染，当前值:', formValue);
  
  return (
    <div style={{ padding: '16px' }}>
      这是底部footer 
      {formValue},{hasValue}
    </div>
  );
};

export default FooterBox;