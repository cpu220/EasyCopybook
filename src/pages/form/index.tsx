/**
 * 表单组件 - GlobalContext演示
 * 演示如何使用全局Context进行状态管理
 */

import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Space, message } from 'antd';
import { useGlobalActions } from '@/context/GlobalContext';

const FormBox: React.FC = (): React.ReactNode => {
  // 本地表单状态 - 只在组件内部使用，不影响其他组件
  const [inputValue, setInputValue] = useState('');
  
  // 获取全局Context的操作方法
  const { set, get } = useGlobalActions();
  
  // 组件挂载时从全局Context获取初始值
  useEffect(() => {
    const initialValue = get('formValue', '') || '';
    setInputValue(initialValue);
  }, [get]);
  
  // 提交表单 - 将值保存到全局Context
  const handleSubmit = () => {
    if (inputValue.trim()) {
      // 保存到全局Context，这会触发FooterBox的重新渲染
      set('formValue', inputValue);
      message.success('数据已保存到全局Context');
    } else {
      message.warning('请输入内容');
    }
  };
  
  // 重置表单
  const handleReset = () => {
    setInputValue('');
    set('formValue', '');
    message.info('表单已重置');
  };
  
  // 用于观察组件重新渲染
  console.log('FormBox 重新渲染');
  
  return (
    <div style={{ padding: '16px' }}>
      <Card title="全局Context演示表单" size="small">
        <Form layout="vertical">
          <Form.Item 
            label="输入内容" 
            help="输入时不会影响其他组件，只有点击提交时才会更新全局状态"
          >
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="请输入要保存的内容"
              style={{ marginBottom: '12px' }}
            />
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button 
                type="primary" 
                onClick={handleSubmit}
              >
                提交到Context
              </Button>
              <Button 
                onClick={handleReset}
              >
                重置
              </Button>
            </Space>
          </Form.Item>
        </Form>
        
        <div style={{ 
          marginTop: '16px', 
          padding: '12px', 
          backgroundColor: '#f6f8fa', 
          borderRadius: '6px',
          fontSize: '12px',
          color: '#666'
        }}>
          <strong>说明：</strong>
          <br />• 输入框的值只在本组件内管理，输入时不会触发其他组件重新渲染
          <br />• 点击"提交到Context"按钮时，才会将值保存到全局Context
          <br />• 全局Context的值变化会触发FooterBox组件重新渲染并显示新值
        </div>
      </Card>
    </div>
  );
};

export default FormBox;