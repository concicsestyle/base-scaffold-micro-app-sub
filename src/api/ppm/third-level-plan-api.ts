/*
 * @Description:
 * @Autor: 王瑶
 * @Date: 2025-06-25 09:58:14
 * @LastEditors: 王瑶
 * @LastEditTime: 2025-08-11 14:57:01
 */
import request from '@/utils/request';
import { API_PREFIX } from '../prefix';
const getUrl = `/${API_PREFIX.ppm}/thirdplan`;
/**
 * 查看所有待接收的周期计划
 * @param params 参数
 * @returns 回调
 */
const listPendingReceiveCyclePlans = (params) => {
  params = params || {};
  return request({
    url: `${getUrl}/manage/listPendingReceiveCyclePlans`,
    method: 'get',
    params: {
      ...params
    }
  });
};
/**
 * 根据周期计划id查询三级计划
 * @param params
 * @returns
 */
const listThirdPlansByCyclePlanId = (params) => {
  return request({
    url: `${getUrl}/manage/listThirdPlansByCyclePlanId`,
    method: 'get',
    params: {
      ...params
    }
  });
};
/**
 * 接收周期计划
 * @param params
 * @returns
 */
const receiveCyclePlans = (params) => {
  return request({
    url: `${getUrl}/manage/receiveCyclePlans`,
    method: 'post',
    data: {
      ...params
    }
  });
};
/**
 * 分页查询已接收的三级计划
 * @param params
 * @returns
 */
const pageReceivedThirdPlans = (params) => {
  return request({
    url: `${getUrl}/manage/pageReceivedThirdPlans`,
    method: 'get',
    params: {
      ...params
    }
  });
};
/**
 * 根据三级计划ID查询工序信息
 * @param params
 * @returns
 */
const listProceduresByThirdPlanId = (params) => {
  return request({
    url: `${getUrl}/manage/listProceduresByThirdPlanId`,
    method: 'get',
    params: {
      ...params
    }
  });
};

/**
 * 暂缓下发工序
 * @param params
 * @returns
 */
const deferProcedureIssue = (params) => {
  return request({
    url: `${getUrl}/manage/deferProcedureIssue`,
    method: 'post',
    data: {
      ...params
    }
  });
};
/**
 * 取消暂缓下发工序
 * @param params
 * @returns
 */
const cancelDeferProcedureIssue = (params) => {
  return request({
    url: `${getUrl}/manage/cancelDeferProcedureIssue`,
    method: 'post',
    data: {
      ...params
    }
  });
};
/**
 * 作废三级计划
 * @param params
 * @returns
 */
const discardThirdPlan = (params) => {
  return request({
    url: `${getUrl}/manage/discardThirdPlan`,
    method: 'post',
    data: {
      ...params
    }
  });
};
/**
 * 撤销三级计划
 * @param params
 * @returns
 */
const revokeThirdPlan = (params) => {
  return request({
    url: `${getUrl}/manage/revokeThirdPlan`,
    method: 'post',
    data: {
      ...params
    }
  });
};
/**
 * 更新工艺
 * @param params
 * @returns
 */
const updateThirdPlanProcess = (params) => {
  return request({
    url: `${getUrl}/manage/updateThirdPlanProcess`,
    method: 'post',
    data: {
      ...params
    }
  });
};
/**
 * 暂停三级计划
 * @param params
 * @returns
 */
const pauseThirdPlan = (params) => {
  return request({
    url: `${getUrl}/manage/pauseThirdPlan`,
    method: 'post',
    data: {
      ...params
    }
  });
};
/**
 * 开启三级计划
 * @param params
 * @returns
 */
const startThirdPlan = (params) => {
  return request({
    url: `${getUrl}/manage/startThirdPlan`,
    method: 'post',
    data: {
      ...params
    }
  });
};
/**
 * 开启三级计划
 * @param params
 * @returns
 */
const updateThirdPlan = (params) => {
  return request({
    url: `${getUrl}/manage/updateThirdPlan`,
    method: 'post',
    data: {
      ...params
    }
  });
};
/**
 * 根据三级计划id查询卡号详情
 * @param params
 * @returns
 */
const detailWithDate = (params) => {
  return request({
    url: `${API_PREFIX.ppm}/card/detailWithDate`,
    method: 'get',
    params: {
      ...params 
    }
  });
};
/**
 * 拆分
 * @param params
 * @returns
 */
const splitThirdPlan = (params) => {
    return request({
      url: `${getUrl}/manage/splitThirdPlan`,
      method: 'post',
      data: {
        ...params
      }
    });
  };
  /**
 * 计划下达
 * @param params
 * @returns
 */
const planIssue = (params) => {
    return request({
      url: `${getUrl}/manage/planIssue`,
      method: 'post',
      data: params
    });
  };
export default {
  listPendingReceiveCyclePlans,
  listThirdPlansByCyclePlanId,
  receiveCyclePlans,
  pageReceivedThirdPlans,
  deferProcedureIssue,
  cancelDeferProcedureIssue,
  discardThirdPlan,
  revokeThirdPlan,
  updateThirdPlanProcess,
  listProceduresByThirdPlanId,
  pauseThirdPlan,
  startThirdPlan,
  updateThirdPlan,
  detailWithDate,
  splitThirdPlan,
  planIssue
};
