/*
 * @Description:班次类型API对象
 * @Autor: 王瑶
 * @Date: 2025-06-25 09:58:14
 * @LastEditors: 王瑶
 * @LastEditTime: 2025-07-04 15:45:01
 */
import request from '@/utils/request';
import {API_PREFIX} from '../prefix'
// import { AxiosPromise } from 'axios';
const getUrl = `/${API_PREFIX.basic}/workCenter/basicRotationDesc`;

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
/**
 * 新增
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

/**
 * 修改状态
 * @param params 参数
 * @returns 回调
 */
const changeStatus = (params, timestamp = false) => {
    params = params || {};
    if (timestamp) {
      params['_t'] = Date.now();
    }
  return request({
    url: `${getUrl}/changeStatus`,
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
 * 导出
 * @param params 参数
 * @returns 回调
 */
const exportListPage = (params, timestamp = false, config = { responseType: 'blob' }) => {
    return request({
      url: `${getUrl}/listPage/export`,
      method: 'post',
      responseType: 'blob',
      data: {
        ...params,
      }
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
    url: `${getUrl}/deleteBatch`,
    method: 'post',
    data: {
      ...params,
    }
  });
};
  /**
 * 列表查询
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

export default {
    listPage,
    update,
    save,
    changeStatus,
    importExcel,
    exportListPage,
    deleteBatch,
    list
}