import React from 'react';
import { Layout } from 'antd';

const { Header, Footer, Sider, Content } = Layout;

import ContentBox from './content';
// import FormBox from './form';
import LeftBox from './left'
import FooterBox from './foot';
import { GlobalProvider } from '../context/GlobalContext';

import styles from './index.less';

const HomePage: React.FC = (): React.ReactNode => {
  return (
    <GlobalProvider initialData={{ formValue: '初始值' }}>
      <Layout className={styles.layout}>
        <Header className={styles.header}></Header>
        <Layout>
          <Sider collapsible theme='light'  width={300} className={styles.sider}>
             <LeftBox />
          </Sider>
          <Content className={styles.content}>
             <ContentBox />
          </Content>
        </Layout>
        <Footer className={styles.footer}>
          <FooterBox />
        </Footer>
      </Layout>
    </GlobalProvider>
  );
};

export default HomePage;

