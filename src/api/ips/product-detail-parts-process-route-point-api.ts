/* * 
* @Description: 
* @Author: 张星  
* @Date: 2025-07-23 19:07:18  
 * @Last Modified by: 张星
 * @Last Modified time: 2025-07-23 20:22:08
*/
import request from '@/utils/request';
import {API_PREFIX} from '../prefix'
// import { AxiosPromise } from 'axios';
const getUrl = `/${API_PREFIX.ips}/admin/partProcessRoutePoints`;

/**
 * 分页接口
 * @param params 参数根据零件id查询
 * @returns 回调
 */
 const listPage = (params, timestamp = false) => {
    params = params || {};
    console.log("params",params)
    if (timestamp) {
      params['_t'] = Date.now();
    }
  return request({
    url: `${getUrl}/pageListByPartId`,
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