import request from '../../../../utils/request';
import { ConfigForm, ConfigQuery, ConfigVO } from './types';
import { AxiosPromise } from 'axios';

// 查询参数列表
export function listConfig(query: ConfigQuery): AxiosPromise<ConfigVO[]> {
  return request({
    url: 'infra/admin/portal/config/list',
    method: 'get',
    params: query
  });
}

// 查询参数详细
export function getConfig(configId: string | number): AxiosPromise<ConfigVO> {
  return request({
    url: 'infra/admin/portal/config/' + configId,
    method: 'get'
  });
}

// 根据参数键名查询参数值
export function getPortalConfigKey(configKey: string): AxiosPromise<string> {
  return request({
    url: 'infra/admin/portal/config/configKey/' + configKey,
    method: 'get'
  });
}

// 新增参数配置
export function addConfig(data: ConfigForm) {
  return request({
    url: 'infra/admin/portal/config',
    method: 'post',
    data: data
  });
}

// 修改参数配置
export function updateConfig(data: ConfigForm) {
  return request({
    url: 'infra/admin/portal/config',
    method: 'put',
    data: data
  });
}

// 修改参数配置
export function updatePortalConfigByKey(key: string, value: any) {
  return request({
    url: 'infra/admin/portal/config/updateByKey',
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
    url: 'infra/admin/portal/config/' + configId,
    method: 'delete'
  });
}

// 刷新参数缓存
export function refreshCache() {
  return request({
    url: 'infra/admin/portal/config/refreshCache',
    method: 'delete'
  });
}
