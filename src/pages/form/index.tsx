/**
 * 表单组件 - 字帖配置
 * 用于配置字帖的字库选择和渲染参数
 */

import React, { useEffect } from 'react';
import { Row, Col, Form, Input, Select, InputNumber, ColorPicker, Button, Card, Space, message } from 'antd';
import type { Color } from 'antd/es/color-picker';
import { useModel } from 'umi';
import { FONT_LIBRARY } from '@/const';
import {  clearStringForLibrary } from '@/utils'

const FormBox: React.FC = (): React.ReactNode => {
  const [form] = Form.useForm();

  // 使用UMI的model获取状态和操作方法
  const {
    fontLibraryItem,

    fontStyleConfig,

    updateFontStyleConfig,
    updateFontLibraryItem

  } = useModel('CONTENT');

  // 初始化表单默认值
  useEffect(() => {
    form.setFieldsValue({
      fontLibrary: fontLibraryItem?.code || FONT_LIBRARY[0].code,
      diyFontLibrary: fontLibraryItem.list || '',
      // fontSize: fontStyleConfig.fontSize,
      strokeColor: fontStyleConfig.strokeColor,
      radicalColor: fontStyleConfig.radicalColor
    });
  }, [form, fontLibraryItem, fontStyleConfig]);

  // 表单提交处理
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      /**
       * 清除字库中的非法字符
       */
      const _diyFontLibrary = clearStringForLibrary(values.diyFontLibrary);
     
      
      // 1. 更新字库列表
      const selectedFontList = FONT_LIBRARY.find(lib => lib.code === values.fontLibrary) || FONT_LIBRARY[0];
      updateFontLibraryItem({
        ...selectedFontList,
        list: _diyFontLibrary
      });

      // 2. 更新渲染配置相关状态
      updateFontStyleConfig({
        // fontSize: values.fontSize,
        strokeColor: values.strokeColor,
        radicalColor: values.radicalColor
      });

      message.success('配置已保存，字帖将重新渲染');
    } catch (error) {
      console.error('表单验证失败:', error);
      message.error('表单验证失败，请检查输入');
    }
  };

 const handleChangeFontLibrary = (val: string)=>{
  const selectedFontList = FONT_LIBRARY.find((lib) => String(lib.code) === String(val)) || FONT_LIBRARY[0];
  // updateFontLibraryItem({
  //   ...selectedFontList,
  //   list: ''
  // })
   form.setFieldsValue({
    fontLibrary: selectedFontList.code,
    diyFontLibrary: selectedFontList.list || ''
   })
  
 }

  return (
    <div style={{ padding: '16px' }}>
      <Card title="字帖配置表单" size="small">
        <Form
          form={form}
          layout="vertical">
          {/* 字库选择 */}
          <Form.Item
            label="字库选择"
            name="fontLibrary"
            rules={[{ required: true, message: '请选择字库' }]}
          >
            <Select placeholder="请选择字库" onChange={handleChangeFontLibrary}>
              {FONT_LIBRARY.map(lib => (
                <Select.Option key={lib.code} value={lib.code}>
                  {lib.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            // label="字库选择"
            name="diyFontLibrary"
          // rules={[{ required: true, message: '请选择字库' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>


          {/* 字体大小 */}
          {/* <Form.Item
            label="字体大小"
            name="fontSize"
            rules={[
              { required: true, message: '请输入字体大小' },
              { type: 'number', min: 10, max: 200, message: '字体大小应在10-200之间' }
            ]}
          >
            <InputNumber min={10} max={200} style={{ width: '100%' }} />
          </Form.Item> */}




          <Row>
            <Col span={12}>
              {/* 偏旁颜色 */}
              <Form.Item
                label="偏旁颜色"
                name="radicalColor"
                rules={[{ required: true, message: '请选择偏旁颜色' }]}
                getValueFromEvent={(color: Color) => color.toHexString()}
              >
                <ColorPicker />
              </Form.Item>
            </Col>
            <Col span={12}>
              {/* 笔画颜色 */}
              <Form.Item
                label="笔画颜色"
                name="strokeColor"
                rules={[{ required: true, message: '请选择笔画颜色' }]}
                getValueFromEvent={(color: Color) => color.toHexString()}
              >
                <ColorPicker />
              </Form.Item>
            </Col>
          </Row>


          {/* 提交和重置按钮 */}
          <Form.Item >

            <Button type="primary" block onClick={handleSubmit}>
              确定
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default FormBox;