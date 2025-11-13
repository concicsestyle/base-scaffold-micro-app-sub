/*
 * @Description:
 * @Autor: 王瑶
 * @Date: 2025-06-25 09:58:14
 * @LastEditors: 王瑶
 * @LastEditTime: 2025-07-10 15:26:01
 */
import request from '@/utils/request';
import {API_PREFIX} from '../prefix'
// import { AxiosPromise } from 'axios';
const getUrl = `/${API_PREFIX.ips}/processManagement/technologyRegulationProcedureTooling`;

/**
 * 列表查询数据
 * @param params 参数
 * @returns 回调
 */
 const list = (params, timestamp = false) => {
    params = params || {};
    if (timestamp) {
      params['_t'] = Date.now();
    }
  return request({
    url: `${getUrl}/list`,
    method: 'post',
    data: {
      ...params,
    }
  });
};
  /**
 * 更新配套件汇总数据
 * @param params 参数
 * @returns 回调
 */
const updateGatherTooling = (params) => {
    return request({
      url: `${getUrl}/updateGatherTooling`,
      method: 'post',
      data: {
        ...params,
      }
    });
  };
export default {
    list,
    updateGatherTooling
}