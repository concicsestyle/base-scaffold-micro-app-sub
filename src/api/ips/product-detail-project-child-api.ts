/* * 
* @Description: 
* @Author: 张星  
* @Date: 2025-07-23 19:08:01  
* @Last Modified by:   张星  
* @Last Modified time: 2025-07-23 19:08:01 
*/
import request from '@/utils/request';
import {API_PREFIX} from '../prefix'
// import { AxiosPromise } from 'axios';
const getUrl = `/${API_PREFIX.ips}/admin/productionOrders`;

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