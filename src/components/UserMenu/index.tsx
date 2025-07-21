import { LocalStorageKey, LOGIN_URL, ResponseCode } from '@/constants';
import { logout } from '@/services/Login/api';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { history, useModel } from '@umijs/max';
import { Avatar, Dropdown, MenuProps, message, Space } from 'antd';

const UserMenu: React.FC = () => {
  const { userInfo } = useModel('@@initialState', (initialState: any) => ({
    userInfo: initialState.userInfo,
  }));

  const handleLogout = async () => {
    const res = await logout();
    if (res.code === ResponseCode.SUCCESS) {
      // 清除本地存储的 token
      localStorage.removeItem(LocalStorageKey.TOKEN);

      // 跳转登录页面
      history.push(LOGIN_URL);
      message.open({
        type: 'success',
        content: res.msg,
      });
    } else {
      message.open({
        type: 'error',
        content: res.msg,
      });
    }
  };

  const menu: MenuProps = {
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
  };

  return (
    <Dropdown menu={menu} trigger={['hover']}>
      <Space>
        <Avatar
          icon={
            userInfo?.avatar ? (
              <img src={userInfo.avatar} alt={userInfo.nickname} />
            ) : (
              <UserOutlined />
            )
          }
        />

        <span>{userInfo?.nickname}</span>
      </Space>
    </Dropdown>
  );
};

export default UserMenu;
