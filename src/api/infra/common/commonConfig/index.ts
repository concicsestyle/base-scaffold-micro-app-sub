import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { CommonConfigVO, CommonConfigForm, CommonConfigQuery } from './types';

/**
 * 查询通用配置列表
 * @param query
 * @returns {*}
 */

export const listCommonConfig = (query?: CommonConfigQuery): AxiosPromise<CommonConfigVO[]> => {
  return request({
    url: '/infra/admin/common/config/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询通用配置详细
 * @param id
 */
export const getCommonConfig = (id: string | number): AxiosPromise<CommonConfigVO> => {
  return request({
    url: '/infra/admin/common/config/' + id,
    method: 'get'
  });
};

/**
 * 根据code查询通用配置详细
 * @param code
 */
export const getCommonConfigByCode = (code: string | number): AxiosPromise<CommonConfigVO> => {
  return request({
    url: '/infra/admin/common/config/queryByCode',
    method: 'get',
    params: { code }
  });
};

/**
 * 新增通用配置
 * @param data
 */
export const addCommonConfig = (data: CommonConfigForm) => {
  return request({
    url: '/infra/admin/common/config',
    method: 'post',
    data: data
  });
};

/**
 * 修改通用配置
 * @param data
 */
export const updateCommonConfig = (data: CommonConfigForm) => {
  return request({
    url: '/infra/admin/common/config',
    method: 'put',
    data: data
  });
};

/**
 * 删除通用配置
 * @param id
 */
export const delCommonConfig = (id: string | number | Array<string | number>) => {
  return request({
    url: '/infra/admin/common/config/' + id,
    method: 'delete'
  });
};
