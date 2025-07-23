import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { history, RunTimeLayoutConfig, type RequestConfig } from '@umijs/max';
import { Button, Dropdown, message, Result } from 'antd';
import {
  DEFAULT_NAME,
  LocalStorageKey,
  LOGIN_URL,
  ResponseCode,
} from './constants';
import { logout } from './services/Login/api';

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<{ userInfo: User.UserInfo }> {
  let userInfo;
  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem(LocalStorageKey.TOKEN);
      const userInfo = JSON.parse(
        localStorage.getItem(LocalStorageKey.USER_INFO) || '',
      );
      if (!token || !userInfo) {
        history.push(LOGIN_URL);
      }
      return { userInfo };
    } catch (error) {
      history.push(LOGIN_URL);
    }
    return { userInfo: null };
  };
  if (history.location.pathname !== '/login') {
    const res = await fetchUserInfo();
    userInfo = res.userInfo;
  }
  return userInfo;
}

export const layout: RunTimeLayoutConfig = (initialState) => {
  const handleLogout = () => {
    logout().then(() => {
      // 清除本地存储的 token
      localStorage.removeItem(LocalStorageKey.TOKEN);
      // 跳转登录页面
      history.push(LOGIN_URL);
    });
  };

  const userInfo: any = initialState?.initialState;
  return {
    // 常用属性
    title: DEFAULT_NAME,
    logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
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
      src:
        userInfo?.avatar ||
        'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
      title: userInfo?.nickname,
      render: (_, defaultDom) => {
        return (
          <Dropdown
            menu={{
              items: [
                {
                  label: '个人信息',
                  key: 'profile',
                  icon: <UserOutlined />,
                },
                {
                  label: '退出登录',
                  key: 'logout',
                  icon: <LogoutOutlined />,
                  onClick: handleLogout,
                },
              ],
            }}
            trigger={['hover']}
          >
            {defaultDom}
          </Dropdown>
        );
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
          if (msg !== null) {
            message.open({
              type: 'success',
              content: msg,
            });
            break;
          }
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
