import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { DictGroupForm, DictGroupQuery, DictGroupVO } from './types';

/**
 * 查询字典分组分页列表
 * @param query
 * @returns {*}
 */
export const pageListDictGroup = (query?: DictGroupQuery): AxiosPromise<DictGroupVO[]> => {
  return request({
    url: '/infra/admin/common/dictGroup/pageList',
    method: 'get',
    params: query
  });
};

/**
 * 查询字典分组列表
 * @param query
 * @returns {*}
 */
export const listDictGroup = (query?: DictGroupQuery): AxiosPromise<DictGroupVO[]> => {
  return request({
    url: '/infra/admin/common/dictGroup/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询字典分组详细
 * @param id
 */
export const getDictGroup = (id: string | number): AxiosPromise<DictGroupVO> => {
  return request({
    url: '/infra/admin/common/dictGroup/' + id,
    method: 'get'
  });
};

/**
 * 新增字典分组
 * @param data
 */
export const addDictGroup = (data: DictGroupForm) => {
  return request({
    url: '/infra/admin/common/dictGroup',
    method: 'post',
    data: data
  });
};

/**
 * 修改字典分组
 * @param data
 */
export const updateDictGroup = (data: DictGroupForm) => {
  return request({
    url: '/infra/admin/common/dictGroup',
    method: 'put',
    data: data
  });
};

/**
 * 删除字典分组
 * @param id
 */
export const delDictGroup = (id: string | number | Array<string | number>) => {
  return request({
    url: '/infra/admin/common/dictGroup/' + id,
    method: 'delete'
  });
};
