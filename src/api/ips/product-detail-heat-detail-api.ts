/*
 * @Description: 
 * @Autor: 王瑶
 * @Date: 2025-07-25 18:15:42
 * @LastEditors: 王瑶
 * @LastEditTime: 2025-09-09 17:38:13
 */
/* * 
* @Description: 
* @Author: 张星  
* @Date: 2025-07-23 19:07:41  
* @Last Modified by:   张星  
* @Last Modified time: 2025-07-23 19:07:41 
*/
import request from '@/utils/request';
import {API_PREFIX} from '../prefix'
// import { AxiosPromise } from 'axios';
const getUrl = `/${API_PREFIX.ips}/admin/heatDetails`;

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
export default {
    listPage

}