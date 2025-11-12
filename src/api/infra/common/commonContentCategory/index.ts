import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { CommonContentCategoryVO, CommonContentCategoryForm, CommonContentCategoryQuery } from './types';

/**
 * 查询通用内容分类列表
 * @param query
 * @returns {*}
 */
export const treeListCommonContentCategory = (query?: CommonContentCategoryQuery): AxiosPromise<CommonContentCategoryVO[]> => {
  return request({
    url: '/infra/admin/common/contentCategory/treeList',
    method: 'get',
    params: query
  });
};

/**
 * 查询通用内容分类列表
 * @param query
 * @returns {*}
 */
export const listCommonContentCategory = (query?: CommonContentCategoryQuery): AxiosPromise<CommonContentCategoryVO[]> => {
  return request({
    url: '/infra/admin/common/contentCategory/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询通用内容分类详细
 * @param id
 */
export const getCommonContentCategory = (id: string | number): AxiosPromise<CommonContentCategoryVO> => {
  return request({
    url: '/infra/admin/common/contentCategory/' + id,
    method: 'get'
  });
};

/**
 * 新增通用内容分类
 * @param data
 */
export const addCommonContentCategory = (data: CommonContentCategoryForm) => {
  return request({
    url: '/infra/admin/common/contentCategory',
    method: 'post',
    data: data
  });
};

/**
 * 修改通用内容分类
 * @param data
 */
export const updateCommonContentCategory = (data: CommonContentCategoryForm) => {
  return request({
    url: '/infra/admin/common/contentCategory',
    method: 'put',
    data: data
  });
};

/**
 * 删除通用内容分类
 * @param id
 */
export const delCommonContentCategory = (id: string | number | Array<string | number>) => {
  return request({
    url: '/infra/admin/common/contentCategory/' + id,
    method: 'delete'
  });
};
