import { defineConfig } from '@umijs/max';

export default defineConfig({
  proxy: {
    '/api': {
      target: 'http://localhost:8080/',
      changeOrigin: true,
      pathRewrite: { '^/api': '/' },
    },
  },
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {
    dataField: 'data',
  },
  layout: {
    title: '等秋后台管理系统',
  },
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      name: '登录',
      path: '/login',
      component: './Login',
      layout: false,
    },
    {
      name: '首页',
      path: '/home',
      component: './Home',
    },
    {
      name: '权限演示',
      path: '/access',
      component: './Access',
    },
    {
      name: ' CRUD 示例',
      path: '/table',
      component: './Table',
    },
    {
      name: '系统设置',
      path: '/system',
      routes: [
        {
          path: '/system',
          redirect: '/system/user',
        },
        {
          name: '用户管理',
          path: '/system/user',
          component: './System/User',
        },
        {
          name: '角色管理',
          path: '/system/role',
          component: './System/Role',
        },
        {
          name: '菜单管理',
          path: '/system/menu',
          component: './System/Menu',
        },
      ],
    },
    {
      path: '/*',
      component: './404',
    },
  ],
  npmClient: 'pnpm',
});
