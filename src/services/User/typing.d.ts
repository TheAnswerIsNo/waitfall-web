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
