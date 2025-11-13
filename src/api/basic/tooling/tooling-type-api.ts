/*
 * @Description:
 * @Autor: 王瑶
 * @Date: 2025-06-25 09:58:14
 * @LastEditors: 王瑶
 * @LastEditTime: 2025-07-10 15:22:29
 */
import request from '@/utils/request';
import {API_PREFIX} from '../../prefix'
// import { AxiosPromise } from 'axios';
const getUrl = `/${API_PREFIX.basic}/tooling/toolingType`;

/**
 * 查询工装类别树（全部查出）
 * @param params 参数   
 * @returns 回调
 */
 const listTree = (params) => {
  return request({
    url: `${getUrl}/listTree`,
    method: 'post',
    data: {
      ...params,
    }
  });
};

export default {
    listTree,
}