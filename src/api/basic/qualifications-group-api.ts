/*
 * @Description:资质组表API对象
 * @Autor: 王瑶
 * @Date: 2025-06-25 09:58:14
 * @LastEditors: 王瑶
 * @LastEditTime: 2025-07-03 15:27:14
 */
import request from '@/utils/request';
import {API_PREFIX} from '../prefix'
const getUrl = `/${API_PREFIX.basic}/qualification/qualificationsGroup`;

/**
 * 资质树查询
 * @param params 参数
 * @returns 回调
 */
 const list = (params, timestamp = false) => {
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
 * 删除接口
 * @param params 参数
 * @returns 回调
 */
const deleteId = (params, timestamp = false) => {
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
 * 修改接口
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
 * 新增接口
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
export default {
    list,
    deleteId,
    update,
    save
}