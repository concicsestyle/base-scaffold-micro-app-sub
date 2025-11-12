/*
 * @Description:
 * @Autor: 王瑶
 * @Date: 2025-06-25 09:58:14
 * @LastEditors: 王瑶
 * @LastEditTime: 2025-09-07 17:54:45
 */
import request from '@/utils/request';
import { API_PREFIX } from '../prefix';
const getUrl = `/${API_PREFIX.ppm}/firstPlan`;
/**
 * 分页查询一级计划-工序
 * @param params 参数
 * @returns 回调
 */
const procedurePage = (params) => {
  params = params || {};
  return request({
    url: `${getUrl}/procedure/page`,
    method: 'get',
    params: {
      ...params
    }
  });
};
/**
 * 分页查询一级计划出产信息
 * @param params 参数
 * @returns 回调
 */
const productPage = (params) => {
  params = params || {};
  return request({
    url: `${getUrl}/product/page`,
    method: 'get',
    params: {
      ...params
    }
  });
};
/**
 * 下发一级计划-工序数据到二级计划-零件
 * @param params 参数
 * @returns 回调
 */
const procedureIssue = (params) => {
    params = params || {};
    return request({
      url: `${getUrl}/procedure/issue`,
      method: 'post',
      data: {
        ...params
      }
    });
  };
  /**
 * 下发一级计划-出产数据到二级计划-出产
 * @param params 参数
 * @returns 回调
 */
const productIssue = (params) => {
    params = params || {};
    return request({
      url: `${getUrl}/product/issue`,
      method: 'post',
      data: {
        ...params
      }
    });
  };
export default {
  procedurePage,
  productPage,
  procedureIssue,
  productIssue
};
