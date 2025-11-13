/*
 * @Description:
 * @Autor: 王瑶
 * @Date: 2025-06-25 09:58:14
 * @LastEditors: 王瑶
 * @LastEditTime: 2025-07-10 17:51:57
 */
import request from '@/utils/request';
import {API_PREFIX} from '../../prefix'
// import { AxiosPromise } from 'axios';
const getUrl = `/${API_PREFIX.basic}/equipment/eqpModel`;

/**
 * 更新数据
 * @param params 参数   
 * @returns 回调
 */
 const listPage = (params) => {
  return request({
    url: `${getUrl}/listPage`,
    method: 'post',
    data: {
      ...params,
    }
  });
};

export default {
    listPage,
}