/*
 * @Description:
 * @Autor: 王瑶
 * @Date: 2025-07-09 09:48:15
 * @LastEditors: 王瑶
 * @LastEditTime: 2025-08-30 10:13:46
 */
import request from '@/utils/request';
// import { AxiosPromise } from 'axios';
import {API_PREFIX} from '../prefix'
const getUrl = `/${API_PREFIX.basic}/workCenterEz/basicWorkCenter`;//工作中心
const getUrls = `/${API_PREFIX.basic}/workCenterEz/basicDispatchunit`;//派工单元

/**
 * 查询刀具类别树
 * @param params 参数
 * @returns 回调
 */
export const listPage=(params)=>{
    return request({
        url: `${getUrl}/listPage`,
        method: 'post',
        data: {
            ...params,
            _t: new Date().getTime(),
        }
    });
}

/**
 * 新增
 * @param params 新增
 * @returns 回调
 */
export const save=(params)=>{
  return request({
    url: `${getUrl}/save`,
    method: 'post',
    data: {
      ...params,
      _t: new Date().getTime(),
    }
  });
}

/**
 * 修改
 * @param params 修改
 * @returns 回调
 */
export const update=(params)=>{
    return request({
        url: `${getUrl}/update`,
        method: 'post',
        data: {
            ...params,
            _t: new Date().getTime(),
        }
    });
}

/**
 * 查询
 * @param params 查询
 * @returns 回调
 */
export const getOneById=(params)=>{
    return request({
        url: `${getUrl}/getOneById`,
        method: 'post',
        data: {
            ...params,
            _t: new Date().getTime(),
        }
    });
}

/**
 * 查询
 * @param params 查询
 * @returns 回调
 */
export const deleteByIds=(params)=>{
    return request({
        url: `${getUrl}/deleteBatch`,
        method: 'post',
        data: {
            ...params,
            _t: new Date().getTime(),
        }
    });
}

/**
 * 删除 单个删除
 * @param params 查询
 * @returns 回调
 */
export const deleteById=(params)=>{
    return request({
        url: `${getUrl}/delete`,
        method: 'post',
        data: {
            ...params,
            _t: new Date().getTime(),
        }
    });
}

/**
 * 修改状态
 * @param params 查询
 * @returns 回调
 */
export const changeStatus=(params)=>{
    return request({
        url: `${getUrl}/changeStatus`,
        method: 'post',
        data: {
            ...params,
            _t: new Date().getTime(),
        }
    });
}

/**
 * 查询派工单元修改数据
 * @param params 查询
 * @returns 回调
 */
export const getListByWorkCenterId=(params)=>{
    return request({
        url: `${getUrls}/getListByWorkCenterId`,
        method: 'post',
        data: {
            ...params,
            _t: new Date().getTime(),
        }
    });
}

/**
 * 新增派工单元
 * @param params 查询
 * @returns 回调
 */
export const addDispatchunit=(params)=>{
    return request({
        url: `${getUrls}/addDispatchunit`,
        method: 'post',
        data: {
            ...params,
            _t: new Date().getTime(),
        }
    });
}


/**
 * 修改查询
 * @param params 查询
 * @returns 回调
 */
export const getOneByWorkCenterId=(params)=>{
    return request({
        url: `${getUrls}/getOneByWorkCenterId`,
        method: 'post',
        data: {
            ...params,
            // _t: new Date().getTime(),
        }
    });
}

/**
 * 修改回显孙子表信息
 * @param params 查询
 * @returns 回调
 */
export const getUnitResouceListBySonId=(params)=>{
    return request({
        url: `${getUrls}/getUnitResouceListBySonId`,
        method: 'post',
        data: {
            ...params,
            _t: new Date().getTime(),
        }
    });
}


/**
 * 修改
 * @param params 查询
 * @returns 回调
 */
export const updateUnit=(params)=>{
    return request({
        url: `${getUrls}/updateUnit`,
        method: 'post',
        data: {
            ...params,
            _t: new Date().getTime(),
        }
    });
}
/**
 * 派工单元修改状态
 */
export const changeStatusUnit=(params)=>{
    return request({
        url: `${getUrls}/changeStatus`,
        method: 'post',
        data: {
            ...params,
            _t: new Date().getTime(),
        }
    });
}
/**
 * 删除派工单元
 */
export const deleteBatchUnit=(params)=>{
    return request({
        url: `${getUrls}/deleteBatch`,
        method: 'post',
        data: {
            ...params,
            _t: new Date().getTime(),
        }
    });
}

/**
 * 新增查询工序信息
 */
export const addGetSpecs=(params)=>{
  return request({
    url: `${getUrl}/addGetSpecs`,
    method: 'post',
    data: {
      ...params,
      _t: new Date().getTime(),
    }
  });
}

