// UMI 4.x 数据流 Model - 应用全局状态
import { useState, useCallback } from 'react';

import { BACKGROUND_TYPE, FONT_LIBRARY, DEFAULT_CONFIG } from '@/const';
import { IDefaultStrokeFontRenderConfig, IDefaultBorderStyleConfig, IFontLibraryItem, } from '@/interface';

const { renderConfig } = DEFAULT_CONFIG;


export default function useAppModel() {



  // 模板配置
  // 保持templateInfo用于向后兼容，将来可以完全迁移到templateConfig



  // 模板配置（从DEFAULT_CONFIG迁移过来）
  const [templateConfig, setTemplateConfig] = useState(DEFAULT_CONFIG.templateConfig);



  // 背景类型
  const [backgroundType, setBackgroundType] = useState(BACKGROUND_TYPE.DOT_GRID);

  // 字体样式配置
  const [fontStyleConfig, setFontStyleConfig] = useState<IDefaultStrokeFontRenderConfig>(renderConfig.fontStyleConfig);
  // 边框样式配置
  const [borderStyleConfig, setBorderStyleConfig] = useState<IDefaultBorderStyleConfig>(renderConfig.borderStyleConfig);



  /**
   * 选择的字库
   */

  const [fontLibraryItem, setFontLibraryItem] = useState<IFontLibraryItem>(FONT_LIBRARY[0]);




  // 全局加载状态
  const [globalLoading, setGlobalLoading] = useState(false);

  // 通知消息
  const [notifications, setNotifications] = useState<Array<{
    id: number;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    timestamp: number;
  }>>([]);



  // 设置全局加载状态
  const setLoading = useCallback((loading: boolean) => {
    setGlobalLoading(loading);
  }, []);


  /**
   * 更新字库列表
   */
  const updateFontLibraryItem = useCallback((newFontLibraryItem: IFontLibraryItem) => {
    setFontLibraryItem(newFontLibraryItem);
  }, []);



  // DEFAULT_CONFIG 对应的更新
  /**
   * 更新模板配置
   */
  const updateTemplateConfig = useCallback((newConfig: Partial<typeof templateConfig>) => {
    setTemplateConfig(prev => ({ ...prev, ...newConfig }));
  }, []);

  /**
   * 更新字体样式配置
   */
  const updateFontStyleConfig = useCallback((newConfig: Partial<IDefaultStrokeFontRenderConfig>) => {
    setFontStyleConfig(prev => ({ ...prev, ...newConfig }));
  }, []);

  /**
   * 更新边框样式配置
   */
  const updateBorderStyleConfig = useCallback((newConfig: Partial<IDefaultBorderStyleConfig>) => {
    setBorderStyleConfig(prev => ({ ...prev, ...newConfig }));
  }, []);

  /**
   * 更新背景类型
   */
  const updateBackgroundType = useCallback((type: BACKGROUND_TYPE) => {
    setBackgroundType(type);
  }, []);

  return {
    // 状态

    globalLoading,

    fontLibraryItem,
    templateConfig,
    fontStyleConfig,
    borderStyleConfig,
    backgroundType,
    // notifications,
    // 操作方法


    updateFontLibraryItem,
    updateTemplateConfig,
    updateFontStyleConfig,
    updateBorderStyleConfig,
    updateBackgroundType,


    setLoading,
  };
}