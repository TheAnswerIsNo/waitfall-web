interface UserListVO {
  id?: string;
  nickName?: string;
  account?: string;
  unitId?: string;
  unitName?: string;
  enabled?: boolean;
  createdBy?: string;
  createdByName?: string;
  createTime?: string;
}

interface UserDetailVO {
  id?: string;
  nickName?: string;
  account?: string;
  unitId?: string;
  roleIds?: string[];
}

interface UserInfo {
  id?: string;
  avatar?: string;
  nickName?: string;
  account?: string;
  unitId?: string;
  createdBy?: string;
  createTime?: string;
}
