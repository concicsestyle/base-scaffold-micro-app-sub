/*
 * @Description:
 * @Autor: 王瑶
 * @Date: 2025-06-25 09:58:14
 * @LastEditors: 王瑶
 * @LastEditTime: 2025-09-02 10:09:48
 */
import request from '@/utils/request';
import {API_PREFIX} from '../prefix'
// import { AxiosPromise } from 'axios';
const getUrl = `/${API_PREFIX.ips}/processManagement/technologyRegulationProcedureWorkStep`;

/**
 * 根据ID查询数据
 * @param params 参数
 * @returns 回调
 */
 const get = (params, timestamp = false) => {
    params = params || {};
    if (timestamp) {
      params['_t'] = Date.now();
    }
  return request({
    url: `${getUrl}/get`,
    method: 'post',
    data: {
      ...params,
    }
  });
};
  /**
 * 更新数据
 * @param params 参数
 * @returns 回调
 */
const update = (params) => {
    return request({
      url: `${getUrl}/update`,
      method: 'post',
      data: {
        ...params,
      }
    });
  };
export default {
    get,
    update
}