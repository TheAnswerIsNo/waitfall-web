import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';

const HomePage: React.FC = () => {
  const { title } = useModel('global');
  return (
    <PageContainer ghost>
      <div>title</div>
    </PageContainer>
  );
};

export default HomePage;
