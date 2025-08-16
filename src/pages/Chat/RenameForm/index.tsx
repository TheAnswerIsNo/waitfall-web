import { Input, Modal } from 'antd';
import { useState } from 'react';

export interface RenameFormProps {
  close: () => void;
  open: boolean;
  values: { id: string; value: string };
}

const RenameForm: React.FC<RenameFormProps> = (props) => {
  const [value, setValue] = useState(props.values.value);

  const handleRename = (id: string, val: string) => {
    // 请求
    props.close();
  };

  return (
    <Modal
      title="修改对话名称"
      open={props.open}
      destroyOnHidden
      centered
      onCancel={() => props.close()}
      onOk={() => handleRename(props.values.id, value)}
    >
      <Input
        className="mt-4 mb-4"
        defaultValue={props.values.value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />
    </Modal>
  );
};

export default RenameForm;
