/*
 * @Description: 
 * @Autor: 王瑶
 * @Date: 2025-06-27 11:28:12
 * @LastEditors: 王瑶
 * @LastEditTime: 2025-09-02 10:23:39
 */
import request from '@/utils/request';
import {API_PREFIX} from '../prefix'
const getUrl = `/${API_PREFIX.system}/app/referencePage`;
// 查询引用页面接口
 const getReference = (params) => {
  return request({
    url: `${getUrl}/getReference`,
    method: 'post',
    data: {
        ...params,
        _t: new Date().getTime(),
    }
  });
};
export default {
    getReference
}