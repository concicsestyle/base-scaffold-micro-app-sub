/*
 * @Description:
 * @Autor: 王瑶
 * @Date: 2025-06-25 09:58:14
 * @LastEditors: 王瑶
 * @LastEditTime: 2025-09-02 10:20:07
 */
import request from '@/utils/request';
import { API_PREFIX } from '../prefix';
const getUrl = `/${API_PREFIX.ppm}`;
/**
 * 分页查询热处理工序
 * @param params 参数
 * @returns 回调
 */
const pageList = (params) => {
  params = params || {};
  return request({
    url: `/${API_PREFIX.ppm}/thermalProcessingPlan/pageList`,
    method: 'get',
    params: {
      ...params
    }
  });
};
/**
 * 配炉功能
 * @param params
 * @returns
 */
const getFurnaceBatch = (params) => {
  return request({
    url: `${getUrl}/thermalProcessingHeatingPlan/furnaceBatch`,
    method: 'post',
    data: {
      ...params
    }
  });
};
/**
 * 作废
 * @param params
 * @returns
 */
const discard = (params) => {
  return request({
    url: `${getUrl}/thermalProcessingPlan/discard`,
    method: 'post',
    data: {
      ...params
    }
  });
};
/**
 * 暂停
 * @param params
 * @returns
 */
const suspend = (params) => {
  return request({
    url: `${getUrl}/thermalProcessingPlan/suspend`,
    method: 'post',
    data: {
      ...params
    }
  });
};
/**
 * 恢复暂停
 * @param params
 * @returns
 */
const resume = (params) => {
  return request({
    url: `${getUrl}/thermalProcessingPlan/resume`,
    method: 'post',
    data: {
      ...params
    }
  });
};
/**
 * 分页查询热处理工序
 * @param params 参数
 * @returns 回调
 */
const heatingPlanPageList = (params) => {
  params = params || {};
  return request({
    url: `/${API_PREFIX.ppm}/thermalProcessingHeatingPlan/pageList`,
    method: 'get',
    params: {
      ...params
    }
  });
};
/**
 * 添加零件
 * @param params
 * @returns
 */
const addParts = (params) => {
  return request({
    url: `${getUrl}/thermalProcessingHeatingPlan/addParts`,
    method: 'post',
    data: {
      ...params
    }
  });
};
/**
 * 撤销合炉计划
 * @param params
 * @returns
 */
const cancelHeatingPlan = (params) => {
  return request({
    url: `${getUrl}/thermalProcessingHeatingPlan/cancelHeatingPlan`,
    method: 'post',
    data: {
      ...params
    }
  });
};
/**
 * 配置合炉计划
 * @param params
 * @returns
 */
const configHeatingPlan = (params) => {
  return request({
    url: `${getUrl}/thermalProcessingHeatingPlan/configHeatingPlan`,
    method: 'post',
    data:params
  });
};
/**
 * 删除合炉计划
 * @param params
 * @returns
 */
const remove = (params) => {
  return request({
    url: `${getUrl}/thermalProcessingHeatingPlan/remove`,
    method: 'post',
    data: params
  });
};
/**
 * 删除零件
 * @param params
 * @returns
 */
const removeParts = (params) => {
  return request({
    url: `${getUrl}/thermalProcessingHeatingPlan/removeParts`,
    method: 'post',
    data: {
      ...params
    }
  });
};
/**
 * 根据合炉计划ID查询热处理工序
 * @param params
 * @returns
 */
const listByHeatingPlanId = (params) => {
    return request({
      url: `${getUrl}/thermalProcessingPlan/listByHeatingPlanId`,
      method: 'get',
      params: {
        ...params
      }
    });
  };
/**
 * 计划下达
 * @param params
 * @returns
 */
const issuePlan = (params) => {
    return request({
      url: `${getUrl}/thermalProcessingHeatingPlan/issuePlan`,
      method: 'post',
      data:params
    });
  };
/**
 * 导入配炉工艺
 * @param params
 * @returns
 */
const importProcess = (params) => {
    return request({
      url: `${getUrl}/thermalProcessingHeatingPlan/importProcess`,
      method: 'post',
      data:params
    });
  };
  
export default {
  pageList,
  getFurnaceBatch,
  addParts,
  discard,
  suspend,
  resume,
  heatingPlanPageList,
  cancelHeatingPlan,
  configHeatingPlan,
  remove,
  removeParts,
  listByHeatingPlanId,
  issuePlan,
  importProcess
};
