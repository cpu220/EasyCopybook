/**
 * 表单组件 - 字帖配置
 * 用于配置字帖的字库选择和渲染参数
 */

import React, { useEffect, useState } from 'react';
import { Row, Col, Divider, Form, Input, Switch, Select, InputNumber, ColorPicker, Button, Card, Space, message } from 'antd';
import type { Color } from 'antd/es/color-picker';
import { ReloadOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import { FONT_LIBRARY, RENDER_SIZES, POETRY_LIBRARY, TEMPLATE_LAYOUT_TYPE } from '@/const';
import { clearStringForLibrary, generateRandomChineseChar, parseFontLibraryContent, getPoetryJsonById, poetryJsonToString } from '@/utils';
import { IPoetryItem } from '@/interface/poetry'

// import { IDefaultTemplateConfig } from '@/interface'
import styles from './index.less'


const FormItem = Form.Item;

export const FormBox: React.FC = (): React.ReactNode => {
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

    // 当前布局类型
    const [layoutType, setLayoutType] = useState(templateConfig.templateLayoutType || TEMPLATE_LAYOUT_TYPE.NORMAL);

    // 一排几个字
    const [wordsPreCol, setWordsPreCol] = useState(templateConfig.wordsPreCol);
    // 每个字占几行
    const [wordsPerRow, setWordsPerRow] = useState(templateConfig.wordsPerRow);

    // 是否展示提示
    const [showTips, setShowTips] = useState(true);

    const [showStrokeOrderShadow, setShowStrokeOrderShadow] = useState(templateConfig.showStrokeOrderShadow)
    const [selectedPoetry, setSelectedPoetry] = useState<IPoetryItem>();


    // 初始化表单默认值
    useEffect(() => {
        const { wordsPerRow, wordsPreCol } = templateConfig;

        const  type = templateConfig.templateLayoutType || TEMPLATE_LAYOUT_TYPE.NORMAL
        console.log(fontLibraryItem.list)
        form.setFieldsValue({
            fontLibrary: fontLibraryItem?.code || FONT_LIBRARY[0].code,
            diyFontLibrary: getStr(type, fontLibraryItem.list),
            randomFontLibrary: fontLibraryItem.list.length,
            // fontSize: fontStyleConfig.fontSize,
            strokeColor: fontStyleConfig.strokeColor,
            radicalColor: fontStyleConfig.radicalColor,
            wordsPreColAndRow: `${wordsPerRow}x${wordsPreCol}`,
            templateLayoutType: type,
            pinyin: templateConfig.pinyin,
            showStrokeOrderShadow: templateConfig.showStrokeOrderShadow,
            strokeNumber: templateConfig.strokeNumber,
            showStrokeOrder: templateConfig.showStrokeOrder,
        });
    }, [form, fontLibraryItem, fontStyleConfig]);

    const getStr = (type: string, value: string | IPoetryItem) => {
        let _fontLibrary = '';
        if (type === TEMPLATE_LAYOUT_TYPE.POETRY && selectedPoetry) {
            const { str, textarea } = poetryJsonToString(value as IPoetryItem)
            return textarea
        } else {
            return value
        }
    }

    // 表单提交处理
    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();


            let _fontLibrary = values.diyFontLibrary;
            if (values.templateLayoutType === TEMPLATE_LAYOUT_TYPE.POETRY && selectedPoetry) {
                _fontLibrary = selectedPoetry
            }
            // 1. 更新字库列表
            const selectedFontList = FONT_LIBRARY.find(lib => lib.code === values.fontLibrary) || FONT_LIBRARY[0];
            updateFontLibraryItem({
                ...selectedFontList,
                list: _fontLibrary
            });

            // 2. 更新渲染配置相关状态
            updateFontStyleConfig({
                // fontSize: values.fontSize,
                strokeColor: values.strokeColor,
                radicalColor: values.radicalColor
            });


            let _tempConf
            if (wordsPerRow === 1 && wordsPreCol === templateConfig.column) {
                _tempConf = {
                    wordsPerRow,
                    wordsPreCol,
                    pinyin: false,
                    showStrokeOrder: false,
                    showStrokeOrderShadow: false,
                    templateLayoutType: values.templateLayoutType
                }
            } else {
                _tempConf = {
                    wordsPerRow,
                    wordsPreCol,
                    pinyin: values.pinyin,
                    showStrokeOrderShadow: values.showStrokeOrderShadow,
                    strokeNumber: values.strokeNumber,
                    showStrokeOrder: values.showStrokeOrder,
                    templateLayoutType: values.templateLayoutType
                }
            }
            // 3. 更新布局配置相关状态
            updateTemplateConfig({
                ..._tempConf,
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
        // 使用统一的方法解析字体库内容
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
        if (wordsPerRow === 1 && wordsPreCol === templateConfig.column) {
            // 如果选择一排展示10个字，那么 笔画 拼音 都不展示
            // form.setFieldsValue({
            //     pinyin: false,
            //     showStrokeOrder: false,
            //     showStrokeOrderShadow: false,
            // })
            setShowTips(false);
        } else {
            form.setFieldsValue({
                // pinyin: templateConfig.pinyin,
                // showStrokeOrderShadow: templateConfig.showStrokeOrderShadow,
                strokeNumber: templateConfig.strokeNumber,
                // showStrokeOrder: templateConfig.showStrokeOrder,
            })
            setShowTips(true);
            // setShowStrokeOrderShadow(templateConfig.showStrokeOrderShadow);
        }
    }


    /**
     * 随机字库(字数)改变时的处理函数
     * @param val 随机字库(字数)
     */
    const handleChangeRandomFontLibrary = (val: number) => {
        // generateRandomChineseChar本身应该已经生成了纯汉字字符串，但为了保险起见，还是进行一次过滤
        const str = generateRandomChineseChar(val)
        console.log('随机字库(字数)', val, str)

        form.setFieldsValue({
            diyFontLibrary: str
        })
    }

    /**
     * 布局类型选择改变时的处理函数
     */
    const handleChangeLayoutType = (val: string) => {
        setLayoutType(val);
        // 如果切换到诗词布局，默认隐藏一些不相关的选项
        if (val === TEMPLATE_LAYOUT_TYPE.POETRY) {
            setShowTips(false);
        } else {
            setShowTips(true);
        }
    }


    /**
     * 提示容器
     * @returns 提示容器
     */
    const createTipsContainer = () => {

        if (!showTips) {
            return null;
        }

        const pinyinDOM = (
            <FormItem
                // label={'是否展示拼音'}
                name="pinyin"
            >
                <Switch checkedChildren="开启拼音" unCheckedChildren="关闭拼音" />
            </FormItem>
        )
        const strokeOrderDOM = (
            <FormItem
                // label={'是否展示笔画顺序'}
                name="showStrokeOrder"
            >
                <Switch checkedChildren="开启笔画顺序" unCheckedChildren="关闭笔画顺序" />
            </FormItem>
        )

        const showStrokeOrderShadowDOM = (
            <FormItem
                // label={'是否展示笔画阴影'}
                name="showStrokeOrderShadow"
            >
                <Switch
                    onChange={(val) => {
                        setShowStrokeOrderShadow(val);
                    }}
                    checkedChildren="开启笔画阴影"
                    unCheckedChildren="关闭笔画阴影" />
            </FormItem>
        )
        const strokeNumberDOM = (
            <FormItem
                // label={'笔画数量'}
                name="strokeNumber"
            >
                <InputNumber
                    placeholder='笔画阴影展示数量'
                    min={1} max={100} style={{ width: '100%' }} />
            </FormItem>
        )
        return (
            <>
                <Row>
                    <Col span={12}>
                        {pinyinDOM}
                    </Col>
                    <Col span={12}>
                        {strokeOrderDOM}
                    </Col>
                </Row>



                <Row>
                    <Col span={12}>
                        {showStrokeOrderShadowDOM}
                    </Col>
                    <Col span={12}>

                        {showStrokeOrderShadow && strokeNumberDOM}
                    </Col>
                </Row>
            </>
        )
    }

    /**
     * 字体大小
     * @returns 字体大小
     */
    const createFontSize = () => {
        return (
            <FormItem
                label="字体大小"
                name="fontSize"
                rules={[
                    { required: true, message: '请输入字体大小' },
                    { type: 'number', min: 10, max: 200, message: '字体大小应在10-200之间' }
                ]}
            >
                <InputNumber min={10} max={200} style={{ width: '100%' }} />
            </FormItem>
        )
    }


    /**
     * 布局类型选择选项
     * @returns 布局类型选择选项
     */
    const createWordsPreColOptions = () => {
        const _map = [
            '1x1', '1x2', '2x1', '3x1', '4x1', `1x${templateConfig.column}`
        ]

        const arr = _map.map(item => {
            const [wordsPerRow, wordsPreCol] = item.split('x').map(Number);
            return {
                label: `${wordsPerRow}排 ${wordsPreCol}个字`,
                value: item
            }
        })
        return arr;
    }


    const handleChangeSelectedPoetry = (id: any) => {
        console.log(id)

        const jsonItem = POETRY_LIBRARY.find(item => Number(item.id) === Number(id));
        console.log(jsonItem)

        if (jsonItem) {
            const { str, textarea } = poetryJsonToString(jsonItem)
            // console.log(str)
            form.setFieldsValue({
                diyFontLibrary: textarea
            })
            setSelectedPoetry(jsonItem)
        }
    }


    return (
        <div style={{ padding: `${RENDER_SIZES.spacing.formPadding}px` }}>
            <Card title="字帖配置表单" size="small">
                <Divider orientation="left">字库</Divider>
                <Form
                    form={form}
                    layout="vertical">
                    {/* 字库选择 */}
                    <FormItem
                        // label="字库选择"
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
                            min={RENDER_SIZES.component.inputNumberMin}
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

                    <Divider orientation="left">布局</Divider>

                    {/* 布局类型选择 */}
                    <FormItem
                        name="templateLayoutType"
                    >
                        <Select onChange={handleChangeLayoutType}>
                            <Select.Option value={TEMPLATE_LAYOUT_TYPE.NORMAL}>普通布局</Select.Option>
                            <Select.Option value={TEMPLATE_LAYOUT_TYPE.PRACTICE}>练字贴布局</Select.Option>
                            <Select.Option value={TEMPLATE_LAYOUT_TYPE.POETRY}>诗词布局</Select.Option>
                        </Select>
                    </FormItem>

                    {/* 诗词选择（仅在诗词布局下显示） */}
                    {layoutType === TEMPLATE_LAYOUT_TYPE.POETRY && (
                        <FormItem>
                            <Select
                                placeholder="请选择一首诗词"
                                onChange={handleChangeSelectedPoetry}
                                style={{ width: '100%' }}
                                options={POETRY_LIBRARY.map((poetry: IPoetryItem) => ({
                                    label: `${poetry.title} - ${poetry.dynasty} ${poetry.author}`,
                                    value: poetry.id
                                }))}
                            />
                        </FormItem>
                    )}

                    {/* 普通布局选项 */}
                    {(layoutType === TEMPLATE_LAYOUT_TYPE.NORMAL || layoutType === TEMPLATE_LAYOUT_TYPE.PRACTICE) && (
                        <FormItem
                            // label="布局"
                            name="wordsPreColAndRow"
                        >
                            <Select
                                onChange={handleChangeWordsPreColAndRow}
                                key={`${wordsPerRow}x${wordsPreCol}`}
                                value={`${wordsPerRow}x${wordsPreCol}`}
                                options={createWordsPreColOptions()} />
                        </FormItem>
                    )}

                    {createTipsContainer()}



                    {/* 字体大小 */}
                    {/* {createFontSize()} */}



                    <Divider orientation="left">样式</Divider>
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
