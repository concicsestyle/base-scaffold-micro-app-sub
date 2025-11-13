/*
 * @Description: 
 * @Autor: 王瑶
 * @Date: 2025-06-27 11:28:12
 * @LastEditors: 王瑶
 * @LastEditTime: 2025-07-04 15:10:02
 */
import request from '@/utils/request';
import {API_PREFIX} from '../prefix'
// const getUrl = `/${API_PREFIX.system}/org/company`;
const getUrl = `/infra/admin/common/dictData/type`;
// 查询部门列表
//  const listOrgTree = (params) => {
//   return request({
//     url: `${getUrl}/listOrgTree`,
//     method: 'post',
//     data: {
//         ...params,
//         _t: new Date().getTime(),
//     }
//   });
// };

 const listOrgTree = (params) => {
  return request({
    url: `${getUrl}/dept_category`,
    method: 'get',
    data: {
        
    }
  });
};
export default {
    listOrgTree
}