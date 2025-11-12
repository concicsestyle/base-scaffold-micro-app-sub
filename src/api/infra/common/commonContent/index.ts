import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { CommonContentVO, CommonContentForm, CommonContentQuery } from './types';

/**
 * 查询通用内容列表
 * @param query
 * @returns {*}
 */

export const listCommonContent = (query?: CommonContentQuery): AxiosPromise<CommonContentVO[]> => {
  return request({
    url: '/infra/admin/common/content/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询通用内容详细
 * @param id
 */
export const getCommonContent = (id: string | number): AxiosPromise<CommonContentVO> => {
  return request({
    url: '/infra/admin/common/content/' + id,
    method: 'get'
  });
};

/**
 * 新增通用内容
 * @param data
 */
export const addCommonContent = (data: CommonContentForm) => {
  return request({
    url: '/infra/admin/common/content',
    method: 'post',
    data: data
  });
};

/**
 * 修改通用内容
 * @param data
 */
export const updateCommonContent = (data: CommonContentForm) => {
  return request({
    url: '/infra/admin/common/content',
    method: 'put',
    data: data
  });
};

/**
 * 删除通用内容
 * @param id
 */
export const delCommonContent = (id: string | number | Array<string | number>) => {
  return request({
    url: '/infra/admin/common/content/' + id,
    method: 'delete'
  });
};
