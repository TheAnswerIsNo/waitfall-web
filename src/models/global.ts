// 全局共享数据示例
import { DEFAULT_NAME } from '@/constants';
import { useState } from 'react';

const useTitle = () => {
  const [title, setTitle] = useState<string>(DEFAULT_NAME);
  return {
    title,
    setTitle,
  };
};

export default useTitle;
