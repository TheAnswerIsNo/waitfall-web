export const DEFAULT_NAME = '等秋后台管理系统';

export const ResponseCode = {
  /** 未登录状态 */
  NOT_LOGIN: 401,
  /** 请求成功 */
  SUCCESS: 200,
  /** 服务器内部错误 */
  SERVER_ERROR: 500,
  /** 请求参数错误 */
  PARAM_ERROR: 400,
  // 可按需添加更多响应码
};

export const LOGIN_URL = '/login';

export const LocalStorageKey = {
  /** 登录 token */
  TOKEN: 'token',
  /** 用户信息 */
  USER_INFO: 'user_info',
};
