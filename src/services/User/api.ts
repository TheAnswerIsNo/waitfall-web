import { request } from '@umijs/max';

export async function queryUserList(params: {
  keyword?: string;
  current?: number;
  pageSize?: number;
}) {
  return request<Result>('/user/list', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}
