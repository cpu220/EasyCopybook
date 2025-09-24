/**
 * 表单组件 - 字帖配置
 * 用于配置字帖的字库选择和渲染参数
 */

import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Input, Switch, Select, InputNumber, ColorPicker, Button, Card, Space, message } from 'antd';
import type { Color } from 'antd/es/color-picker';
import { ReloadOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import { FONT_LIBRARY } from '@/const';
import { clearStringForLibrary, generateRandomChineseChar } from '@/utils'

const FormItem = Form.Item;

const FormBox: React.FC = (): React.ReactNode => {
  const [form] = Form.useForm();




  // 使用UMI的model获取状态和操作方法
  const {
    fontLibraryItem,
    templateConfig,

    fontStyleConfig,
    updateTemplateConfig,
    updateFontStyleConfig,
    updateFontLibraryItem

  } = useModel('CONTENT');

  // 一排几个字
  const [wordsPreCol, setWordsPreCol] = useState(templateConfig.wordsPreCol);
  // 每个字占几行
  const [wordsPerRow, setWordsPerRow] = useState(templateConfig.wordsPerRow);



  // 初始化表单默认值
  useEffect(() => {
    const { wordsPerRow, wordsPreCol } = templateConfig;



    form.setFieldsValue({
      fontLibrary: fontLibraryItem?.code || FONT_LIBRARY[0].code,
      diyFontLibrary: fontLibraryItem.list || '',
      randomFontLibrary: fontLibraryItem.list.length,
      // fontSize: fontStyleConfig.fontSize,
      strokeColor: fontStyleConfig.strokeColor,
      radicalColor: fontStyleConfig.radicalColor,
      wordsPreColAndRow: `${wordsPerRow}x${wordsPreCol}`,

      pinyin: templateConfig.pinyin,
      showStrokeOrderShadow: templateConfig.showStrokeOrderShadow,
      strokeNumber: templateConfig.strokeNumber,
      showStrokeOrder: templateConfig.showStrokeOrder,
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

      // 3. 更新布局配置相关状态
      updateTemplateConfig({
        wordsPerRow,
        wordsPreCol,
        pinyin: values.pinyin,
        showStrokeOrderShadow: values.showStrokeOrderShadow,
        strokeNumber: values.strokeNumber,
        showStrokeOrder: values.showStrokeOrder,
      });

      message.success('配置已保存，字帖将重新渲染');
    } catch (error) {
      console.error('表单验证失败:', error);
      message.error('表单验证失败，请检查输入');
    }
  };

  /**
   * 字库选择改变时的处理函数
   * @param val 字库code
   */
  const handleChangeFontLibrary = (val: string) => {
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

  /**
   * 字库选择改变时的处理函数
   * @param val 字库code
   */
  const handleChangeWordsPreColAndRow = (val: string) => {
    const [wordsPerRow, wordsPreCol] = val.split('x').map(Number);
    setWordsPerRow(wordsPerRow);
    setWordsPreCol(wordsPreCol);
  }


  /**
   * 随机字库(字数)改变时的处理函数
   * @param val 随机字库(字数)
   */
  const handleChangeRandomFontLibrary = (val: number) => {
    const str = generateRandomChineseChar(val)
    console.log('随机字库(字数)', val, str)

    form.setFieldsValue({
      diyFontLibrary: str
    })
  }

  return (
    <div style={{ padding: '16px' }}>
      <Card title="字帖配置表单" size="small">
        <Form
          form={form}
          layout="vertical">
          {/* 字库选择 */}
          <FormItem
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
          </FormItem>
          <FormItem
            // label="字库选择"
            name="diyFontLibrary"
          // rules={[{ required: true, message: '请选择字库' }]}
          >
            <Input.TextArea rows={4} />
          </FormItem>
          <FormItem
            // label="随机字库"
            name="randomFontLibrary"

          >
            <InputNumber
              min={1}
              max={2000}
              prefix="生成随机"
              controls={false}
              suffix="个字"
              style={{ width: '100%', textAlign: "center" }}
              addonAfter={<ReloadOutlined onClick={
                () => handleChangeRandomFontLibrary(
                  form.getFieldValue('randomFontLibrary')
                )
              } />}
              onChange={(value: number | null) => value && handleChangeRandomFontLibrary(value)} />
          </FormItem>


          <Row>
            <Col span={12}>
              <FormItem
                // label={'是否展示拼音'}
                name="pinyin"
              >
                <Switch checkedChildren="开启拼音" unCheckedChildren="关闭拼音" />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                // label={'是否展示笔画顺序'}
                name="showStrokeOrder"
              >
                <Switch checkedChildren="开启笔画顺序" unCheckedChildren="关闭笔画顺序" />
              </FormItem>
            </Col>
          </Row>



          <Row>
            <Col span={12}>
              <FormItem
                // label={'是否展示笔画'}
                name="showStrokeOrderShadow"
              >
                <Switch checkedChildren="开启笔画阴影" unCheckedChildren="关闭笔画阴影" />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                // label={'笔画数量'}
                name="strokeNumber"
              >
                <InputNumber
                  placeholder='笔画阴影展示数量'
                  min={1} max={100} style={{ width: '100%' }} />
              </FormItem>
            </Col>
          </Row>


          {/* 字体大小 */}
          {/* <FormItem
            label="字体大小"
            name="fontSize"
            rules={[
              { required: true, message: '请输入字体大小' },
              { type: 'number', min: 10, max: 200, message: '字体大小应在10-200之间' }
            ]}
          >
            <InputNumber min={10} max={200} style={{ width: '100%' }} />
          </FormItem> */}




          <Row>
            <Col span={12}>
              {/* 偏旁颜色 */}
              <FormItem
                label="偏旁颜色"
                name="radicalColor"
                rules={[{ required: true, message: '请选择偏旁颜色' }]}
                getValueFromEvent={(color: Color) => color.toHexString()}
              >
                <ColorPicker />
              </FormItem>
            </Col>
            <Col span={12}>
              {/* 笔画颜色 */}
              <FormItem
                label="笔画颜色"
                name="strokeColor"
                rules={[{ required: true, message: '请选择笔画颜色' }]}
                getValueFromEvent={(color: Color) => color.toHexString()}
              >
                <ColorPicker />
              </FormItem>
            </Col>
          </Row>

          <FormItem
            label="布局"
            name="wordsPreColAndRow"
          >
            <Select
              onChange={handleChangeWordsPreColAndRow}
              key={`${wordsPerRow}x${wordsPreCol}`}
              value={`${wordsPerRow}x${wordsPreCol}`}
              options={[{
                label: '1排 1个字',
                value: '1x1'
              }, {
                label: '1排 2个字',
                value: '1x2'
              }, {
                label: `1排 ${templateConfig.column}个字`,
                value: `1x${templateConfig.column}`
              }, {
                label: '2排1个字',
                value: '2x1'
              }, {
                label: '3排1个字',
                value: '3x1'
              }, {
                label: '4排1个字',
                value: '4x1'
              }]} />
          </FormItem>


          {/* 提交和重置按钮 */}
          <FormItem >

            <Button type="primary" block onClick={handleSubmit}>
              确定
            </Button>
          </FormItem>
        </Form>
      </Card>
    </div>
  );
};

export default FormBox;