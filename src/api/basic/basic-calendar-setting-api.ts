/*
 * @Description:
 * @Autor: 王瑶
 * @Date: 2025-06-25 09:58:14
 * @LastEditors: 王瑶
 * @LastEditTime: 2025-07-07 16:20:20
 */
import request from '@/utils/request';
import {API_PREFIX} from '../prefix'
const getUrl = `/${API_PREFIX.basic}/workCenter/basicCalendarSetting`;
/**
 * 根据条件查询日历休息日
 * @param params 参数
 * @returns 回调
 */
 const getList = (params) => {
  return request({
    url: `${getUrl}/list`,
    method: 'post',
    data: {
      ...params,
    }
  });
};
/**
 * 同步节假日
 * @param params 参数
 * @returns 回调
 */
const syncHoliday = (params) => {
    return request({
      url: `${getUrl}/syncHoliday`,
      method: 'post',
      data: {
        ...params,
      }
    });
  };

export default {
    getList,
    syncHoliday

}