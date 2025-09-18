import React from 'react';
import { Flex, Layout } from 'antd';

const { Header, Footer, Sider, Content } = Layout;

import ContentBox from './content';
import FormBox from './form';

import styles from './index.less';


const HomePage: React.FC = (): React.ReactNode => {


  return (
    <Layout className={styles.layout}>
      <Header className={styles.header}>Header</Header>
      <Layout>
        
        <Sider theme='light' width={400} className={styles.sider}>
           <FormBox />
        </Sider>
        <Content className={styles.content}>
           <ContentBox />
        </Content>
      </Layout>
      {/* <Footer style={footerStyle}>Footer</Footer> */}
    </Layout>
  );

}

export default HomePage

