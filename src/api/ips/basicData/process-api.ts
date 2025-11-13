/* * 
* @Description: 工序信息
* @Author: 张星  
* @Date: 2025-07-07 19:03:56  
 * @Last Modified by: 张星
 * @Last Modified time: 2025-07-07 19:05:44
*/
import request from '@/utils/request';
import {API_PREFIX} from '../../prefix'
const getUrl = `/${API_PREFIX.ips}/erzhongprocess/process-information`;
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
    url: `${getUrl}/list-page`,
    method: 'post',
    data: {
      ...params,
    }
  });
};

const save=(params, timestamp = false) => {
    params = params || {};
    if (timestamp) {
      params['_t'] = Date.now();
    }
  return request({
    url: `${getUrl}/create`,
    method: 'post',
    data: {
      ...params,
    }
  });
};
/**
 * 修改
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
 * 批量删除
 * @param params 参数
 * @returns 回调
 */
const deleteBatch = (params, timestamp = false) => {
    params = params || {};
    if (timestamp) {
      params['_t'] = Date.now();
    }
  return request({
    url: `${getUrl}/delete`,
    method: 'post',
    data: {
      ...params,
    }
  });
};
    /**
 * 根据路线点查询工序
 * @param params 参数
 * @returns 回调
 */
    const queryByRoutePointId = (params) => {
      return request({
        url: `${getUrl}/queryByRoutePointId`,
        method: 'get',
        params: {
          ...params,
        }
      });
    };

export default {
    listPage,
    save,
    update,
    deleteBatch,
    importExcel,
    queryByRoutePointId
}