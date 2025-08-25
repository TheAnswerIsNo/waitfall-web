import { history, RunTimeLayoutConfig, type RequestConfig } from '@umijs/max';
import { Button, message, Result } from 'antd';
import UserMenu from './components/UserMenu/index';
import {
  AVATAR_DEFAULT_URL,
  DEFAULT_NAME,
  LocalStorageKey,
  LOGIN_URL,
  LOGO_URL,
  ResponseCode,
} from './constants';
import { fetchUserInfo } from './services/Login/api';

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<any> {
  if (history.location.pathname === LOGIN_URL) {
    return {};
  } else {
    return fetchUserInfo().then((res) => {
      return res.data;
    });
  }
}

export const layout: RunTimeLayoutConfig = (initialState) => {
  const userInfo = initialState.initialState;
  return {
    // 常用属性
    title: DEFAULT_NAME,
    logo: LOGO_URL,
    menu: {
      locale: false,
    },
    layout: 'mix',
    unAccessible: (
      <Result
        status="403"
        title="403"
        subTitle="Sorry, you are not authorized to access this page."
        extra={
          <Button type="primary" onClick={() => history.push('/')}>
            回到首页
          </Button>
        }
      />
    ),
    avatarProps: {
      src: userInfo?.avatar || AVATAR_DEFAULT_URL,
      title: userInfo?.nickname,
      render: (_, defaultDom) => {
        return <UserMenu defaultDom={defaultDom} />;
      },
    },
  };
};

export const request: RequestConfig = {
  baseURL: '/api',
  timeout: 60000,
  errorConfig: {
    // 错误抛出
    errorThrower: (res: Result) => {
      const { code, msg } = res;
      if (code !== ResponseCode.SUCCESS) {
        const error: any = new Error(msg);
        error.name = 'BizError';
        error.info = res;
        throw error;
      }
    },
    // 错误接收及处理
    errorHandler: (error: any, opts: any) => {
      if (opts?.skipErrorHandler) throw error;
      if (error.name === 'BizError') {
        switch (error.info.code) {
          case ResponseCode.NOT_LOGIN:
            // 跳转登录页面
            history.push(LOGIN_URL);
            break;
          default:
            message.open({
              type: 'error',
              content: error.info.msg,
            });
            break;
        }
      } else if (error.request) {
        // 请求已经成功发起，但没有收到响应
        message.open({
          type: 'error',
          content: '服务器无响应，请重试！',
        });
      } else {
        // 发送请求时出了点问题
        message.open({
          type: 'error',
          content: '网络异常！',
        });
      }
    },
  },
  requestInterceptors: [
    (url: any, options: any) => {
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
        localStorage.setItem(LocalStorageKey.TOKEN, token);
      }
      const { code, msg } = response.data as Result;
      switch (code) {
        case ResponseCode.SUCCESS:
          if (!msg || msg !== 'ok') {
            message.open({
              type: 'success',
              content: msg,
            });
          }
          break;
        case ResponseCode.NOT_LOGIN:
          // 跳转登录页面
          message.open({
            type: 'error',
            content: msg,
          });
          history.push(LOGIN_URL);
          break;
        case ResponseCode.BUSINESS_ERROR:
          message.open({
            type: 'error',
            content: msg,
          });
          break;
        case ResponseCode.PARAM_ERROR:
          message.open({
            type: 'error',
            content: msg,
          });
          break;
        case ResponseCode.SERVER_ERROR:
          message.open({
            type: 'error',
            content: '服务器异常',
          });
          break;
        case ResponseCode.ACCESS_DENIED:
          message.open({
            type: 'error',
            content: msg,
          });
          break;
      }
      return response;
    },
  ],
};
