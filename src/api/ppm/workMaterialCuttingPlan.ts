/*
 * @Description:
 * @Autor: 王瑶
 * @Date: 2025-06-25 09:58:14
 * @LastEditors: 王瑶
 * @LastEditTime: 2025-09-14 16:24:38
 */
import request from '@/utils/request';
import { API_PREFIX } from '../prefix';
const getUrl = `/${API_PREFIX.ppm}`;

/**
 * 分页接口——未接受数据
 * @param params 参数
 * @returns 回调
 */
const monthPlanPageList = (params) => {
  params = params || {};
  return request({
    url: `${getUrl}/materialcuttingplan/monthPlan/monthPlan/list`,
    method: 'get',
    params: {
      ...params
    }
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
 * 导出——已接受 子表 计划
 * @param params 参数
 * @returns 回调
 */
const exportFlieLevel = (params) => {
  return request({
    url: `${getUrl}/materialcuttingplan/cuttingplan/exportData`,
    method: 'post',
    responseType: 'blob',
    data: {
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
}/**
 * 接收
 * @param params 参数
 * @returns 回调
 */
const receive = (params) => {
  return request({
    url: `${getUrl}/materialcuttingplan/monthPlan/monthPlan/receive`,
    method: 'post',
    data: {
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
 * 分页接口——已接受数据
 * @param params 参数
 * @returns 回调
 */
const panelList = (params) => {
  params = params || {};
  return request({
    url: `${getUrl}/materiapanelplan/panel/list`,
    method: 'get',
    params: {
      ...params
    }
  });
};
/**
 * 分页接口——已接受数据
 * @param params 参数
 * @returns 回调
 */
const cuttingplanList = (params) => {
  params = params || {};
  return request({
    url: `${getUrl}/materialcuttingplan/cuttingplan/cutting/pagelist`,
    method: 'get',
    params: {
      ...params
    }
  });
};
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
 * 批量修改
 * @param params 参数
 * @returns 回调
 */
const panelbatch = (params) => {
  return request({
    url: `${getUrl}/materiapanelplan/panel/batch`,
    method: 'post',
    data: params
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
 * 计划拆分-计划下表
 * @param params 参数
 * @returns 回调
 */
const planToSplit = (params) => {
  params = params || {};
  return request({
    url: `${getUrl}/materialcuttingplan/cuttingplan/cutting/planToSplit`,
    method: 'post',
    data: {
      ...params
    }
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
  cuttingList,
  exportReport,
  receive,
  panelList,
  cuttingplanList,
  exportFlie,
  merge,
  panelbatch,
  revoke,
  saveBoardData,
  updataStatus,
  planToSplit,
  listPendingReceiveCyclePlans,
  planIssued,
  printConstructionTicket,
  MaterialCuttingPrint,
  exportFlieLevel
}
