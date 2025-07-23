declare namespace User {
  interface UserListVO {
    id?: string;
    nickname?: string;
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
    nickname?: string;
    account?: string;
    unitId?: string;
    roleIds?: string[];
  }

  interface UserInfo {
    id?: string;
    avatar?: string;
    nickname?: string;
    account?: string;
    unitId?: string;
    createdBy?: string;
    createTime?: string;
  }

  interface CreateUserDTO {
    account: string;
    password: string;
    nickname: string;
    unitId: string;
    enabled: boolean;
    roleIds: string[];
  }
}
