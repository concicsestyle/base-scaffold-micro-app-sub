/*
 * @Description: 
 * @Autor: 王瑶
 * @Date: 2025-07-02 10:00:00
 * @LastEditors: 王瑶
 * @LastEditTime: 2025-09-02 10:22:27
 */
import request from '@/utils/request';
import {API_PREFIX} from '../prefix'
const getUrl = `/${API_PREFIX.system}/codeRules/codeRuleInstance`;
// 编码规则模块
/**
 * 分页接口
 * @param params 参数
 * @returns 回调
 */
 const listPage = (params) => {
  return request({
    url: `${getUrl}/listPage`,
    method: 'post',
    data: {
      ...params,
      _t: new Date().getTime()
    }
  });
};
export default {
    listPage
}