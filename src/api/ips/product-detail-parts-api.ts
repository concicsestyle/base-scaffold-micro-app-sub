/*
 * @Description: 
 * @Autor: 王瑶
 * @Date: 2025-07-25 18:15:42
 * @LastEditors: 王瑶
 * @LastEditTime: 2025-09-02 10:07:16
 */
/* * 
* @Description: 
* @Author: 张星  
* @Date: 2025-07-23 19:07:35  
* @Last Modified by:   张星  
* @Last Modified time: 2025-07-23 19:07:35 
*/
import request from '@/utils/request';
import {API_PREFIX} from '../prefix'
// import { AxiosPromise } from 'axios';
const getUrl = `/${API_PREFIX.ips}/admin/PARTS`;

/**
 * 分页接口
 * @param params 参数
 * @returns 回调
 */
 const listPage = (params, timestamp = false) => {
    params = params || {};
    if (timestamp) {
      params['_t'] = Date.now();
    }
  return request({
    url: `${getUrl}/pageList`,
    method: 'post',
    data: {
      ...params,
    }
  });
};

// /**
//  * 根据id查询详情
//  * @param params 参数
//  * @returns 回调
//  */
// const getById = (params) => {
//     return request({
//       url: `${getUrl}/get`,
//       method: 'post',
//       data: {
//         ...params,
//       }
//     });
//   };
/**
 * 导入文件
 * @param params 参数
 * @returns 回调
 */
const importDate = (params) => {
    return request({
      url: `${getUrl}/import`,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      method: 'post',
      data: params
    });
  };
export default {
    listPage,
    importDate

}