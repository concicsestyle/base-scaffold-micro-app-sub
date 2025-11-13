import request from '@/utils/request';
import { API_PREFIX } from '../prefix';
const getUrl = `/${API_PREFIX.basic}`;
const getIpsUrl = `/${API_PREFIX.ips}/erzhongprocess/process-information`;
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
    url: `${getIpsUrl}/list-page`,
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
const execConfigAdd = (params) => {
  params = params || {};
  return request({
    url: `${getUrl}/admin/execConfig/add`,
    method: 'post',
    data: {
      ...params
    }
  });
};
/**
 * 生产准备配置保存接口
 * @param params 参数
 * @returns 回调
 */
const execPrepConfigAdd = (params) => {
  params = params || [];
  return request({
    url: `${getUrl}/admin/execPrepConfig/addBatch`,
    method: 'post',
    data: params
  });
};
/**
 * 生产记录配置保存接口
 * @param params 参数
 * @returns 回调
 */
const execRecordConfigAdd = (params) => {
  params = params || [];
  return request({
    url: `${getUrl}/admin/execRecordConfig/addBatch`,
    method: 'post',
    data: params
  });
};
/**
 * 获取生产准备配置枚举
 * @param params 参数
 * @returns 回调
 */
const getExecPrepConfigEnum = (params) => {
  params = params || {};
  return request({
    url: `${getUrl}/admin/execPrepConfig/getExecPrepConfigEnum`,
    method: 'post',
    data: {
      ...params
    }
  });
};
/**
 * 获取生产准备配置信息列表
 * @param params 参数
 * @returns 回调
 */
const getExecPrepConfigList = (params, timestamp = false) => {
    params = params || {};
    if (timestamp) {
      params['_t'] = Date.now();
    }
    return request({
      url: `${getUrl}/admin/execPrepConfig/pageList`,
      method: 'get',
      params: {
        ...params
      }
    });
  };
  
/**
 * 报工模式-配置保存接口
 * @param params 参数
 * @returns 回调
 */
const execReportConfigAdd = (params) => {
  params = params || [];
  return request({
    url: `${getUrl}/admin/execReportConfig/addBatch`,
    method: 'post',
    data: params
  });
};
/**
 * 获取报工模式-配置枚举
 * @param params 参数
 * @returns 回调
 */
const getExecReportConfigEnum = (params) => {
  params = params || {};
  return request({
    url: `${getUrl}/admin/execReportConfig/getExecReportConfigEnum`,
    method: 'post',
    data: {
      ...params
    }
  });
};
/**
 * 获取报工模式-配置信息列表
 * @param params 参数
 * @returns 回调
 */
const getExecReportConfigList = (params, timestamp = false) => {
    params = params || {};
    if (timestamp) {
      params['_t'] = Date.now();
    }
    return request({
      url: `${getUrl}/admin/execReportConfig/pageList`,
      method: 'get',
      params: {
        ...params
      }
    });
  };
/**
 * 齐套检查-配置保存接口
 * @param params 参数
 * @returns 回调
 */
const execQltCheckAdd = (params) => {
  params = params || [];
  return request({
    url: `${getUrl}/admin/execQltCheck/addBatch`,
    method: 'post',
    data: params
  });
};
/**
 * 获取齐套检查-配置枚举
 * @param params 参数
 * @returns 回调
 */
const getExecQltCheckEnum = (params) => {
  params = params || {};
  return request({
    url: `${getUrl}/admin/execQltCheck/getExecQltCheckEnum`,
    method: 'post',
    data: {
      ...params
    }
  });
};
/**
 * 获取齐套检查-配置信息列表
 * @param params 参数
 * @returns 回调
 */
const getExecQltCheckList = (params, timestamp = false) => {
    params = params || {};
    if (timestamp) {
      params['_t'] = Date.now();
    }
    return request({
      url: `${getUrl}/admin/execQltCheck/pageList`,
      method: 'get',
      params: {
        ...params
      }
    });
  };
/**
 * 拆解任务-配置保存接口
 * @param params 参数
 * @returns 回调
 */
const execTaskAdd = (params) => {
  params = params || [];
  return request({
    url: `${getUrl}/admin/execTaskBreakdownDimension/addBatch`,
    method: 'post',
    data: params
  });
};
/**
 * 获取拆解任务-配置枚举
 * @param params 参数
 * @returns 回调
 */
const getExecTaskEnum = (params) => {
  params = params || {};
  return request({
    url: `${getUrl}/admin/execTaskBreakdownDimension/getExecTaskBreakdownDimensionEnum`,
    method: 'post',
    data: {
      ...params
    }
  });
};
/**
 * 获取拆解任务-配置信息列表
 * @param params 参数
 * @returns 回调
 */
const getExecTaskList = (params, timestamp = false) => {
    params = params || {};
    if (timestamp) {
      params['_t'] = Date.now();
    }
    return request({
      url: `${getUrl}/admin/execTaskBreakdownDimension/pageList`,
      method: 'get',
      params: {
        ...params
      }
    });
  };
/**
 * 获取枚举
 * @param params 参数
 * @returns 回调
 */
const getExecConfigEnum = (params) => {
  params = params || {};
  return request({
    url: `${getUrl}/admin/execConfig/getExecConfigEnum`,
    method: 'post',
    data: {
      ...params
    }
  });
};
/**
 * 获取生产记录配置枚举
 * @param params 参数
 * @returns 回调
 */
const getExecRecordConfigEnum = (params) => {
  params = params || {};
  return request({
    url: `${getUrl}/admin/execRecordConfig/getExecRecordConfigEnum`,
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
    url: `${getUrl}/admin/execConfig/edit`,
    method: 'post',
    data: {
      ...params
    }
  });
};

  /**
 * 获取生产记录配置信息列表
 * @param params 参数
 * @returns 回调
 */
const getExecRecordConfigList = (params, timestamp = false) => {
    params = params || {};
    if (timestamp) {
      params['_t'] = Date.now();
    }
    return request({
      url: `${getUrl}/admin/execRecordConfig/pageList`,
      method: 'get',
      params: {
        ...params
      }
    });
  };
/**
 * 获取项目信息-项目编号和项目名称
 * @param params 参数
 * @returns 回调
 */
const getPageList = (params, timestamp = false) => {
    params = params || {};
    if (timestamp) {
      params['_t'] = Date.now();
    }
    return request({
      url: `${getUrl}/admin/execConfig/pageList`,
      method: 'get',
      params: {
        ...params
      }
    });
  };
export default {
  getExecConfigEnum,
  execConfigAdd,
  getPageList,
  update,
  getExecPrepConfigList,
  getExecPrepConfigEnum,
  execPrepConfigAdd,
  execRecordConfigAdd,
  getExecRecordConfigList,
  getExecRecordConfigEnum,
  execReportConfigAdd,
  getExecReportConfigList,
  getExecReportConfigEnum,
  execQltCheckAdd,
  getExecQltCheckList,
  getExecQltCheckEnum,
  execTaskAdd,
  getExecTaskList,
  getExecTaskEnum,
  listPage,
};
