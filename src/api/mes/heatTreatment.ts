import request from '@/utils/request';
import { API_PREFIX } from '../prefix';
const getUrl = `/${API_PREFIX.mes}`;
const getQmsUrl = `/${API_PREFIX.qms}`;
const getIpsUrl = `/${API_PREFIX.ips}`;
/**
 * 列表分页查询数据-热处理
 * @param params 参数
 * @returns 回调
 */
 const listPage = (params, timestamp = false) => {
    params = params || {};
    if (timestamp) {
      params['_t'] = Date.now();
    }
  return request({
    url: `${getUrl}/admin/taskCombinedFurnaceReportingRecord/pageTaskList`,
    method: 'post',
    data: {
      ...params,
    }
  });
};/**
 * 质互检结果查询
 * @param params 参数
 * @returns 回调
 */
 const getListPage = (params, timestamp = false) => {
    params = params || {};
    if (timestamp) {
      params['_t'] = Date.now();
    }
  return request({
    url: `${getQmsUrl}/admin/selfInspectionRecord/list`,
    method: 'post',
    data: {
      ...params,
    }
  });
};
/**
 * 专检结果查询
 * @param params 参数
 * @returns 回调
 */
 const ipqcTaskList = (params, timestamp = false) => {
    params = params || {};
    if (timestamp) {
      params['_t'] = Date.now();
    }
  return request({
    url: `${getQmsUrl}/admin/ipqcTask/list`,
    method: 'post',
    data: {
      ...params,
    }
  });
};
;/**
 * 质互检结果查询
 * @param params 参数
 * @returns 回调
 */
 const getIpsPage = (params, timestamp = false) => {
    params = params || {};
    if (timestamp) {
      params['_t'] = Date.now();
    }
  return request({
    url: `${getIpsUrl}/processManagement/technologyRegulation/get`,
    method: 'post',
    data: params
  });
};
/**
 * 新增专检任务
 * @param params 参数
 * @returns 回调
 */
const addBatch = (params) => {
  return request({
    url: `${getQmsUrl}/admin/ipqcTask/addBatch`,
    method: 'post',
    data: params
  });
}
/**
 * 质互检批量新增
 * @param params 参数
 * @returns 回调
 */
const selfInspectionRecord = (params) => {
  return request({
    url: `${getQmsUrl}/admin/selfInspectionRecord/addBatch`,
    method: 'post',
    data: params
  });
}
/**
 * 开工
 * @param params 参数
 * @returns 回调
 */
const startwork = (params) => {
  return request({
    url: `${getUrl}/admin/taskCombinedFurnaceReportingRecord/startwork`,
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
    startwork,
    shutdown,
    reporting,
    addBatch,
    selfInspectionRecord,
    getListPage,
    getIpsPage,
    ipqcTaskList
};
