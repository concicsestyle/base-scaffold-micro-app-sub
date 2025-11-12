/* * 
* @Description: 设备台账
* @Author: 张星  
* @Date: 2025-07-11 08:55:03  
 * @Last Modified by: 张星
 * @Last Modified time: 2025-07-11 17:25:44
*/
import request from '@/utils/request';
import {API_PREFIX} from '../prefix'
const getUrl = `/${API_PREFIX.basic}/equipment/eqpAccount`;

/**
 * 导出
 * @param params 参数
 * @returns 回调
 */
 const exportListPage = (params, timestamp = false,config = { responseType: 'blob' }) => {
    return request({
      url: `${getUrl}/listPage/export`,
      method: 'post',
      responseType: 'blob',
      data: {
        ...params,
      }
    });
};
// 导入文件
const importExcel = (params) => {
    return request({
      url: `${getUrl}/importExcel`,
      headers: {
          'Content-Type': 'multipart/form-data'
      },
      method: 'post',
      data: params,
    });
  };

/**
 * 更新数据
 * @param params 参数
 * @returns 回调
 */
 const update = (params, timestamp = false) => {
    params = params || {};
    if (timestamp) {
      params['_t'] = Date.now();
    }
  return request({
    url: `${getUrl}/update`,
    method: 'post',
    data: {
      ...params,
    }
  });
};

/**
 * 批量删除数据
 * @param params 参数
 * @returns 回调
 */
 const deleteBatch = (params, timestamp = false) => {
    params = params || {};
    if (timestamp) {
      params['_t'] = Date.now();
    }
  return request({
    url: `${getUrl}/deleteBatch`,
    method: 'post',
    data: {
      ...params,
    }
  });
};
/**
 * 新建数据
 * @param params 参数
 * @returns 回调
 */
 const save = (params, timestamp = false) => {
    params = params || {};
    if (timestamp) {
      params['_t'] = Date.now();
    }
  return request({
    url: `${getUrl}/save`,
    method: 'post',
    data: {
      ...params,
    }
  });
};
/**
 * 列表分页查询数据
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
export default {
    listPage,
    save,
    deleteBatch,
    update,
    exportListPage,
    importExcel
}