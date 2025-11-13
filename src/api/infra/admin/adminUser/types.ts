import { RoleVO } from '@/api/infra/admin/adminRole/types';
import { PostVO } from '@/api/infra/admin/adminPost/types';
import { DeptVO } from '@/api/infra/admin/adminDept/types';

/**
 * 用户信息
 */
export interface UserInfo {
  user: UserVO;
  roles: string[];
  permissions: string[];
  deptList: DeptVO[];
}

/**
 * 用户查询对象类型
 */
export interface UserQuery extends PageQuery {
  userName?: string;
  nickName?: string;
  phone?: string;
  email?: string;
  status?: string;
  deptId?: string | number;
  roleId?: string | number;
  userIds?: string;
  staffCode?: string;
  groupStaffCode?: string;
  containSubDeptFlag?: number;
}

/**
 * 用户返回对象
 */
export interface UserVO extends BaseEntity {
  userId: string | number;
  tenantId: string;
  deptId: number;
  userName: string;
  nickName: string;
  userType: string;
  email: string;
  phone: string;
  sex: string;
  avatar: string;
  status: string;
  delFlag: string;
  loginIp: string;
  loginDate: string;
  remark: string;
  deptName: string;
  roles: RoleVO[];
  roleIds: any;
  postIds: any;
  roleId: any;
  admin: boolean;
  staffCode?: string;
  groupStaffCode?: string;
  enterDate?: string;
  userDeptList?: any[];
}

/**
 * 用户表单类型
 */
export interface UserForm {
  id?: string;
  userId?: string;
  deptId?: number;
  userName: string;
  nickName?: string;
  password: string;
  phone?: string;
  email?: string;
  sex?: string;
  status: string;
  remark?: string;
  postIds: string[];
  roleIds: string[];
  dealRoleRelationFlag?: number;
  staffCode?: string;
  groupStaffCode?: string;
  enterDate?: string;
}

export interface UserInfoVO {
  user: UserVO;
  roles: RoleVO[];
  roleIds: string[];
  posts: PostVO[];
  postIds: string[];
  roleGroup: string;
  postGroup: string;
}

export interface ResetPwdForm {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UserAndDept {
  id?: string;
  parentId: string;
  Name: string;
  type: string;
  children: UserAndDept[];
}
