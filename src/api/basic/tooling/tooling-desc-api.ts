/*
 * @Description:
 * @Autor: 王瑶
 * @Date: 2025-06-25 09:58:14
 * @LastEditors: 王瑶
 * @LastEditTime: 2025-07-10 14:17:16
 */
import request from '@/utils/request';
import {API_PREFIX} from '../../prefix'
// import { AxiosPromise } from 'axios';
const getUrl = `/${API_PREFIX.basic}/tooling/toolingDesc`;

/**
 * 更新数据
 * @param params 参数   
 * @returns 回调
 */
 const listPage = (params) => {
  return request({
    url: `${getUrl}/listPage`,
    method: 'post',
    data: {
      ...params,
    }
  });
};

/**
 * 根据ID查询数据
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
 * 列表查询数据
 * @param params 参数
 * @returns 回调
 */
const list = (params) => {
    return request({
      url: `${getUrl}/list`,
      method: 'post',
      data: {
        ...params,
      }
    });
  };
export default {
    listPage,
    get,
    list
}