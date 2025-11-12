import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { BizCodeForm, BizCodeQuery, BizCodeVO } from './types';

/**
 * 查询业务编码分页列表
 * @param query
 * @returns {*}
 */
export const pageListBizCode = (query?: BizCodeQuery): AxiosPromise<BizCodeVO[]> => {
  return request({
    url: '/infra/admin/common/bizCode/pageList',
    method: 'get',
    params: query
  });
};

/**
 * 查询业务编码列表
 * @param query
 * @returns {*}
 */
export const listBizCode = (query?: BizCodeQuery): AxiosPromise<BizCodeVO[]> => {
  return request({
    url: '/infra/admin/common/bizCode/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询业务编码详细
 * @param id
 */
export const getBizCode = (id: string | number): AxiosPromise<BizCodeVO> => {
  return request({
    url: '/infra/admin/common/bizCode/' + id,
    method: 'get'
  });
};

/**
 * 新增业务编码
 * @param data
 */
export const addBizCode = (data: BizCodeForm) => {
  return request({
    url: '/infra/admin/common/bizCode',
    method: 'post',
    data: data
  });
};

/**
 * 修改业务编码
 * @param data
 */
export const updateBizCode = (data: BizCodeForm) => {
  return request({
    url: '/infra/admin/common/bizCode',
    method: 'put',
    data: data
  });
};

/**
 * 删除业务编码
 * @param id
 */
export const delBizCode = (id: string | number | Array<string | number>) => {
  return request({
    url: '/infra/admin/common/bizCode/' + id,
    method: 'delete'
  });
};

/**
 * 生成业务编码值
 * @param query
 * @returns {*}
 */
export const genBizCodeValue = (query?: BizCodeQuery) => {
  return request({
    url: '/infra/admin/common/bizCode/bizCodeValue/gen',
    method: 'get',
    params: query
  });
};

/**
 * 使业务编码值失效
 * @param query
 * @returns {*}
 */
export const expireBizCodeValue = (query?: BizCodeQuery) => {
  return request({
    url: '/infra/admin/common/bizCode/bizCodeValue/expire',
    method: 'get',
    params: query
  });
};
