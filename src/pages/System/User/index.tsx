import { deleteUser, queryUserList } from '@/services/User/api';
import {
  ActionType,
  PageContainer,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { Button, message, Space } from 'antd';
import React, { useRef, useState } from 'react';
import CreateForm from './CreateForm';

const UserList: React.FC<unknown> = () => {
  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<React.Key[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const handleDeleteUser = () => {
    if (selectedRowsState.length === 0) {
      message.open({
        content: '请选择要删除的用户',
        type: 'warning',
      });
      return;
    }
    deleteUser(selectedRowsState).then(() => {
      actionRef.current?.reload();
      setSelectedRows([]);
    });
  };

  const columns: ProColumns<User.UserListVO>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      hideInTable: true,
      hideInForm: true,
      hideInSearch: true,
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      width: 120,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '昵称为必填项',
          },
        ],
      },
    },
    {
      title: '账号',
      dataIndex: 'account',
      hideInSearch: true,
      width: 120,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '账号为必填项',
          },
        ],
      },
    },
    {
      title: '单位id',
      dataIndex: 'unitId',
      hideInTable: true,
      hideInSearch: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '单位id为必填项',
          },
        ],
      },
    },
    {
      title: '单位名称',
      dataIndex: 'unitName',
      hideInForm: true,
      hideInSearch: true,
      width: 120,
    },
    {
      title: '创建人id',
      dataIndex: 'createdBy',
      hideInTable: true,
      hideInForm: true,
      hideInSearch: true,
    },
    {
      title: '创建人',
      dataIndex: 'createdByName',
      hideInForm: true,
      hideInSearch: true,
      width: 120,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      hideInForm: true,
      hideInSearch: true,
      width: 120,
    },
    {
      title: '是否启用',
      dataIndex: 'enabled',
      hideInSearch: true,
      width: 120,
      render: (value) => {
        return value ? '是' : '否';
      },
      formItemProps: {
        rules: [
          {
            required: true,
            message: '启用状态为必填项',
          },
        ],
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 200,
      render: () => (
        <>
          <Space>
            <Button type="primary">编辑</Button>
            <Button type="primary">分配角色</Button>
            <Button type="primary">修改密码</Button>
          </Space>
        </>
      ),
    },
  ];

  return (
    <PageContainer title={false}>
      <ProTable<User.UserListVO>
        actionRef={actionRef}
        rowKey="id"
        toolBarRender={() => [
          <Button key={1} type="primary" onClick={() => setModalVisible(true)}>
            添加
          </Button>,
          <Button
            key={2}
            type="default"
            danger
            onClick={() => handleDeleteUser()}
          >
            删除
          </Button>,
        ]}
        request={async (params) => {
          const { data } = await queryUserList(params);
          return {
            data: data?.data || [],
          };
        }}
        columns={columns}
        rowSelection={{
          onChange: (selectedRowKeys) => setSelectedRows(selectedRowKeys),
          getCheckboxProps: (record) => ({
            disabled: record.account === 'admin',
          }),
        }}
        options={false}
        tableAlertRender={false}
      />
      <CreateForm
        modalVisible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onRefreshTable={() => actionRef.current?.reload()}
      ></CreateForm>
    </PageContainer>
  );
};

export default UserList;
