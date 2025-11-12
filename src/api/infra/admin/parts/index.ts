/*
 * @Description: 
 * @Autor: 王瑶
 * @Date: 2025-07-17 13:44:27
 * @LastEditors: 王瑶
 * @LastEditTime: 2025-07-22 18:18:44
 */
import request from '../../../../utils/request';
import {API_PREFIX} from '../../../prefix'
// 查询零件列表
export const listPart = (params)=> {
  return request({
    url: `/${API_PREFIX.ips}/admin/PARTS/list`,
    method: 'get',
    params: params
  });
};
export const pageList = (params)=> {
    return request({
      url: `/${API_PREFIX.ips}/admin/PARTS/pageList`,
      method: 'get',
      params: params
    });
  };
// 根据工艺类型查询工序
export const queryProcedureByTechnologyType = (params)=> {
    return request({
      url: `/${API_PREFIX.ips}/remote/erzhong/process/module/queryProcedureByTechnologyType`,
      method: 'post',
      data: params
    });
  };
  

