// 全局共享数据示例
import { DEFAULT_NAME, LOGO_URL } from '@/constants';
import { useState } from 'react';

const useGlobal = () => {
  const [title, setTitle] = useState<string>(DEFAULT_NAME);
  const [logo, setLogo] = useState<string>(LOGO_URL);
  return {
    title,
    logo,
    setTitle,
    setLogo,
  };
};

export default useGlobal;
