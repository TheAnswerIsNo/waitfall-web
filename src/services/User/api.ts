import { request } from '@umijs/max';

export async function queryUserList(params: {
  keyword?: string;
  current?: number;
  pageSize?: number;
}) {
  return request<Result>('/system/user/list', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export async function deleteUser(ids: any[]) {
  return request<Result>('/system/user/delete', {
    method: 'POST',
    data: ids,
  });
}

export async function createUser(params: User.CreateUserDTO) {
  return request<Result>('/system/user/add', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
