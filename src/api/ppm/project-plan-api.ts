/*
 * @Description:
 * @Autor: 王瑶
 * @Date: 2025-06-25 09:58:14
 * @LastEditors: 王瑶
 * @LastEditTime: 2025-07-18 16:42:21
 */
import request from '@/utils/request';
import { API_PREFIX } from '../prefix';
const getUrl = `/${API_PREFIX.ppm}/programPlan`;
/**
 * 分页接口
 * @param params 参数
 * @returns 回调
 */
const pageList = (params, timestamp = false) => {
  params = params || {};
  if (timestamp) {
    params['_t'] = Date.now();
  }
  return request({
    url: `${getUrl}/pageList`,
    method: 'get',
    params: {
      ...params
    }
  });
};
/**
 * 编辑接口
 * @param params 参数
 * @returns 回调
 */
const edit = (params) => {
  return request({
    url: `${getUrl}/edit`,
    method: 'post',
    data: {
      ...params
    }
  });
};
/**
 * 变更接口
 * @param params 参数
 * @returns 回调
 */
const changeProject = (params) => {
  return request({
    url: `${getUrl}/change`,
    method: 'post',
    data: {
      ...params
    }
  });
};
/**
 * 回退接口
 * @param params 参数
 * @returns 回调
 */
const getReturn = (params, timestamp = false) => {
  params = params || {};
  if (timestamp) {
    params['_t'] = Date.now();
  }
  return request({
    url: `${getUrl}/rollback`,
    method: 'post',
    data: {
      ...params
    }
  });
};

/**
 * 获取详情
 * @param params 参数
 * @returns 回调
 */
const getCriticalParts = (params) => {
  return request({
    url: `${getUrl}/criticalParts/${params}`,
    method: 'get',
  });
};
/**
 * 获取详情-关键部件详情
 * @param params 参数
 * @returns 回调
 */
const getCriticalPartsHistory = (params) => {
  return request({
    url: `${getUrl}/logCriticalParts/${params}`,
    method: 'get',
  });
};
/**
 * 查询里程碑节点
 * @param params 参数 根据项目计划ID查询里程碑节点列表。
 * @returns 回调
 */
const getMilestoneNodes = (params) => {
    return request({
      url: `${getUrl}/milestoneNodes/${params}`,
      method: 'get',
    });
  };
/**
 * 查询里程碑节点-变更历史
 * @param params 参数 根据项目计划ID查询里程碑节点列表。
 * @returns 回调
 */
const getMilestoneNodesHistory = (params) => {
    return request({
      url: `${getUrl}/logMilestoneNodes/${params}`,
      method: 'get',
    });
  };
/**
 * 关闭
 * @param params 参数
 * @returns 回调
 */
const close = (params) => {

  return request({
    url: `${getUrl}/close`,
    method: 'post',
    data: {
      ...params
    }
  });
};
/**
 * 计算里程碑日期
 * @param params 参数
 * @returns 回调
 */
const calculateMilestoneDates = (params) => {
    return request({
      url: `${getUrl}/calculateMilestoneDates`,
      method: 'post',
      data: {
        ...params
      }
    });
  };
// 导入文件
const collaboration = (params) => {
    return request({
      url: `${getUrl}/collaboration`,
      headers: {
          'Content-Type': 'multipart/form-data'
      },
      method: 'post',
      data: params,
    });
  };
    /**
 * 导出
 * @param params 参数
 * @returns 回调
 */
const exportListPage = (params) => {
    return request({
      url: `${getUrl}/export`,
      method: 'post',
      responseType: 'blob',
      data: {
        ...params,
      }
    });
  };
  /**
 * 根据id查询
 * @param params 参数
 * @returns 回调
 */
const get = (params) => {
    params = params || {};
    return request({
      url: `${getUrl}/get`,
      method: 'post',
      data: {
        ...params
      }
    });
  };
    /**
 * 查询变更历史
 * @param params 参数
 * @returns 回调
 */
const changeHistory = (params) => {
    return request({
      url: `${getUrl}/changeHistory/${params}`,
      method: 'get',
    });
  };
/**
 * 归档
 * @param params 参数
 * @returns 回调
 */
const archive = (params) => {
  params = params || {};
  return request({
    url: `${getUrl}/archive`,
    method: 'post',
    data: {
      ...params
    }
  });
};
/**
 * 送审
 * @param params 参数
 * @returns 回调
 */
const submit = (params) => {
    params = params || {};
    return request({
      url: `${getUrl}/submit`,
      method: 'post',
      data: {
        ...params
      }
    });
  };


export default {
  pageList,
  edit,
  getReturn,
  calculateMilestoneDates,
  getCriticalParts,
  getMilestoneNodes,
  close,
  collaboration,
  exportListPage,
  get,
  archive,
  changeHistory,
  submit,
  changeProject,
  getMilestoneNodesHistory,
  getCriticalPartsHistory
};
