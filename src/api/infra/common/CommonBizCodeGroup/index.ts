import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { BizCodeGroupForm, BizCodeGroupQuery, BizCodeGroupVO } from './types';

/**
 * 查询业务编码分组分页列表
 * @param query
 * @returns {*}
 */
export const pageListBizCodeGroup = (query?: BizCodeGroupQuery): AxiosPromise<BizCodeGroupVO[]> => {
  return request({
    url: '/infra/admin/common/bizCodeGroup/pageList',
    method: 'get',
    params: query
  });
};

/**
 * 查询业务编码分组列表
 * @param query
 * @returns {*}
 */
export const listBizCodeGroup = (query?: BizCodeGroupQuery): AxiosPromise<BizCodeGroupVO[]> => {
  return request({
    url: '/infra/admin/common/bizCodeGroup/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询业务编码分组详细
 * @param id
 */
export const getBizCodeGroup = (id: string | number): AxiosPromise<BizCodeGroupVO> => {
  return request({
    url: '/infra/admin/common/bizCodeGroup/' + id,
    method: 'get'
  });
};

/**
 * 新增业务编码分组
 * @param data
 */
export const addBizCodeGroup = (data: BizCodeGroupForm) => {
  return request({
    url: '/infra/admin/common/bizCodeGroup',
    method: 'post',
    data: data
  });
};

/**
 * 修改业务编码分组
 * @param data
 */
export const updateBizCodeGroup = (data: BizCodeGroupForm) => {
  return request({
    url: '/infra/admin/common/bizCodeGroup',
    method: 'put',
    data: data
  });
};

/**
 * 删除业务编码分组
 * @param id
 */
export const delBizCodeGroup = (id: string | number | Array<string | number>) => {
  return request({
    url: '/infra/admin/common/bizCodeGroup/' + id,
    method: 'delete'
  });
};
