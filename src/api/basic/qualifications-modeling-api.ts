/*
 * @Description: 
 * @Autor: 王瑶
 * @Date: 2025-06-25 09:58:14
 * @LastEditors: 王瑶
 * @LastEditTime: 2025-06-27 09:06:24
 */
import request from '@/utils/request';
// import { AxiosPromise } from 'axios';
import {API_PREFIX} from '../prefix'
const getUrl = `/${API_PREFIX.basic}/qualification/qualificationsDesc`;
// 导入表
export const list = (params) => {
  return request({
    url: `${getUrl}/list`,
    method: 'post',
    data: {
        ...params,
        _t: new Date().getTime(),
    }
  });
};
export const update = (params) => {
    return request({
      url: `${getUrl}/update`,
      method: 'post',
      data: {
          ...params,
      }
    });
  };
  export const save = (params) => {
    return request({
      url: `${getUrl}/save`,
      method: 'post',
      data: {
          ...params,
      }
    });
  };
  export const deleteId = (params) => {
    return request({
      url: `${getUrl}/delete`,
      method: 'post',
      data: {
          ...params,
      }
    });
  };
  /**
 * 工种信息导入
 * @param params 参数
 * @returns 回调
 */
export const importExcel = (params) => {
    return request({
      url: `${getUrl}/importExcel`,
      method: 'post',
      data: {
        ...params
      }
    });
  };
    /**
 * 启停用
 * @param params 参数
 * @returns 回调
 */
export const changeStatus = (params) => {
    return request({
      url: `${getUrl}/changeStatus`,
      method: 'post',
      data: {
        ...params
      }
    });
  };
      /**
 * 启停用
 * @param params 参数
 * @returns 回调
 */
export const exportListPage = (params) => {
    return request({
      url: `${getUrl}/listPage/export`,
      method: 'download',
      data: {
        ...params
      }
    });
  };
  export const listPage = (params) => {
    return request({
      url: `${getUrl}/listPage`,
      method: 'post',
      data: {
        ...params
      }
    });
  };
  