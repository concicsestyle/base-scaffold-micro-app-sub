import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { BizCodeHistoryForm, BizCodeHistoryQuery, BizCodeHistoryVO } from './types';

/**
 * 查询业务编码历史分页列表
 * @param query
 * @returns {*}
 */
export const pageListBizCodeHistory = (query?: BizCodeHistoryQuery): AxiosPromise<BizCodeHistoryVO[]> => {
  return request({
    url: '/infra/admin/common/bizCodeHistory/pageList',
    method: 'get',
    params: query
  });
};

/**
 * 查询业务编码历史列表
 * @param query
 * @returns {*}
 */
export const listBizCodeHistory = (query?: BizCodeHistoryQuery): AxiosPromise<BizCodeHistoryVO[]> => {
  return request({
    url: '/infra/admin/common/bizCodeHistory/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询业务编码历史详细
 * @param id
 */
export const getBizCodeHistory = (id: string | number): AxiosPromise<BizCodeHistoryVO> => {
  return request({
    url: '/infra/admin/common/bizCodeHistory/' + id,
    method: 'get'
  });
};

/**
 * 新增业务编码历史
 * @param data
 */
export const addBizCodeHistory = (data: BizCodeHistoryForm) => {
  return request({
    url: '/infra/admin/common/bizCodeHistory',
    method: 'post',
    data: data
  });
};

/**
 * 修改业务编码历史
 * @param data
 */
export const updateBizCodeHistory = (data: BizCodeHistoryForm) => {
  return request({
    url: '/infra/admin/common/bizCodeHistory',
    method: 'put',
    data: data
  });
};

/**
 * 删除业务编码历史
 * @param id
 */
export const delBizCodeHistory = (id: string | number | Array<string | number>) => {
  return request({
    url: '/infra/admin/common/bizCodeHistory/' + id,
    method: 'delete'
  });
};
