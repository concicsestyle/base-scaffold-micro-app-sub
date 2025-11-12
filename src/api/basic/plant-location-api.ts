
/*
 * @Description:厂房信息相关接口
 * @Autor: 王瑶
 * @Date: 2025-06-25 09:58:14
 * @LastEditors: 王瑶
 * @LastEditTime: 2025-07-04 17:00:19
 */
import request from '@/utils/request';
import {API_PREFIX} from '../prefix'
const getUrl = `/${API_PREFIX.basic}/equipment/plantLocation`;
/**
 * 
 * @param params 参数
 * @returns 回调
 */
const allPlantLocation = (params) => {
    params = params || {};
  return request({
    url: `${getUrl}/allPlantLocation`,
    method: 'post',
    data: {
      ...params,
    }
  });
};

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
    url: `${getUrl}/listPage`,
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
 * 保存接口
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
 * 删除接口
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

export default {
    allPlantLocation,
    listPage,
    save,
    update,
    deleteBatch
}