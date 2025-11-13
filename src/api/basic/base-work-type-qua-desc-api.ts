/*
 * @Description:工种资质信息表API对象
 * @Autor: 王瑶
 * @Date: 2025-06-25 09:58:14
 * @LastEditors: 王瑶
 * @LastEditTime: 2025-07-03 15:22:31
 */
import request from '@/utils/request';
import {API_PREFIX} from '../prefix'
// import { AxiosPromise } from 'axios';
const getUrl = `/${API_PREFIX.basic}/typeOfWork/workTypeQuaDesc`;

/**
 * 保存接口
 * @param params 参数
 * @returns 回调
 */
 const getById = (params, timestamp = false) => {
    params = params || {};
    if (timestamp) {
      params['_t'] = Date.now();
    }
  return request({
    url: `${getUrl}/getById`,
    method: 'post',
    data: {
      ...params,
    }
  });
};
export default {
    getById,

}