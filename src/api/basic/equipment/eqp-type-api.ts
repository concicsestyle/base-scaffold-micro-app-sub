/*
 * @Description:
 * @Autor: 王瑶
 * @Date: 2025-06-25 09:58:14
 * @LastEditors: 王瑶
 * @LastEditTime: 2025-07-23 09:01:49
 */
import request from '@/utils/request';
import {API_PREFIX} from '../../prefix'
// import { AxiosPromise } from 'axios';
const getUrl = `/${API_PREFIX.basic}/equipment/eqpType`;

/**
 * 更新数据
 * @param params 参数   
 * @returns 回调
 */
 const list = (params) => {
  return request({
    url: `${getUrl}/list`,
    method: 'post',
    data: {
      ...params,
    }
  });
};

export default {
    list,
}