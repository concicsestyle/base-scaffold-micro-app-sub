/*
 * @Description:
 * @Autor: 王瑶
 * @Date: 2025-06-25 09:58:14
 * @LastEditors: 王瑶
 * @LastEditTime: 2025-07-29 11:57:43
 */
import request from '@/utils/request';
import { API_PREFIX } from '../prefix';
const getUrl = `/${API_PREFIX.ppm}/oneplan`;

/**
 * 粗能力评估
 * @param params 参数
 * @returns 回调
 */
const capacityAssessment = (params) => {
  params = params || {};
  return request({
    url: `${getUrl}/capacityAssessment`,
    method: 'post',
    data: {
      ...params
    }
  });
};
/**
 * 导出——报表 
 * @param params 参数
 * @returns 回调
 */
const exportReport = (params) => {
  return request({
    url: `${getUrl}/exportReport`,
    method: 'post',
    responseType: 'blob',
    data: {
      ...params
    }
  });
};

export default {
    capacityAssessment,
};
