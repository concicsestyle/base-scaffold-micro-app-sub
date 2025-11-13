/*
 * @Description: 
 * @Autor: 王瑶
 * @Date: 2025-06-27 11:28:12
 * @LastEditors: 王瑶
 * @LastEditTime: 2025-07-04 15:10:02
 */
import request from '@/utils/request';
import {API_PREFIX} from '../prefix'
const getUrl = `/${API_PREFIX.system}/app/fileObject`;
// 导入文件
const importExcel = (params) => {
    return request({
      url: `${getUrl}/upload`,
      headers: {
          'Content-Type': 'multipart/form-data'
      },
      method: 'post',
      data: params,
    });
  };
export default {
    importExcel
}