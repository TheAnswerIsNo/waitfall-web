import { createUser } from '@/services/User/api';
import { Modal } from 'antd';
import React, { PropsWithChildren } from 'react';

interface CreateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  onRefreshTable: () => void;
}

const CreateForm: React.FC<PropsWithChildren<CreateFormProps>> = (props) => {
  const { modalVisible, onCancel, onRefreshTable } = props;

  const handleAddUser = () => {
    createUser({
      account: 'test',
      password: '123456',
      nickname: '管理员',
      unitId: '1',
      enabled: true,
      roleIds: ['2'],
    }).then(() => {
      onCancel();
      onRefreshTable();
    });
  };

  return (
    <Modal
      destroyOnHidden
      title="新建"
      width={420}
      open={modalVisible}
      onCancel={() => onCancel()}
      onOk={() => handleAddUser()}
    >
      {props.children}
    </Modal>
  );
};

export default CreateForm;
