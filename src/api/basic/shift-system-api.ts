/*
 * @Description:
 * @Autor: 王瑶
 * @Date: 2025-06-25 09:58:14
 * @LastEditors: 王瑶
 * @LastEditTime: 2025-07-18 14:18:37
 */
import request from '@/utils/request';
import { API_PREFIX } from '../prefix';
const getUrl = `/${API_PREFIX.basic}/workCenter/basicShiftSystem`;
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
      ...params
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
      ...params
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
      ...params
    }
  });
};

/**
 * 停用接口
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
      ...params
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
      ...params
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
 * 根据id查询
 * @param params 参数
 * @returns 回调
 */
const get = (params) => {
    params = params || {};
    return request({
      url: `${getUrl}/get`,
      method: 'post',
      data: {
        ...params
      }
    });
  };
    /**
 * 查询列表数据
 * @param params 参数
 * @returns 回调
 */
const getList = () => {
    return request({
      url: `${getUrl}/list`,
      method: 'post',
      data: {}
    });
  };
/**
 * 查询班制list
 * @param params 参数
 * @returns 回调
 */
const list = (params) => {
  params = params || {};
  return request({
    url: `${getUrl}/list`,
    method: 'post',
    data: {
      ...params
    }
  });
};
export default {
  listPage,
  save,
  update,
  changeStatus,
  deleteBatch,
  importExcel,
  exportListPage,
  get,
  list,
  getList
};
