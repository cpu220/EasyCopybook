// UMI 4.x 数据流 Model - 应用全局状态
import { useState, useCallback } from 'react';
import { FONT_LIBRARY } from '@/const'


export default function useAppModel() {


  const [templateInfo, setTemplateInfo] = useState({
     row: 10,
     col: 10,
  });

  const [fontList ,setFontList] = useState(FONT_LIBRARY[0])
   

  // 全局加载状态
  const [globalLoading, setGlobalLoading] = useState(false);

  // 通知消息
  const [notifications, setNotifications] = useState<Array<{
    id: number;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    timestamp: number;
  }>>([]);

  /**
   * 更新模板信息
   */
  const updateTemplateInfo = useCallback((newInfo: Partial<typeof templateInfo>) => {
    setTemplateInfo(prev => ({ ...prev, ...newInfo }));
  }, []);
 

  // 设置全局加载状态
  const setLoading = useCallback((loading: boolean) => {
    setGlobalLoading(loading);
  }, []);

  return {
    // 状态
    templateInfo,
    globalLoading,
    fontList,
    // notifications,
    // 操作方法
    
    updateTemplateInfo,
    setLoading,
  };
}