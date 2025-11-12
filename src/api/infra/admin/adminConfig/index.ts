import request from '../../../../utils/request';
import { ConfigForm, ConfigQuery, ConfigVO } from './types';
import { AxiosPromise } from 'axios';

// 查询参数列表
export function listConfig(query: ConfigQuery): AxiosPromise<ConfigVO[]> {
  return request({
    url: 'infra/admin/admin/config/list',
    method: 'get',
    params: query
  });
}

// 查询参数详细
export function getConfig(configId: string | number): AxiosPromise<ConfigVO> {
  return request({
    url: 'infra/admin/admin/config/' + configId,
    method: 'get'
  });
}

// 根据参数键名查询参数值
export function getAdminConfigKey(configKey: string): AxiosPromise<string> {
  return request({
    url: 'infra/admin/admin/config/configKey/' + configKey,
    method: 'get'
  });
}

// 新增参数配置
export function addConfig(data: ConfigForm) {
  return request({
    url: 'infra/admin/admin/config',
    method: 'post',
    data: data
  });
}

// 修改参数配置
export function updateConfig(data: ConfigForm) {
  return request({
    url: 'infra/admin/admin/config',
    method: 'put',
    data: data
  });
}

// 修改参数配置
export function updateAdminConfigByKey(key: string, value: any) {
  return request({
    url: 'infra/admin/admin/config/updateByKey',
    method: 'put',
    data: {
      configKey: key,
      configValue: value
    }
  });
}

// 删除参数配置
export function delConfig(configId: string | number | Array<string | number>) {
  return request({
    url: 'infra/admin/admin/config/' + configId,
    method: 'delete'
  });
}

// 刷新参数缓存
export function refreshCache() {
  return request({
    url: 'infra/admin/admin/config/refreshCache',
    method: 'delete'
  });
}
