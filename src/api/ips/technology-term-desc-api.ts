/*
 * @Description:
 * @Autor: 王瑶
 * @Date: 2025-06-25 09:58:14
 * @LastEditors: 王瑶
 * @LastEditTime: 2025-09-02 10:09:55
 */
import request from '@/utils/request';
import {API_PREFIX} from '../prefix'
// import { AxiosPromise } from 'axios';
const getUrl = `/${API_PREFIX.ips}/technology/technologyTermDesc`;

/**
 * 分页接口1
 * @param params 参数   
 * @returns 回调
 */
 const listPage = (params, timestamp = false) => {
    params = params || {};
    if (timestamp) {
      params['_t'] = Date.now();
    }
  return request({
    url: `${getUrl}/listPage`,
    method: 'post',
    data: {
      ...params,
    }
  });
};
/**
 * 根据工艺规程id查询工序及工步
 * @param params 参数
 * @returns 回调
 */
const getProcedureListByRegulationId = (params) => {
  return request({
    url: `${getUrl}/getProcedureListByRegulationId`,
    method: 'post',
    data: {
      ...params,
    }
  });
};
/**
 * 根据工艺规程id查询工序及工步
 * @param params 参数
 * @returns 回调
 */
const get = (params) => {
    return request({
      url: `${getUrl}/get`,
      method: 'post',
      data: {
        ...params,
      }
    });
  };
  /**
 * 配炉任务关联工艺规程分页查询
 * @param params 参数
 * @returns 回调
 */
const furnishTaskTechnologyRegulationListPage = (params) => {
    return request({
      url: `${getUrl}/furnishTaskTechnologyRegulationListPage`,
      method: 'post',
      data: {
        ...params,
      }
    });
  };
export default {
    listPage,
    getProcedureListByRegulationId,
    get,
    furnishTaskTechnologyRegulationListPage
}