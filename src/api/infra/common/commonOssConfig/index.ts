import request from '../../../../utils/request';
import { OssConfigForm, OssConfigQuery, OssConfigVO } from './types';
import { AxiosPromise } from 'axios';

// 查询对象存储配置列表
export function listOssConfig(query: OssConfigQuery): AxiosPromise<OssConfigVO[]> {
  return request({
    url: '/infra/admin/common/ossConfig/list',
    method: 'get',
    params: query
  });
}

// 查询对象存储配置详细
export function getOssConfig(ossConfigId: string | number): AxiosPromise<OssConfigVO> {
  return request({
    url: '/infra/admin/common/ossConfig/' + ossConfigId,
    method: 'get'
  });
}

// 新增对象存储配置
export function addOssConfig(data: OssConfigForm) {
  return request({
    url: '/infra/admin/common/ossConfig',
    method: 'post',
    data: data
  });
}

// 修改对象存储配置
export function updateOssConfig(data: OssConfigForm) {
  return request({
    url: '/infra/admin/common/ossConfig',
    method: 'put',
    data: data
  });
}

// 删除对象存储配置
export function delOssConfig(ossConfigId: string | number | Array<string | number>) {
  return request({
    url: '/infra/admin/common/ossConfig/' + ossConfigId,
    method: 'delete'
  });
}

// 对象存储状态修改
export function changeOssConfigStatus(ossConfigId: string | number, status: string, configKey: string) {
  const data = {
    ossConfigId,
    status,
    configKey
  };
  return request({
    url: '/infra/admin/common/ossConfig/changeStatus',
    method: 'put',
    data: data
  });
}
