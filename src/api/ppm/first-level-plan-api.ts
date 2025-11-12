/*
 * @Description:
 * @Autor: 王瑶
 * @Date: 2025-06-25 09:58:14
 * @LastEditors: 王瑶
 * @LastEditTime: 2025-09-02 10:14:58
 */
import request from '@/utils/request';
import { API_PREFIX } from '../prefix';
const getUrl = `/${API_PREFIX.ppm}/oneplan`;
/**
 * 一级计划上表格数据
 * @param params 参数
 * @returns 回调
 */
const onePlanPage = (params) => {
  params = params || {};
  return request({
    url: `${API_PREFIX.ppm}/masterProjectPlanProduction/onePlanPage`,
    method: 'get',
    params: {
      ...params
    }
  });
};
/**
 * 根据生产计划ID查询制造过程节点信息
 * @param params 
 * @returns 
 */
const manufacturingNodes = (params) => {
  return request({
    url: `${getUrl}/manufacturingNodes/${params}`,
    method: 'get',
  });
};
export default {
    onePlanPage,
    manufacturingNodes
};
