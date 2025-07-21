import { history } from '@umijs/max';
import { Button, Result } from 'antd';

const Index: React.FC = () => {
  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Button type="primary" onClick={() => history.push('/')}>
          回到首页
        </Button>
      }
    />
  );
};

export default Index;
