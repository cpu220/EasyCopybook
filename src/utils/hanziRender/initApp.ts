import { initCnchar } from './cncharUtils';

/**
 * 应用初始化函数，包含所有需要在应用启动时执行的初始化任务
 * 这样业务代码就不需要感知这些初始化过程
 */
export const initApp = (): void => {
  console.log('应用启动时初始化...');
  
  // 初始化cnchar
  initCnchar();
  console.log('cnchar初始化完成');
  
  // 可以在这里添加其他需要在应用启动时初始化的功能
};

export default initApp;
