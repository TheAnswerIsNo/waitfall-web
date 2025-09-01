import { CopyOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import React from 'react';

const Copy: React.FC<{ content: string }> = ({ content }) => {
    return (
        <Button type="text" size="small" icon={<CopyOutlined />}
            onClick={() => {
                navigator.clipboard.writeText(content);
                message.success('复制成功');
            }} />
    );
};

export default Copy;
