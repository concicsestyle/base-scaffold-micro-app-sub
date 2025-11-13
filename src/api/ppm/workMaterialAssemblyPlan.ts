/*
 * @Description:
 * @Autor: 王瑶
 * @Date: 2025-06-25 09:58:14
 * @LastEditors: 王瑶
 * @LastEditTime: 2025-09-02 10:20:54
 */
import request from '@/utils/request';
import { API_PREFIX } from '../prefix';
const getUrl = `/${API_PREFIX.ppm}`;
const getMesUrl = `/${API_PREFIX.mes}`;
const getBasicUrl = `/${API_PREFIX.basic}`;

/**
 * 分页接口——未接受数据-主表
 * @param params 参数
 * @returns 回调
 */
const monthPlanPageList = (params) => {
  params = params || {};
  return request({
    url: `${getUrl}/admin/assemblyPlan/listPendingReceiveCyclePlans`,
    method: 'get',
    params: {
      ...params
    }
  });
};
/**
 * 分页接口——未接受数据-子表
 * @param params 参数
 * @returns 回调
 */
const assemblyPlanLevel = (params) => {
  params = params || {};
  return request({
    url: `${getUrl}/admin/assemblyPlan/list`,
    method: 'get',
    params: {
      ...params
    }
  });
};

/**
 * 分页接口——已接受数据 -主表
 * @param params 参数
 * @returns 回调
 */
const assemblyPlanList = (params) => {
  params = params || {};
  return request({
    url: `${getUrl}/admin/assemblyPlan/pageList`,
    method: 'get',
    params: {
      ...params
    }
  });
};
/**
 * 分页接口——已接受数据-子表
 * @param params 参数
 * @returns 回调
 */
const assemblyPlanListLeve = (params) => {
  params = params || {};
  return request({
    url: `${getUrl}/admin/assemblyPlanPart/list`,
    method: 'get',
    params: {
      ...params
    }
  });
};/**
 * 接收
 * @param params 参数
 * @returns 回调
 */
const receive = (params) => {
  return request({
    url: `${getUrl}/admin/assemblyPlan/receive`,
    method: 'post',
    data: params
  });
}
/**
 * 批量修改
 * @param params 参数
 * @returns 回调
 */
const updateBatch = (params) => {
  return request({
    url: `${getUrl}/admin/assemblyPlanPart/updateBatch`,
    method: 'post',
    data: params
  });
}
/**
 * 计划拆分-计划下表
 * @param params 参数
 * @returns 回调
 */
const planToSplit = (params) => {
  params = params || {};
  return request({
    url: `${getUrl}/admin/assemblyPlanPart/splitAssemblyPlan`,
    method: 'post',
    data: {
      ...params
    }
  });
}/**
 *  通用派工单元获取
 * @param params 参数
 * @returns 回调
 */
 const getWorkCenterBySection = (params) => {
    params = params || {};
  return request({
    url: `${getBasicUrl}/workCenterEz/basicWorkCenter/getWorkCenterBySection`,
    method: 'post',
    data: {
      ...params,
    }
  });
};
/**
 *  派工-多条
 * @param params 参数
 * @returns 回调
 */
 const addBatch = (params) => {
    params = params || {};
  return request({
    url: `${getMesUrl}/admin/taskAssembly/addBatch`,
    method: 'post',
    data: params
  });
};
/**
 *  改派-多条
 * @param params 参数
 * @returns 回调
 */
 const editBatch = (params) => {
    params = params || {};
  return request({
    url: `${getMesUrl}/admin/taskAssembly/editBatch`,
    method: 'post',
    data: params
  });
};
/**
 * 导出——未接受报表
 * @param params 参数
 * @returns 回调
 */
const exportReport = (params) => {
  return request({
    url: `${getUrl}/materialcuttingplan/monthPlan/export`,
    method: 'get',
    responseType: 'blob',
    params: {
      ...params
    }
  });
};
/**
 * 导出——已接受 计划
 * @param params 参数
 * @returns 回调
 */
const exportFlie = (params) => {
  return request({
    url: `${getUrl}/materiapanelplan/export`,
    method: 'get',
    responseType: 'blob',
    params: {
      ...params
    }
  });
};

/**
 * 未接受 二级列表
 * @param params 参数
 * @returns 回调
 */
const cuttingList = (params) => {
  params = params || {};
  return request({
    url: `${getUrl}/materialcuttingplan/monthPlan/cutting/list`,
    method: 'get',
    params: {
      ...params
    }
  });
}
/**
 * 撤销
 * @param params 参数
 * @returns 回调
 */
const revoke = (params) => {
  return request({
    url: `${getUrl}/materiapanelplan/revoke`,
    method: 'post',
    data: params
  });
}
/**
 * 计划下达
 * @param params 参数
 * @returns 回调
 */
const planIssued = (params) => {
  return request({
    url: `${getUrl}/materiapanelplan/planIssued`,
    method: 'post',
    data: params
  });
}
/**
 * 批量新增下料板材计划子表
 * @param params 参数
 * @returns 回调
 */
const saveBoardData = (panelPlanId,params) => {
  return request({
    url: `${getUrl}/materiapanelplan/panel/sub/batch/${panelPlanId}`,
    method: 'post',
    data: params
  });
}
/**
 * 合并
 * @param params 参数
 * @returns 回调
 */
const merge = (params) => {
  return request({
    url: `${getUrl}/materiapanelplan/merge`,
    method: 'post',
    data: params
  });
}
/**
 * 未接受查询
 * @param params 参数
 * @returns 回调
 */
const listPendingReceiveCyclePlans = (params) => {
  return request({
    url: `${getUrl}/materialcuttingplan/monthPlan/listPendingReceiveCyclePlans`,
    method: 'get',
    params: {
      ...params
    }
  });
}

/**
 * 批量修改-计划下表
 * @param params 参数
 * @returns 回调
 */
const updataStatus = (params) => {
  return request({
    url: `${getUrl}/materialcuttingplan/cuttingplan/cutting/updataStatus`,
    method: 'post',
    data: params
  });
}
/**
 * 打印(三级计划)
 * @param params 参数
 * @returns 回调
 */
const printConstructionTicket = (params) => {
    return request({
      url: `${getUrl}/thirdplan/manage/printConstructionTicket/${params}`,
      method: 'get',
    
    });
  };
  /**
 * 打印(下料计划)
 * @param params 参数
 * @returns 回调
 */
const MaterialCuttingPrint = (params) => {
    return request({
      url: `${getUrl}/materiapanelplan/printConstructionTicket/${params}`,
      method: 'get',
    });
  };
export default {
  monthPlanPageList,
  assemblyPlanLevel,
  assemblyPlanList,
  assemblyPlanListLeve,
  receive,
  updateBatch,
  getWorkCenterBySection,
  addBatch,
  editBatch,
  // panelList,
  // cuttingplanList,
  // exportFlie,
  // merge,
  // panelbatch,
  // revoke,
  // saveBoardData,
  // updataStatus,
  planToSplit,
  // listPendingReceiveCyclePlans,
  // planIssued,
  // printConstructionTicket,
  // MaterialCuttingPrint
}
