/*
 * @Description:
 * @Autor: 王瑶
 * @Date: 2025-06-25 09:58:14
 * @LastEditors: 王瑶
 * @LastEditTime: 2025-09-07 17:31:08
 */
import request from '@/utils/request';
import { API_PREFIX } from '../prefix';
const getUrl = `/${API_PREFIX.ppm}/twoPlan`;
/**
 * 查询所属工段表中的所有部门
 * @param params 参数
 * @returns 回调
 */
const sections = (params) => {
  params = params || {};
  return request({
    url: `${getUrl}/sections`,
    method: 'get',
    params: {
      ...params
    }
  });
};
/**
 * 分页查询二级计划信息
 * @param params 参数
 * @returns 回调
 */
const getPage = (params) => {
  params = params || {};
  return request({
    url: `${getUrl}/page`,
    method: 'get',
    params: {
      ...params
    }
  });
};
/**
 * 批量修改时间
 * @param params 参数
 * @returns 回调
 */
const updateDate = (params) => {
  params = params || {};
  return request({
    url: `${getUrl}/batch/updateDate`,
    method: 'POST',
    data: {
      ...params
    }
  });
};
/**
 * 拆分
 * @param params 参数
 * @returns 回调
 */
const getSplit = (params) => {
  params = params || {};
  return request({
    url: `${getUrl}/split`,
    method: 'post',
    data: {
      ...params
    }
  });
};
/**
 * 关闭
 * @param params 参数
 * @returns 回调
 */
const getClose = (params) => {
  params = params || {};
  return request({
    url: `${getUrl}/${params}/close`,
    method: 'POST'
  });
};
/**
 * 获取卡号list
 * @param params 参数
 * @returns 回调
 */
const getCardList = (params) => {
  params = params || {};
  return request({
    url: `/${API_PREFIX.ips}/remote/product/detail/card/queryByBusiness`,
    method: 'post',
    data: {
      ...params
    }
  });
};
/**
 * 删除
 * @param params 参数
 * @returns 回调
 */
const getDel = (params) => {
  return request({
    url: `${getUrl}/delete`,
    method: 'POST',
    data: params
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
    data: params
  });
};

/**
 * 拆分
 * @param params 参数
 * @returns 回调
 */
const issue = (params) => {
  params = params || {};
  return request({
    url: `${getUrl}/issue`,
    method: 'post',
    data: {
      ...params
    }
  });
};
/**
 * 根据二级计划id查询二级计划详情
 * @param params 参数
 * @returns 回调
 */
const getDetails = (params) => {
  return request({
    url: `${getUrl}/${params}`,
    method: 'get'
  });
};
/**
 * 根据二级计划id查询其对应的工序信息（查询全部）
 * @param params 参数
 * @returns 回调
 */
const getProceduresAll = (params) => {
  return request({
    url: `${getUrl}/${params}/procedures/all`,
    method: 'get'
  });
};
/**
 * 根据二级计划id查询其对应的工序信息（分页）
 * @param params 参数
 * @returns 回调
 */
const getProcedures = (params) => {
  return request({
    url: `${getUrl}/${params.secondPlanId}/procedures`,
    method: 'get',
    params: {
      ...params
    }
  });
};
/**
 * 计划编制
 * @param params 参数
 * @returns 回调
 */
const edit = (params) => {
  params = params || {};
  return request({
    url: `${getUrl}/edit`,
    method: 'post',
    data: {
      ...params
    }
  });
};
/**
 * 变更
 * @param params 参数
 * @returns 回调
 */
const change = (params) => {
  params = params || {};
  return request({
    url: `${getUrl}/change`,
    method: 'post',
    data: {
      ...params
    }
  });
};
/**
 * 联动排程
 * @param params 参数
 * @returns 回调
 */
const linkedScheduling = (params) => {
  params = params || {};
  return request({
    url: `${getUrl}/linkedScheduling`,
    method: 'post',
    data: {
      ...params
    }
  });
};
/**
 * 新增工艺获取接口
 * @param params 参数
 * @returns 回调
 */
const refreshProcess = (params) => {
  return request({
    url: `${getUrl}/refreshProcess/${params.productionPlanId}`,
    method: 'post',
    data: {
        ...params
      }
  });
};
/**
 * 根据二级计划id查询变更历史
 * @param params 参数
 * @returns 回调
 */
const getHistory = (params) => {
    return request({
      url: `${getUrl}/${params.secondPlanId}/history`,
      method: 'GET',
      params: {
          ...params
        }
    });
  };
  /**
 * 根据二级计划id查询工序变更历史
 * @param params 参数
 * @returns 回调
 */
const getHistoryProcedures = (params) => {
    return request({
      url: `${getUrl}/history/${params.secondPlanId}/procedures`,
      method: 'GET',
      params: {
          ...params
        }
    });
  };
/**
 * 修改打印次数
 * @param params 参数
 * @returns 回调
 */
const cheackPrint = (params) => {
  return request({
    url: `${getUrl}/cheackPrint`,
    method: 'post',
    data:
      params
  });
};
/**
 * 根据零件id和工段id查询所有工序信息 
 * @param params 参数
 * @returns 回调
 */
const saveProcedure = (params) => {
    return request({
      url: `${getUrl}/save/procedure`,
      method: 'post',
      data:
        params
    });
  };
//   新增计划保存
const save = (params) => {
    return request({
      url: `${getUrl}/save`,
      method: 'post',
      data:
        params
    });
  };
  //工艺更新
  
  const refreshProcessById = (params) => {
    return request({
      url: `${getUrl}/refreshProcessById/${params}`,
      method: 'get',
    });
  };
export default {
  cheackPrint,
  sections,
  getPage,
  updateDate,
  getSplit,
  getClose,
  getCardList,
  getDel,
  exportListPage,
  issue,
  getDetails,
  getProceduresAll,
  getProcedures,
  edit,
  change,
  linkedScheduling,
  refreshProcess,
  getHistory,
  getHistoryProcedures,
  saveProcedure,
  save,
  refreshProcessById
};
