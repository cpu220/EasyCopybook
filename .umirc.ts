import { defineConfig } from '@umijs/max';

export default defineConfig({
  routes: [
    { path: '/', component: 'index' },
    // { path: '/content', component: 'content' },
    // { path: '/form', component: 'form' },
    // { path: '/foot', component: 'foot' },
  ],
  npmClient: 'yarn',
  // 根据官方文档，需要同时启用 initial-state 和 model 插件
  plugins: [
    '@umijs/plugins/dist/initial-state',
    '@umijs/plugins/dist/model',
  ],
  // 启用相关配置
  initialState: {},
  model: {},
  // 禁用 MFSU 功能，解决模块加载问题
  // mfsu: false,
});
