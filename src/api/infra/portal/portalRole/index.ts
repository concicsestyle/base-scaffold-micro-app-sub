import { UserVO } from '../portalUser/types';
import { UserQuery } from '../portalUser/types';
import { AxiosPromise } from 'axios';
import { RoleQuery, RoleVO, RoleDeptTree } from './types';
import request from '../../../../utils/request';

export const listRole = (query: RoleQuery): AxiosPromise<RoleVO[]> => {
  return request({
    url: 'infra/admin/portal/role/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询角色详细
 */
export const getRole = (roleId: string | number): AxiosPromise<RoleVO> => {
  return request({
    url: 'infra/admin/portal/role/' + roleId,
    method: 'get'
  });
};

/**
 * 新增角色
 */
export const addRole = (data: any) => {
  return request({
    url: 'infra/admin/portal/role',
    method: 'post',
    data: data
  });
};

/**
 * 修改角色
 * @param data
 */
export const updateRole = (data: any) => {
  return request({
    url: 'infra/admin/portal/role',
    method: 'put',
    data: data
  });
};

/**
 * 角色数据权限
 */
export const dataScope = (data: any) => {
  return request({
    url: 'infra/admin/portal/role/dataScope',
    method: 'put',
    data: data
  });
};

/**
 * 角色状态修改
 */
export const changeRoleStatus = (roleId: string | number, status: string) => {
  const data = {
    roleId,
    status
  };
  return request({
    url: 'infra/admin/portal/role/changeStatus',
    method: 'put',
    data: data
  });
};

/**
 * 删除角色
 */
export const delRole = (roleId: Array<string | number> | string | number) => {
  return request({
    url: 'infra/admin/portal/role/' + roleId,
    method: 'delete'
  });
};

/**
 * 查询角色已授权用户列表
 */
export const allocatedUserList = (query: UserQuery): AxiosPromise<UserVO[]> => {
  return request({
    url: 'infra/admin/portal/role/authUser/allocatedList',
    method: 'get',
    params: query
  });
};

/**
 * 查询角色未授权用户列表
 */
export const unallocatedUserList = (query: UserQuery): AxiosPromise<UserVO[]> => {
  return request({
    url: 'infra/admin/portal/role/authUser/unallocatedList',
    method: 'get',
    params: query
  });
};

/**
 * 取消用户授权角色
 */
export const authUserCancel = (data: any) => {
  return request({
    url: 'infra/admin/portal/role/authUser/cancel',
    method: 'put',
    data: data
  });
};

/**
 * 批量取消用户授权角色
 */
export const authUserCancelAll = (data: any) => {
  return request({
    url: 'infra/admin/portal/role/authUser/cancelAll',
    method: 'put',
    params: data
  });
};

/**
 * 授权用户选择
 */
export const authUserSelectAll = (data: any) => {
  return request({
    url: 'infra/admin/portal/role/authUser/selectAll',
    method: 'put',
    params: data
  });
};
// 根据角色ID查询部门树结构
export const deptTreeSelect = (roleId: string | number): AxiosPromise<RoleDeptTree> => {
  return request({
    url: 'infra/admin/portal/role/deptTree/' + roleId,
    method: 'get'
  });
};
