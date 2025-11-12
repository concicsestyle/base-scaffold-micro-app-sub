import { DeptTreeVO, DeptVO, DeptForm } from '@/api/infra/admin/adminDept/types';
import { RoleVO } from '@/api/infra/admin/adminRole/types';
import request from '../../../../utils/request';
import { AxiosPromise } from 'axios';
import { UserForm, UserQuery, UserVO, UserInfoVO } from './types';
import { parseStrEmpty } from '@/utils/common';

/**
 * 查询用户列表
 * @param query
 */
export const listUser = (query: UserQuery): AxiosPromise<UserVO[]> => {
  return request({
    url: 'infra/admin/admin/user/list',
    method: 'get',
    params: query
  });
};

/**
 * 通过用户ids查询用户
 * @param userIds
 */
export const optionSelect = (userIds: (number | string)[]): AxiosPromise<UserVO[]> => {
  return request({
    url: 'infra/admin/admin/user/optionselect?userIds=' + userIds,
    method: 'get'
  });
};

/**
 * 获取用户详情
 * @param userId
 */
export const getUser = (userId?: string | number): AxiosPromise<UserInfoVO> => {
  return request({
    url: 'infra/admin/admin/user/' + parseStrEmpty(userId),
    method: 'get'
  });
};

/**
 * 新增用户
 */
export const addUser = (data: UserForm) => {
  return request({
    url: 'infra/admin/admin/user',
    method: 'post',
    data: data
  });
};

/**
 * 修改用户
 */
export const updateUser = (data: UserForm) => {
  return request({
    url: 'infra/admin/admin/user',
    method: 'put',
    data: data
  });
};

/**
 * 删除用户
 * @param userId 用户ID
 */
export const delUser = (userId: Array<string | number> | string | number) => {
  return request({
    url: 'infra/admin/admin/user/' + userId,
    method: 'delete'
  });
};

/**
 * 用户密码重置
 * @param userId 用户ID
 * @param password 密码
 */
export const resetUserPwd = (userId: string | number, password: string) => {
  const data = {
    userId,
    password
  };
  return request({
    url: 'infra/admin/admin/user/resetPwd',
    method: 'put',
    headers: {
      isEncrypt: true,
      repeatSubmit: false
    },
    data: data
  });
};

/**
 * 用户状态修改
 * @param userId 用户ID
 * @param status 用户状态
 */
export const changeUserStatus = (userId: number | string, status: string) => {
  const data = {
    userId,
    status
  };
  return request({
    url: 'infra/admin/admin/user/changeStatus',
    method: 'put',
    data: data
  });
};

/**
 * 查询用户个人信息
 */
export const getUserProfile = (): AxiosPromise<UserInfoVO> => {
  return request({
    url: 'infra/admin/admin/userProfile',
    method: 'get'
  });
};

/**
 * 修改用户个人信息
 * @param data 用户信息
 */
export const updateUserProfile = (data: UserForm) => {
  return request({
    url: 'infra/admin/admin/userProfile',
    method: 'put',
    data: data
  });
};

/**
 * 用户密码重置
 * @param oldPassword 旧密码
 * @param newPassword 新密码
 */
export const updateUserPwd = (oldPassword: string, newPassword: string) => {
  const data = {
    oldPassword,
    newPassword
  };
  return request({
    url: 'infra/admin/admin/userProfile/updatePwd',
    method: 'put',
    headers: {
      isEncrypt: true,
      repeatSubmit: false
    },
    data: data
  });
};

/**
 * 用户头像上传
 * @param data 头像文件
 */
export const uploadAvatar = (data: FormData) => {
  return request({
    url: 'infra/admin/admin/userProfile/avatar',
    method: 'post',
    data: data
  });
};

/**
 * 查询授权角色
 * @param userId 用户ID
 */
export const getAuthRole = (userId: string | number): AxiosPromise<{ user: UserVO; roles: RoleVO[] }> => {
  return request({
    url: 'infra/admin/admin/user/authRole/' + userId,
    method: 'get'
  });
};

/**
 * 保存授权角色
 * @param data 用户ID
 */
export const updateAuthRole = (data: { userId: string; roleIds: string }) => {
  return request({
    url: 'infra/admin/admin/user/authRole',
    method: 'put',
    params: data
  });
};

/**
 * 查询当前部门的所有用户信息
 * @param deptId
 */
export const listUserByDeptId = (deptId: string | number): AxiosPromise<UserVO[]> => {
  return request({
    url: 'infra/admin/admin/user/list/dept/' + deptId,
    method: 'get'
  });
};

/**
 * 查询部门下拉树结构
 */
export const deptTreeSelect = (): AxiosPromise<DeptTreeVO[]> => {
  return request({
    url: 'infra/admin/admin/user/deptTree',
    method: 'get'
  });
};

/**
 * 用户当前部门下角色列表
 */
export const userDeptRoleList = (): AxiosPromise<RoleVO[]> => {
  return request({
    url: 'infra/admin/admin/user/userDeptRoleList',
    method: 'post'
  });
};

/**
 * 用户当前部门
 */
export const userCurDept = (): AxiosPromise<DeptVO> => {
  return request({
    url: 'infra/admin/admin/user/userCurDept',
    method: 'post'
  });
};

/**
 * 切换用户当前部门
 */
export const changeCurDept = (data: DeptForm) => {
  return request({
    url: 'infra/admin/admin/user/changeCurDept',
    method: 'post',
    data: data
  });
};

/**
 * 查询用户部门关联列表
 */
export const userDeptList = (query: any) => {
  return request({
    url: 'infra/admin/admin/userDept/list',
    method: 'get',
    params: query
  });
};

/**
 * 新增用户部门关联
 */
export const addUserDept = (data: any) => {
  return request({
    url: 'infra/admin/admin/userDept',
    method: 'post',
    data: data
  });
};

/**
 * 更新用户部门关联
 */
export const updateUserDept = (data: any) => {
  return request({
    url: 'infra/admin/admin/userDept',
    method: 'put',
    data: data
  });
};

/**
 * 删除用户部门关联
 */
export const delUserDept = (data: any) => {
  return request({
    url: 'infra/admin/admin/userDept',
    method: 'delete',
    data: data
  });
};

/**
 * 查询用户角色列表
 */
export const userRoleList = (data: any) => {
  return request({
    url: 'infra/admin/admin/user/userRoleList',
    method: 'post',
    data: data
  });
};

/**
 * 新增/修改用户角色
 */
export const addOrUpdateUserRole = (data: any) => {
  return request({
    url: 'infra/admin/admin/user/addOrUpdateUserRole',
    method: 'post',
    data: data
  });
};

/**
 * 删除用户角色
 */
export const delUserRole = (data: any) => {
  return request({
    url: 'infra/admin/admin/user/delUserRole',
    method: 'post',
    data: data
  });
};

export default {
  listUser,
  getUser,
  addUser,
  updateUser,
  delUser,
  resetUserPwd,
  changeUserStatus,
  getUserProfile,
  updateUserProfile,
  updateUserPwd,
  uploadAvatar,
  getAuthRole,
  updateAuthRole,
  deptTreeSelect,
  listUserByDeptId
};
