/*
 * @Description:
 * @Autor: 王瑶
 * @Date: 2025-06-25 09:58:14
 * @LastEditors: 王瑶
 * @LastEditTime: 2025-09-02 10:16:43
 */
import request from '@/utils/request';
import { API_PREFIX } from '../prefix';
const getUrl = `/${API_PREFIX.ppm}/projectInfo`;
const getPpmUrl = `/${API_PREFIX.ppm}`;
const getipsUrl = `/${API_PREFIX.ips}`;
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
    method: 'get',
    params: {
      ...params
    }
  });
};
/**
 * 新增接口
 * @param params 参数
 * @returns 回调
 */
const create = (params, timestamp = false) => {
  params = params || {};
  if (timestamp) {
    params['_t'] = Date.now();
  }
  return request({
    url: `${getUrl}/create`,
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
    url: `${getUrl}/delete`,
    method: 'post',
    data: {
      ...params
    }
  });
};
/**
 * 下发项目信息
 * @param params 参数
 * @returns 回调
 */
const distribute = (params, timestamp = false) => {
    params = params || {};
    if (timestamp) {
      params['_t'] = Date.now();
    }
    return request({
      url: `${getUrl}/distribute`,
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
const exportListPage = (params) => {
    return request({
      url: `${getUrl}/export`,
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
 * 查询合同列表数据
 * @param params 参数
 * @returns 回调
 */
const getPpmContractList = () => {
    return request({
      url: `${getPpmUrl}/ppmContract/list`,
      method: 'get',
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
/**
 * 获取项目信息-项目编号和项目名称
 * @param params 参数
 * @returns 回调
 */
const getPROJECTSlist = (params, timestamp = false) => {
    params = params || {};
    if (timestamp) {
      params['_t'] = Date.now();
    }
    return request({
      url: `${getipsUrl}/admin/PROJECTS/list`,
      method: 'get',
      params: {
        ...params
      }
    });
  };
/**
 * 获取生产令号
 * @param params 参数
 * @returns 回调
 */
const getproductionOrderslist = (params, timestamp = false) => {
    params = params || {};
    if (timestamp) {
      params['_t'] = Date.now();
    }
    return request({
      url: `${getipsUrl}/admin/productionOrders/list`,
      method: 'get',
      params: {
        ...params
      }
    });
  };
  /**
 * 撤销已下发数据
 * @param params 参数
 * @returns 回调
 */
const withdrawIssuance = (params) => {
    return request({
      url: `${getUrl}/withdrawIssuance`,
      method: 'post',
      data: {
        ...params
      }
    });
  };
export default {
  listPage,
  create,
  update,
  distribute,
  changeStatus,
  deleteBatch,
  importExcel,
  exportListPage,
  get,
  list,
  getList,
  getPROJECTSlist,
  getproductionOrderslist,
  withdrawIssuance,
  getPpmContractList
};
