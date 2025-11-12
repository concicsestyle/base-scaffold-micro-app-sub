import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { CommonErrorLogVO, CommonErrorLogForm, CommonErrorLogQuery } from './types';

/**
 * 查询错误日志分页列表
 * @param query
 * @returns {*}
 */
export const pageListCommonErrorLog = (query?: CommonErrorLogQuery): AxiosPromise<CommonErrorLogVO[]> => {
  return request({
    url: '/infra/admin/common/errorLog/pageList',
    method: 'get',
    params: query
  });
};

/**
 * 查询错误日志列表
 * @param query
 * @returns {*}
 */
export const listCommonErrorLog = (query?: CommonErrorLogQuery): AxiosPromise<CommonErrorLogVO[]> => {
  return request({
    url: '/infra/admin/common/errorLog/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询错误日志详细
 * @param id
 */
export const getCommonErrorLog = (id: string | number): AxiosPromise<CommonErrorLogVO> => {
  return request({
    url: '/infra/admin/common/errorLog/' + id,
    method: 'get'
  });
};

/**
 * 新增错误日志
 * @param data
 */
export const addCommonErrorLog = (data: CommonErrorLogForm) => {
  return request({
    url: '/infra/admin/common/errorLog',
    method: 'post',
    data: data
  });
};

/**
 * 修改错误日志
 * @param data
 */
export const updateCommonErrorLog = (data: CommonErrorLogForm) => {
  return request({
    url: '/infra/admin/common/errorLog',
    method: 'put',
    data: data
  });
};

/**
 * 删除错误日志
 * @param id
 */
export const delCommonErrorLog = (id: string | number | Array<string | number>) => {
  return request({
    url: '/infra/admin/common/errorLog/' + id,
    method: 'delete'
  });
};
