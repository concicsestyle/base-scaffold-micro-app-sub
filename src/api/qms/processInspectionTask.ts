/*
 * @Description: 
 * @Autor: 王瑶
 * @Date: 2025-08-30 13:57:19
 * @LastEditors: 王瑶
 * @LastEditTime: 2025-09-02 10:21:14
 */
import request from '@/utils/request';
import { API_PREFIX } from '../prefix';
const getUrl = `/${API_PREFIX.qms}`;
/**
 * 过程检验任务分页查询
 * @param params 参数
 * @returns 回调
 */
 const listPage = (params, timestamp = false) => {
    params = params || {};
    if (timestamp) {
      params['_t'] = Date.now();
    }
  return request({
    url: `${getUrl}/admin/ipqcTask/pageList`,
    method: 'GET',
    params: {
      ...params,
    }
  });
};
/**
 * 检验完成
 * @param params 参数
 * @returns 回调
 */
const ipqcTaskEdit = (params) => {
  return request({
    url: `${getUrl}/admin/ipqcTask/edit`,
    method: 'post',
    data: params
  });
}
/**
 * 热处理停工
 * @param params 参数
 * @returns 回调
 */
const shutdown = (params) => {
  return request({
    url: `${getUrl}/admin/taskCombinedFurnaceReportingRecord/shutdown`,
    method: 'post',
    data: params
  });
}
/**
 * 热处理报工
 * @param params 参数
 * @returns 回调
 */
const reporting = (params) => {
  return request({
    url: `${getUrl}/admin/taskCombinedFurnaceReportingRecord/reporting`,
    method: 'post',
    data: params
  });
}
/**
 * 
 * @param params 参数
 * @returns 回调
 */
const processDispatch = (params) => {
  return request({
    url: `${getUrl}/admin/taskCombinedFurnaceReportingRecord`,
    method: 'post',
    data: params
  });
}
  /**
 * 通用--打印
 * @param params 参数
 * @returns 回调
 */
const taskGeneralPrint = (params) => {
    return request({
      url: `${getUrl}/admin/taskGeneral/printConstructionTicket/${params}`,
      method: 'get',
    });
  }
export default {
    listPage,
    ipqcTaskEdit
};
