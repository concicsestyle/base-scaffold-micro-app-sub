import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { CategoryVO, CategoryForm, CategoryQuery, CategoryTreeVO } from '@/api/workflow/admin/category/types';

/**
 * 查询流程分类列表
 * @param query
 * @returns {*}
 */

export const listCategory = (query?: CategoryQuery): AxiosPromise<CategoryVO[]> => {
  return request({
    url: '/workflow/admin/category/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询流程分类详细
 * @param categoryId
 */
export const getCategory = (categoryId: string | number): AxiosPromise<CategoryVO> => {
  return request({
    url: '/workflow/admin/category/' + categoryId,
    method: 'get'
  });
};

/**
 * 新增流程分类
 * @param data
 */
export const addCategory = (data: CategoryForm) => {
  return request({
    url: '/workflow/admin/category',
    method: 'post',
    data: data
  });
};

/**
 * 修改流程分类
 * @param data
 */
export const updateCategory = (data: CategoryForm) => {
  return request({
    url: '/workflow/admin/category',
    method: 'put',
    data: data
  });
};

/**
 * 删除流程分类
 * @param categoryId
 */
export const delCategory = (categoryId: string | number | Array<string | number>) => {
  return request({
    url: '/workflow/admin/category/' + categoryId,
    method: 'delete'
  });
};

/**
 * 获取流程分类树列表
 * @param query 流程实例id
 * @returns
 */
export const categoryTree = (query?: CategoryForm): AxiosPromise<CategoryTreeVO[]> => {
  return request({
    url: `/workflow/admin/category/categoryTree`,
    method: 'get',
    params: query
  });
};
