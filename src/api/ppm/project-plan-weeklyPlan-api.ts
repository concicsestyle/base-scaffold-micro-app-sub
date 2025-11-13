/*
 * @Description:
 * @Autor: 王瑶
 * @Date: 2025-06-25 09:58:14
 * @LastEditors: 王瑶
 * @LastEditTime: 2025-09-07 17:02:33
 */
import request from '@/utils/request';
import { API_PREFIX } from '../prefix';
const getUrl = `/${API_PREFIX.ppm}`;

/**
 * 分页接口——周期计划
 * @param params 参数
 * @returns 回调
 */
const reportPageList = (params) => {
  params = params || {};
  return request({
    url: `${getUrl}/cycleplan/cyclePlan/pageList`,
    method: 'get',
    params: {
      ...params
    }
  });
};
/**
 * 导出——报表
 * @param params 参数
 * @returns 回调
 */
// const exportReport = (params) => {
//   return request({
//     url: `${getUrl}/exportReport`,
//     method: 'post',
//     responseType: 'blob',
//     data: {
//       ...params
//     }
//   });
// };
/**
 * 周期计划 二级计划信息列表
 * @param params 参数
 * @returns 回调
 */
const secondPlanListList = (cyclePlanId: string) => {
  return request({
    url: `${getUrl}/cycleplan/cyclePlan/secondPlanList/${cyclePlanId}`,
    method: 'get',
    params: {
    }
  });
};/**
 * 新增接口
 * @param params 参数
 * @returns 回调
 */
const issue = (cyclePlanId) => {
  return request({
    url: `${getUrl}/cycleplan/cyclePlan/issue/${cyclePlanId}`,
    method: 'post',
    data: {
    }
  });
};

const newListPage = (params) => {
    params = params || {};
    return request({
      url: `${getUrl}/planCycle/listPage`,
      method: 'get',
      params: {
        ...params
      }
    });
  };
  const newPartListPage = (params) => {
    params = params || {};
    return request({
      url: `${getUrl}/planCycle/partListPage`,
      method: 'get',
      params: {
        ...params
      }
    });
  };
  const productionListPage = (params) => {
    params = params || {};
    return request({
      url: `${getUrl}/planCycle/productionListPage`,
      method: 'get',
      params: {
        ...params
      }
    });
  };
  
export default {
  reportPageList,
  secondPlanListList,
  issue,
  newListPage,
  newPartListPage,
  productionListPage
};
