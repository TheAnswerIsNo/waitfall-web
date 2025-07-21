import { request } from '@umijs/max';

export async function login(value: any) {
  return request<Result>('/login', {
    method: 'POST',
    data: value,
  });
}

export async function logout() {
  return request<Result>('/logout', {
    method: 'POST',
  });
}
