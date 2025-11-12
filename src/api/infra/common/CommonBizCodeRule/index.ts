import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { BizCodeRuleForm, BizCodeRuleQuery, BizCodeRuleVO } from './types';

/**
 * 查询业务编码规则分页列表
 * @param query
 * @returns {*}
 */
export const pageListBizCodeRule = (query?: BizCodeRuleQuery): AxiosPromise<BizCodeRuleVO[]> => {
  return request({
    url: '/infra/admin/common/bizCodeRule/pageList',
    method: 'get',
    params: query
  });
};

/**
 * 查询业务编码规则列表
 * @param query
 * @returns {*}
 */
export const listBizCodeRule = (query?: BizCodeRuleQuery): AxiosPromise<BizCodeRuleVO[]> => {
  return request({
    url: '/infra/admin/common/bizCodeRule/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询业务编码规则详细
 * @param id
 */
export const getBizCodeRule = (id: string | number): AxiosPromise<BizCodeRuleVO> => {
  return request({
    url: '/infra/admin/common/bizCodeRule/' + id,
    method: 'get'
  });
};

/**
 * 新增业务编码规则
 * @param data
 */
export const addBizCodeRule = (data: BizCodeRuleForm) => {
  return request({
    url: '/infra/admin/common/bizCodeRule',
    method: 'post',
    data: data
  });
};

/**
 * 修改业务编码规则
 * @param data
 */
export const updateBizCodeRule = (data: BizCodeRuleForm) => {
  return request({
    url: '/infra/admin/common/bizCodeRule',
    method: 'put',
    data: data
  });
};

/**
 * 删除业务编码规则
 * @param id
 */
export const delBizCodeRule = (id: string | number | Array<string | number>) => {
  return request({
    url: '/infra/admin/common/bizCodeRule/' + id,
    method: 'delete'
  });
};
