/*
 * @Description:工艺建模
 * @Autor: 张星
 * @Date: 2025-07-07 17:53:14
 * @LastEditors: 王瑶
 * @LastEditTime: 2025-09-02 10:06:25
 */
import request from '@/utils/request';
import {API_PREFIX} from '../../prefix'
const getUrl = `/${API_PREFIX.ips}/erzhongprocess/route-point`;
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
 * 获取树形结构
 * @param params
 * @param timestamp
 */
const listChildren = (params, timestamp = false) => {
    params = params || {};
    if (timestamp) {
        params['_t'] = Date.now();
    }
    return request({
        url: `${getUrl}/list`,
        method: 'post',
        data: {
            ...params,
        }
    });
};
/**
 * 获取所有路线点
 */
const getAll = () => {
    return request({
        url: `${getUrl}/getAll`,
        method: 'get',
    });
};
/**
 * 获取当前登陆人所有路线点
 */
const getRouteByUser = (companyId) => {
  const finalCompanyId = (companyId === null || companyId === undefined) ? '' : String(companyId);
  return request({
    url: `${getUrl}/getRouteByUser`,
    method: 'get',
    params: { companyId: finalCompanyId }
  });
};
/**
 * 修改线路点状态
 * @param params
 * @param timestamp
 */
const batchSetEnable = (params) => {
    params = params || {};
    return request({
        url: `${getUrl}/batch-set-enable`,
        method: 'post',
        data: {
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
    listChildren,
    getAll,
    batchSetEnable,
  getRouteByUser
}
