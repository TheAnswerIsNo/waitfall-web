import { history, type RequestConfig } from '@umijs/max';
import { message } from 'antd';
import { ResponseCode } from './constants';

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<{ name: string }> {
  return { name: '@umijs/max' };
}

export const layout = () => {
  return {
    logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
    menu: {
      locale: false,
    },
  };
};

export const request: RequestConfig = {
  baseURL: '/api',
  timeout: 60000,
  errorConfig: {
    // 错误抛出
    errorThrower: (res: Result) => {
      const { msg } = res;
      const error: any = new Error(msg ? msg : '网络异常，请稍候重试');
      error.name = 'ServerError';
      error.info = res;
      throw error;
    },
    // 错误接收及处理
    errorHandler: (error: any, opts: any) => {
      if (opts?.skipErrorHandler) throw error;
      if (error.name === 'ServerError') {
        if (error.info.code === ResponseCode.NOT_LOGIN) {
          // 跳转登录页面
          history.push('/login');
          return;
        }
        if (error.info) {
          message.error(error.info.msg);
        }
      } else if (error.response) {
        // Axios 的错误
        // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
        // TODO 处理各种状态码
        message.error(`请求响应出错，状态码${error.response.status}`);
      } else if (error.request) {
        // 请求已经成功发起，但没有收到响应
        message.error('服务器无响应，请重试！');
      } else {
        // 发送请求时出了点问题
        message.error('请求响应异常，请重试！');
      }
    },
  },
  requestInterceptors: [
    (url, options) => {
      const token = localStorage.getItem('token') || '';
      return {
        url,
        options: {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            authorization: token,
          },
        },
      };
    },
  ],
  responseInterceptors: [
    async (response) => {
      const { config } = response;
      // 若为登录请求 获取响应头中的token放入localstorage中
      if (config.url?.includes('/login')) {
        const token = response.headers['authorization'];
        localStorage.setItem('token', token);
      }
      const { code } = response.data as Result;
      // 判断响应成功的
      if (code === ResponseCode.NOT_LOGIN) {
        // 跳转登录页面
        history.push('/login');
        return response;
      }

      return response;
    },
  ],
};
