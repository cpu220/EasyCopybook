import React, { useEffect } from 'react';
import { Link, Outlet } from 'umi';
import styles from './index.less';
 
 

export default function Layout() { 
  return (
    <div className={styles['app-content']}>
      <Outlet />
    </div>
  );
}