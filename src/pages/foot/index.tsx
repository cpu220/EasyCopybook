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
      <Card title="全局Context数据展示" size="small">
        {hasValue && formValue ? (
          <div>
            <Text type="secondary">从全局Context获取的数据：</Text>
            <Paragraph 
              style={{ 
                marginTop: '8px', 
                padding: '12px', 
                backgroundColor: '#f6f8fa', 
                borderRadius: '6px',
                fontSize: '16px',
                color: '#1890ff',
                fontWeight: 'bold'
              }}
            >
              {formValue}
            </Paragraph>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              这个值来自全局Context，当FormBox提交数据时会自动更新
            </Text>
          </div>
        ) : (
          <Empty 
            description="暂无数据" 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            style={{ margin: '20px 0' }}
          >
            <Text type="secondary" style={{ fontSize: '12px' }}>
              请在左侧表单中输入内容并点击"提交到Context"按钮
            </Text>
          </Empty>
        )}
      </Card>
    </div>
  );
};

export default FooterBox;