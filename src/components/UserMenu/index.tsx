import { LocalStorageKey, LOGIN_URL } from '@/constants';
import { logout } from '@/services/Login/api';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { history } from '@umijs/max';
import { Dropdown } from 'antd';
import React from 'react';

const UserMenu: React.FC<{ defaultDom: React.ReactNode }> = ({
  defaultDom,
}) => {
  const handleLogout = () => {
    logout().then(() => {
      // 清除本地存储的 token
      localStorage.removeItem(LocalStorageKey.TOKEN);
      // 跳转登录页面
      history.push(LOGIN_URL);
    });
  };

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
};

export default UserMenu;
