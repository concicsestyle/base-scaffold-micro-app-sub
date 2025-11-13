/*
 * @Description:
 * @Autor: 王瑶
 * @Date: 2025-06-25 09:58:14
 * @LastEditors: 王瑶
 * @LastEditTime: 2025-09-02 10:16:30
 */
import request from '@/utils/request';
import { API_PREFIX } from '../prefix';
const getUrl = `/${API_PREFIX.ppm}/masterProjectPlan`;
const getNewUrl = `/${API_PREFIX.ppm}/masterPlan`;
/**
 * 左侧树接口
 * @param params 参数
 * @returns 回调
 */
const getTree = (params) => {
  params = params || {};
  return request({
    url: `${getNewUrl}/getTree`,
    method: 'post',
    data: {
      ...params
    }
  });
};
/**
 * 分页接口
 * @param params 参数
 * @returns 回调
 */
const pageList = (params) => {
  params = params || {};
  return request({
    url: `${getNewUrl}/pageList`,
    method: 'get',
    params: {
      ...params
    }
  });
};
/**
 * 计算接口
 * @param params 参数
 * @returns 回调
 */
const compute = (params) => {
  params = params || {};
  return request({
    url: `${getNewUrl}/calculate`,
    method: 'post',
    data: {
      ...params
    }
  });
};
/**
 * 关闭归档
 * @param params 参数
 * @returns 回调
 */
const updateState = (params) => {
  params = params || {};
  return request({
    url: `${getNewUrl}/closeOrArchive `,
    method: 'post',
    data: {
      ...params
    }
  });
};
/**
 * 导出
 * @param params 参数
 * @returns 回调
 */
const exportListPage = (params) => {
  return request({
    url: `${getNewUrl}/export`,
    method: 'post',
    responseType: 'blob',
    data: params
  });
};
/**
 * 获取子表
 * @param params 参数
 * @returns 回调
 */
const changeData = (masterPlanId) => {
  return request({
    url: `${getNewUrl}/querySubTables/${masterPlanId}`,
    method: 'get',
    data: {}
  });
};
/**
 * 锁定或解锁
 * @param params 参数
 * @returns 回调
 */
const lockOrUnlock = (params) => {
  params = params || {};
  return request({
    url: `${getNewUrl}/lock`,
    method: 'post',
    data: params
  });
};
// 导入文件 /importDate
const importDate = (params) => {
  return request({
    url: `${getNewUrl}/importPlanDate`,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    method: 'post',
    data: params
  });
};
/**
 * 转换逻辑
 * @param params 参数
 * @returns 回调
 */
const conversion = (params) => {
  return request({
    url: `${getNewUrl}/convert`,
    method: 'post',
    data: params
  });
};
/**
 * 拆分数量
 * @param params 参数
 * @returns 回调
 */
const splitQuantity = (params) => {
  return request({
    url: `${getUrl}/splitQuantity`,
    method: 'post',
    data: params
  });
};
/**
 * 主计划修改查询
 * @param params 参数
 * @returns 回调
 */
const getUpdateData = (params) => {
    return request({
      url: `${getUrl}/getUpdateData`,
      method: 'post',
      data: params
    });
  };
  /**
 * 计划修改
 * @param params 参数
 * @returns 回调
 */
const updateData = (params) => {
    return request({
      url: `${getNewUrl}/edit`,
      method: 'post',
      data: params
    });
  };
  /**
 * 计划协同-编辑
 * @param params 参数
 * @returns 回调
 */
const procurementEdit = (params) => {
    return request({
      url: `${getNewUrl}/procurement/edit`,
      method: 'post',
      data: params
    });
  };
  /**
 * 计划修改---主计划变更接口
 * @param params 参数
 * @returns 回调
 */
const changeProject = (params) => {
    return request({
      url: `${getNewUrl}/change`,
      method: 'post',
      data: params
    });
  };
    /**
 * 变更历史——主计划
 * @param params 参数
 * @returns 回调
 */
const getProjectLogs = (masterPlanId) => {
    return request({
      url: `${getNewUrl}/changeHistory/${masterPlanId}`,
      method: 'get',
      data: {}
    });
  };
      /**
 * 变更历史——子计划
 * @param params 参数
 * @returns 回调
 */
const getProjectPlanLogData = (params) => {
    return request({
      url: `${getUrl}/getProjectPlanLogData`,
      method: 'post',
      data: params
    });
  };
        /**
 * 根据id查询工艺编制id
 * @param params 参数
 * @returns 回调
 */
const processFileViewing = (params) => {
    return request({
      url: `${getUrl}/processFileViewing`,
      method: 'post',
      data: params
    });
  };
  /**
 * 送审
 * @param params 参数
 * @returns 回调
 */
const approval = (params) => {
    params = params || {};
    return request({
      url: `${getNewUrl}/submitForReview`,
      method: 'post',
      data: params
    });
  };
export default {
  getTree,
  pageList,
  compute,
  updateState,
  changeData,
  exportListPage,
  lockOrUnlock,
  importDate,
  conversion,
  splitQuantity,
  getUpdateData,
  updateData,
  getProjectLogs,
  getProjectPlanLogData,
  processFileViewing,
  approval,
  changeProject,
  procurementEdit
};
