import request from '../../../../utils/request';
import { TenantPkgForm, TenantPkgQuery, TenantPkgVO } from './types';
import { AxiosPromise } from 'axios';

// 查询租户套餐列表
export function listTenantPackage(query?: TenantPkgQuery): AxiosPromise<TenantPkgVO[]> {
  return request({
    url: 'infra/admin/global/tenantPackage/list',
    method: 'get',
    params: query
  });
}

// 查询租户套餐下拉选列表
export function selectTenantPackage(): AxiosPromise<TenantPkgVO[]> {
  return request({
    url: 'infra/admin/global/tenantPackage/selectList',
    method: 'get'
  });
}

// 查询租户套餐详细
export function getTenantPackage(packageId: string | number): AxiosPromise<TenantPkgVO> {
  return request({
    url: 'infra/admin/global/tenantPackage/' + packageId,
    method: 'get'
  });
}

// 新增租户套餐
export function addTenantPackage(data: TenantPkgForm) {
  return request({
    url: 'infra/admin/global/tenantPackage',
    method: 'post',
    data: data
  });
}

// 修改租户套餐
export function updateTenantPackage(data: TenantPkgForm) {
  return request({
    url: 'infra/admin/global/tenantPackage',
    method: 'put',
    data: data
  });
}

// 租户套餐状态修改
export function changePackageStatus(packageId: number | string, status: string) {
  const data = {
    packageId,
    status
  };
  return request({
    url: 'infra/admin/global/tenantPackage/changeStatus',
    method: 'put',
    data: data
  });
}

// 删除租户套餐
export function delTenantPackage(packageId: string | number | Array<string | number>) {
  return request({
    url: 'infra/admin/global/tenantPackage/' + packageId,
    method: 'delete'
  });
}
