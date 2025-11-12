/*
 * @Description:设备建模
 * @Autor: 王瑶
 * @Date: 2025-06-25 09:58:14
 * @LastEditors: 王瑶
 * @LastEditTime: 2025-07-02 17:07:43
 */
import request from '@/utils/request';
import { API_PREFIX } from '../prefix'
const getUrl = `/${API_PREFIX.basic}/equipment/eqpType`;
/**
 * 设备类别机型树查询
 * @param params 参数
 * @returns 回调
 */
const eqpTypeAndModel = (params, timestamp = false) => {
  params = params || {};
  if (timestamp) {
    params['_t'] = Date.now();
  }
  return request({
    url: `${getUrl}/eqpTypeAndModel`,
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
const del = (params, timestamp = false) => {
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

export default {
  eqpTypeAndModel,
  del,
  update,
  save,
}