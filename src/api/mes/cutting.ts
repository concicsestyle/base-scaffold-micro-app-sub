import request from '@/utils/request';
import { API_PREFIX } from '../prefix';
const getUrl = `/${API_PREFIX.mes}`;
const getQmsUrl = `/${API_PREFIX.qms}`;
const getIpsUrl = `/${API_PREFIX.ips}`;
/**
 * 列表分页查询数据-下料
 * @param params 参数
 * @returns 回调
 */
 const listPage = (params, timestamp = false) => {
    params = params || {};
    if (timestamp) {
      params['_t'] = Date.now();
    }
  return request({
    url: `${getUrl}/admin/taskMaterialPanel/getList`,
    method: 'post',
    data: {
      ...params,
    }
  });
};
/**
 * 列表分页查询数据-下料
 * @param params 参数
 * @returns 回调
 */
 const pageTaskList = (params, timestamp = false) => {
    params = params || {};
    if (timestamp) {
      params['_t'] = Date.now();
    }
  return request({
    url: `${getUrl}/admin/taskMaterialPanelReportingRecord/pageTaskList`,
    method: 'post',
    data: {
      ...params,
    }
  });
};
/**
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
    method: 'GET',
    params: {
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
    url: `${getUrl}/admin/taskMaterialPanelReportingRecord/startwork`,
    method: 'post',
    data: params
  });
}
/**
 * 下料停工
 * @param params 参数
 * @returns 回调
 */
const shutdown = (params) => {
  return request({
    url: `${getUrl}/admin/taskMaterialPanelReportingRecord/shutdown`,
    method: 'post',
    data: params
  });
}
/**
 * 下料报工
 * @param params 参数
 * @returns 回调
 */
const reporting = (params) => {
  return request({
    url: `${getUrl}/admin/taskMaterialPanelReportingRecord/reporting`,
    method: 'post',
    data: params
  });
}
/**
 * 入库编号 排料程序号
 * @param params 参数
 * @returns 回调
 */
const bindById = (params) => {
  return request({
    url: `${getUrl}/admin/taskMaterialPanelReportingRecord/bindById`,
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
    pageTaskList,
    startwork,
    shutdown,
    reporting,
    addBatch,
    selfInspectionRecord,
    getListPage,
    getIpsPage,
    bindById
};
