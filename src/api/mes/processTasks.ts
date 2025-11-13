import request from '@/utils/request';
import { API_PREFIX } from '../prefix';
const getUrl = `/${API_PREFIX.mes}`;
const getBasicUrl = `/${API_PREFIX.basic}`;
const getPpmUrl = `/${API_PREFIX.ppm}`;
const getIpsUrl = `/${API_PREFIX.ips}`;
/**
 * 列表分页查询数据-通用
 * @param params 参数
 * @returns 回调
 */
 const listPage = (params, timestamp = false) => {
    params = params || {};
    if (timestamp) {
      params['_t'] = Date.now();
    }
  return request({
    url: `${getUrl}/admin/taskGeneral/pageList`,
    method: 'get',
    params: {
      ...params,
    }
  });
};
/**
 * 获取服务器地址
 * @param params 参数
 * @returns 回调
 */
 const getBaseUrl = (params, timestamp = false) => {
    params = params || {};
    if (timestamp) {
      params['_t'] = Date.now();
    }
  return request({
    url: `${getBasicUrl}/capp/cappInterface/getBaseUrl`,
    method: 'get',
    params: {
      ...params,
    }
  });
};
/**
 * 获取服务器-登录token
 * @param params 参数
 * @returns 回调
 */
 const getTokenLogin = (params, timestamp = false) => {
    params = params || {};
    if (timestamp) {
      params['_t'] = Date.now();
    }
  return request({
    url: `${getBasicUrl}/capp/cappInterface/login`,
    method: 'post',
    data: {
      ...params,
    }
  });
};

/**
 * 列表分页查询数据-下料
 * @param params 参数
 * @returns 回调
 */
 const taskListPage = (params, timestamp = false) => {
    params = params || {};
    if (timestamp) {
      params['_t'] = Date.now();
    }
  return request({
    url: `${getUrl}/admin/taskMaterialPanel/pageList`,
    method: 'get',
    params: {
      ...params,
    }
  });
};
/**
 * 列表分页查询数据-下料-二级表
 * @param params 参数
 * @returns 回调
 */
 const taskMaterialPanelCuttingProcess = (params, timestamp = false) => {
    params = params || {};
    if (timestamp) {
      params['_t'] = Date.now();
    }
  return request({
    url: `${getUrl}/admin/taskMaterialPanelCuttingProcess/list`,
    method: 'get',
    params: {
      ...params,
    }
  });
};

/**
 * 列表分页查询数据-热处理
 * @param params 参数
 * @returns 回调
 */
 const taskCombinedFurnacePageList = (params, timestamp = false) => {
    params = params || {};
    if (timestamp) {
      params['_t'] = Date.now();
    }
  return request({
    url: `${getUrl}/admin/taskCombinedFurnace/pageList`,
    method: 'get',
    params: {
      ...params,
    }
  });
};

/**
 * 批量修改-通用
 * @param params 参数
 * @returns 回调
 */
const editBatch = (params) => {
  return request({
    url: `${getUrl}/admin/taskGeneral/editBatch`,
    method: 'post',
    data: params
  });
}
/**
 * 批量修改-下料--派工
 * @param params 参数
 * @returns 回调
 */
const taskMaterialPanelDispatch = (params) => {
  return request({
    url: `${getUrl}/admin/taskMaterialPanel/dispatch`,
    method: 'post',
    data: {
      ...params
    }
  });
}
/**
 * 批量修改-下料--完工
 * @param params 参数
 * @returns 回调
 */
const taskMaterialPanelCompleted = (params) => {
  return request({
    url: `${getUrl}/admin/taskMaterialPanel/completed`,
    method: 'post',
    data: {
      ...params
    }
  });
}
/**
 * 批量修改-下料--撤销
 * @param params 参数
 * @returns 回调
 */
const taskMaterialPanelQuash = (params) => {
  return request({
    url: `${getUrl}/admin/taskMaterialPanel/quash`,
    method: 'post',
    data: {
      ...params
    }
  });
}

/**
 * 批量修改-热处理
 * @param params 参数
 * @returns 回调
 */
const FurnaceBatch = (params) => {
  return request({
    url: `${getUrl}/admin/taskCombinedFurnace/editBatch`,
    method: 'post',
    data: params
  });
}
/**
 * 批量修改-热处理-子表-确定
 * @param params 参数
 * @returns 回调
 */
const taskCombinedFurnaceProcesseditBatch = (params) => {
  return request({
    url: `${getUrl}/admin/taskCombinedFurnaceProcess/editBatch`,
    method: 'post',
    data: params
  });
}
/**
 *  通用-派工-维护-多条
 * @param params 参数
 * @returns 回调
 */
 const taskGeneralDispatchWorkAddBatch = (params) => {
    params = params || {};
  return request({
    url: `${getUrl}/admin/taskGeneralDispatchWork/addBatch`,
    method: 'post',
    data: params
  });
};
/**
 *  通用-改派-维护-多条
 * @param params 参数
 * @returns 回调
 */
 const taskGeneralDispatchWorkEditBatch = (params) => {
    params = params || {};
  return request({
    url: `${getUrl}/admin/taskGeneralDispatchWork/editBatch`,
    method: 'post',
    data: params
  });
};
/**
 *  通用-详情-完工
 * @param params 参数
 * @returns 回调
 */
 const taskGeneralWorkStepEditBatch = (params) => {
    params = params || {};
  return request({
    url: `${getUrl}/admin/taskGeneralWorkStep/editBatch`,
    method: 'post',
    data: params
  });
};
/**
 *  热处理-派工-维护-多条
 * @param params 参数
 * @returns 回调
 */
 const taskCombinedFurnaceAddBatch = (params) => {
    params = params || {};
  return request({
    url: `${getUrl}/admin/taskCombinedFurnaceDispatchWork/addBatch`,
    method: 'post',
    data: params
  });
};
/**
 *  热处理-改派-维护-多条
 * @param params 参数
 * @returns 回调
 */
 const taskCombinedFurnaceEditBatch = (params) => {
    params = params || {};
  return request({
    url: `${getUrl}/admin/taskCombinedFurnaceDispatchWork/editBatch`,
    method: 'post',
    data: params
  });
};
/**
 *  通用派工-维护
 * @param params 参数
 * @returns 回调
 */
 const taskGeneralDispatchWorkAdd = (params) => {
    params = params || {};
  return request({
    url: `${getUrl}/admin/taskGeneralDispatchWork/add`,
    method: 'post',
    data: {
      ...params,
    }
  });
};

/**
 *  通用派工单元获取
 * @param params 参数
 * @returns 回调
 */
 const getWorkCenterBySection = (params) => {
    params = params || {};
  return request({
    url: `${getBasicUrl}/workCenterEz/basicWorkCenter/getWorkCenterBySection`,
    method: 'post',
    data: {
      ...params,
    }
  });
};
/**
 *  通用-拆分保存
 * @param params 参数
 * @returns 回调
 */
 const taskGeneralSplit = (params) => {
    params = params || {};
  return request({
    url: `${getUrl}/admin/taskGeneral/split`,
    method: 'post',
    data: {
      ...params,
    }
  });
};
/**
 * 下料--拆分
 * @param params 参数
 * @returns 回调
 */
const taskMaterialPanelSplit = (params) => {
  return request({
    url: `${getUrl}/admin/taskMaterialPanel/Split`,
    method: 'post',
    data: {
      ...params
    }
  });
}
/**
 * 下料--拆分
 * @param params 参数
 * @returns 回调
 */
const processDispatch = (params) => {
  return request({
    url: `${getUrl}/admin/taskMaterialPanel/processDispatch`,
    method: 'post',
    data: params
  });
}
/**
 * 根据三级计划id查询卡号详情
 * @param params
 * @returns
 */
const detailWithDate = (params) => {
  return request({
    url: `${getIpsUrl}/remote/product/detail/card/queryByBusiness`,
    method: 'post',
    data: {
      ...params
    }
  });
};
/**
 * 下料--打印
 * @param params 参数
 * @returns 回调
 */
const printConstructionTicket = (params) => {
    return request({
      url: `${getUrl}/admin/taskMaterialPanel/printConstructionTicket/${params}`,
      method: 'get',
    });
  }
  /**
 * 通用--打印
 * @param params 参数
 * @returns 回调
 */
const taskGeneralPrint = (params) => {
    return request({
      url: `${getUrl}/admin/taskGeneral/printConstructionTicket/${params}`,
      method: 'get',
    });
  }

// =================================
/**
 * 根据三级计划id查询卡号详情
 * @param params
 * @returns
 */
const detailWithDates = (params) => {
    return request({
        url: `${getIpsUrl}/remote/product/detail/card/queryByBusiness`,
        method: 'post',
        data: {
            ...params
        }
    });
};

/**
 * 批量修改-热处理
 * @param params 参数
 * @returns 回调
 */
const FurnaceBatchs = (params) => {
    return request({
        url: `${getUrl}/admin/taskReportRecords/updateHeatTreatment`,
        method: 'post',
        data: params
    });
}

/**
 * 批量修改-下料
 * @param params 参数
 * @returns 回调
 */
const taskMaterialPanelDispatchs = (params) => {
    return request({
        url: `${getUrl}/admin/taskReportRecords/updateBlanking`,
        method: 'post',
        data:
        params

    });
}

/**
 * 批量修改-通用
 * @param params 参数
 * @returns 回调
 */
const editBatchs = (params) => {
    return request({
        url: `${getUrl}/admin/taskReportRecords/updateGeneral`,
        method: 'post',
        data: params
    });
}

/**
 * 列表分页查询数据-热处理
 * @param params 参数
 * @returns 回调
 */
const taskCombinedFurnacePageLists = (params, timestamp = false) => {
    params = params || {};
    if (timestamp) {
        params['_t'] = Date.now();
    }
    return request({
        url: `${getUrl}/admin/taskReportRecords/heatTreatmentPageList`,
        method: 'get',
        params: {
            ...params,
        }
    });
};

/**
 * 列表分页查询数据-下料
 * @param params 参数
 * @returns 回调
 */
const taskListPages = (params, timestamp = false) => {
    params = params || {};
    if (timestamp) {
        params['_t'] = Date.now();
    }
    return request({
        url: `${getUrl}/admin/taskReportRecords/generalSonList`,
        method: 'POST',
        data:
        params,
    });
};

/**
 * 列表分页查询数据-下料
 * @param params 参数
 * @returns 回调
 */
const blankingPageLists = (params, timestamp = false) => {
    params = params || {};
    if (timestamp) {
        params['_t'] = Date.now();
    }
    return request({
        url: `${getUrl}/admin/taskReportRecords/blankingPageList`,
        method: 'get',
        params: {
            ...params,
        }
    });
};


/**
 * 列表分页查询数据-通用
 * @param params 参数
 * @returns 回调
 */
const listPages = (params, timestamp = false) => {
    params = params || {};
    if (timestamp) {
        params['_t'] = Date.now();
    }
    return request({
        url: `${getUrl}/admin/taskReportRecords/generalPageList`,
        method: 'get',
        params: {
            ...params,
        }
    });
};




export default {
    taskMaterialPanelDispatchs,
    FurnaceBatchs,
    detailWithDates,
    editBatchs,
    taskCombinedFurnacePageLists,
    taskListPages,
    listPages,
    blankingPageLists,
  listPage,
  taskListPage,
  taskMaterialPanelCuttingProcess,
  taskCombinedFurnacePageList,
  editBatch,
  FurnaceBatch,
  getWorkCenterBySection,
  taskGeneralDispatchWorkAdd,
  taskGeneralDispatchWorkAddBatch,
  taskGeneralDispatchWorkEditBatch,
  taskCombinedFurnaceAddBatch,
  taskCombinedFurnaceEditBatch,
  taskCombinedFurnaceProcesseditBatch,
  detailWithDate,
  taskGeneralSplit,
  taskMaterialPanelDispatch,
  taskMaterialPanelCompleted,
  taskMaterialPanelQuash,
  taskMaterialPanelSplit,
  processDispatch,
  taskGeneralWorkStepEditBatch,
  printConstructionTicket,
  taskGeneralPrint,
  getBaseUrl,
  getTokenLogin
};
