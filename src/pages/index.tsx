import React from 'react';
import { Flex, Layout } from 'antd';

const { Header, Footer, Sider, Content } = Layout;

import styles from './index.less';


const HomePage: React.FC = (): React.ReactNode => {


  return (
    <Layout className={styles.layout}>
      <Header className={styles.header}>Header</Header>
      <Layout>
        
        <Sider width={400} className={styles.sider}>
          Sider
        </Sider>
        <Content className={styles.content}>Content</Content>
      </Layout>
      {/* <Footer style={footerStyle}>Footer</Footer> */}
    </Layout>
  );

}

export default HomePage

