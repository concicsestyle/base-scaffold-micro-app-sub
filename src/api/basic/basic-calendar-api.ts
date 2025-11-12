/*
 * @Description:
 * @Autor: 王瑶
 * @Date: 2025-06-25 09:58:14
 * @LastEditors: 王瑶
 * @LastEditTime: 2025-07-07 13:51:04
 */
import request from '@/utils/request';
import {API_PREFIX} from '../prefix'
// import { AxiosPromise } from 'axios';
const getUrl = `/${API_PREFIX.basic}/workCenter/basicCalendar`;
/**
 * 根据条件查询日历休息日
 * @param params 参数
 * @returns 回调
 */
 const getWeekCalendar = (params) => {
  return request({
    url: `${getUrl}/getWeekCalendar`,
    method: 'post',
    data: {
      ...params,
      _t: new Date().getTime()
    }
  });
};

/**
 * 设置默认日历
 * @param params 参数
 * @returns 回调
 */
 const getDefaultCalendar = (params, timestamp = false) => {
  params = params || {};
  if (timestamp) {
    params['_t'] = Date.now();
  }
  return request({
    url: `${getUrl}/setDefaultCalendar`,
    method: 'post',
    data: {
      ...params
    }
  });
};
/**
 * 查询日历明细
 * @param params 参数
 * @returns 回调
 */
 const getCalendar = (params, timestamp = false) => {
  params = params || {};
  if (timestamp) {
    params['_t'] = Date.now();
  }
  return request({
    url: `${getUrl}/getCalendar`,
    method: 'post',
    data: {
      ...params
    }
  });
};
/**
 * 删除数据
 * @param params 参数
 * @returns 回调
 */
 const getDelete = (params, timestamp = false) => {
  params = params || {};
  if (timestamp) {
    params['_t'] = Date.now();
  }
  return request({
    url: `${getUrl}/delete`,
    method: 'post',
    data: {
      ...params
    }
  });
};
/**
 * 根据ID查询数据
 * @param params 参数
 * @returns 回调
 */
 const getId = (params, timestamp = false) => {
  params = params || {};
  if (timestamp) {
    params['_t'] = Date.now();
  }
  return request({
    url: `${getUrl}/get`,
    method: 'post',
    data: {
      ...params
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
      ...params
    }
  });
};
/**
 * 列表查询数据
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
      ...params
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
      ...params
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
      ...params
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
      ...params
    }
  });
};
export default {
    deleteBatch,
    save,
    update,
    list,
    listPage,
    getId,
    getDelete,
    getCalendar,
    getDefaultCalendar,
    getWeekCalendar
}
