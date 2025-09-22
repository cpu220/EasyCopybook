import React, { useEffect } from 'react';
import { Link, Outlet } from 'umi';
import styles from './index.less';
import { initCnchar } from '@/utils';

export default function Layout() {
  // 在全局布局中初始化cnchar，确保应用启动时就完成初始化
  useEffect(() => {
    console.log('在全局布局中初始化cnchar');
    initCnchar();
  }, []); // 只在应用启动时初始化一次

  return (
    <div className={styles['app-content']}>
      <Outlet />
    </div>
  );
}