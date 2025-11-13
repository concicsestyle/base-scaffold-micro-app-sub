import request from '@/utils/request';
import { API_PREFIX } from '../prefix';
const getUrl = `/${API_PREFIX.mes}`;
const getQmsUrl = `/${API_PREFIX.qms}`;
const getIpsUrl = `/${API_PREFIX.ips}`;
/**
 * 列表查询 - 机加（机加、铆焊、装配查询共用一个地址，用planType区分： “0：机加”）
 * @param params 参数
 * @returns 回调
 */
 const listPage = (params, timestamp = false) => {
    params = params || {};
    if (timestamp) {
      params['_t'] = Date.now();
    }
  return request({
    url: `${getUrl}/admin/taskReportingMachiningWorkStepRecord/pageTaskList`,
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
    url: `${getUrl}/admin/taskReportingRivetSolderWorkStepRecord/startwork`,
    method: 'post',
    data: params
  });
}
/**
 * 铆焊停工
 * @param params 参数
 * @returns 回调
 */
const shutdown = (params) => {
  return request({
    url: `${getUrl}/admin/taskReportingRivetSolderWorkStepRecord/shutdown`,
    method: 'post',
    data: params
  });
}
/**
 * 铆焊报工
 * @param params 参数
 * @returns 回调
 */
const reporting = (params) => {
  return request({
    url: `${getUrl}/admin/taskReportingRivetSolderWorkStepRecord/reportingProcess`,
    method: 'post',
    data: params
  });
}
/**
 * 铆焊报工-卡号
 * @param params 参数
 * @returns 回调
 */
const reportingProcess = (params) => {
  return request({
    url: `${getUrl}/admin/taskReportingRivetSolderWorkStepRecord/reportingProcess`,
    method: 'post',
    data: params
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
    reportingProcess
};
