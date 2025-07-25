import { DEFAULT_NAME } from '@/constants';
import { PageContainer } from '@ant-design/pro-components';

const HomePage: React.FC = () => {
  return (
    <PageContainer ghost>
      <div>{DEFAULT_NAME}</div>
    </PageContainer>
  );
};

export default HomePage;
