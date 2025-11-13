/*
 * @Description:
 * @Autor: 王瑶
 * @Date: 2025-06-25 09:58:14
 * @LastEditors: 王瑶
 * @LastEditTime: 2025-09-02 10:19:40
 */
import request from '@/utils/request';
import { API_PREFIX } from '../prefix';
const getUrl = `/${API_PREFIX.ppm}/masterPlan`;

/**
 * 分页接口——报表
 * @param params 参数
 * @returns 回调
 */
const reportPageList = (params) => {
  params = params || {};
  return request({
    url: `${getUrl}/shortage-report/outsourcing-plan/page`,
    method: 'get',
    params: {
      ...params
    }
  });
};
/**
 * 分页接口-缺表
 * @param params 参数
 * @returns 回调
 */
const outsourcingList = (params) => {
  params = params || {};
  return request({
    url: `${getUrl}/shortage-report/production-plan/page`,
    method: 'post',
    data: {
      ...params
    }
  });
};
/**
 * 导出——报表
 * @param params 参数
 * @returns 回调
 */
const exportReport = (params) => {
  return request({
    url: `${getUrl}/shortage-report/production-plan/export`,
    method: 'post',
    responseType: 'blob',
    data: params
  });
};

export default {
  reportPageList,
  exportReport,
  outsourcingList
};
