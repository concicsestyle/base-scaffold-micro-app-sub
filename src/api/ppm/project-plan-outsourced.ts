/*
 * @Description:
 * @Autor: 王瑶
 * @Date: 2025-06-25 09:58:14
 * @LastEditors: 王瑶
 * @LastEditTime: 2025-09-02 10:19:34
 */
import request from '@/utils/request';
import { API_PREFIX } from '../prefix';
const getUrl = `/${API_PREFIX.ppm}/masterPlan`;
/**
 * 分页接口
 * @param params 参数
 * @returns 回调
 */
const synergismPageList = (params) => {
  params = params || {};
  return request({
    url: `${getUrl}/outsourcing/page`,
    method: 'get',
    params: {
      ...params
    }
  });
};
/**
 * 分页接口-缺表
 * @param params 参数
 * @returns 回调
 */
const outsourcingList = (params) => {
  params = params || {};
  return request({
    url: `${getUrl}/shortage-report/procurement-plan/page`,
    method: 'post',
    data: {
      ...params
    }
  });
};

/**
 * 导出
 * @param params 参数
 * @returns 回调
 */
const exportSynergism = (params) => {
    return request({
      url: `${getUrl}/outsourcing/export`,
      method: 'post',
      responseType: 'blob',
      data: params
    });
  };
/**
 * 分页接口——报表
 * @param params 参数
 * @returns 回调
 */
const reportPageList = (params) => {
    params = params || {};
    return request({
      url: `${getUrl}/reportPageList`,
      method: 'get',
      params: {
        ...params
      }
    });
  };
  /**
   * 导出——报表
   * @param params 参数
   * @returns 回调
   */
  const exportReport = (params) => {
      return request({
        url: `${getUrl}/shortage-report/outsourcing/export`,
        method: 'post',
        responseType: 'blob',
        data: params,
      });
    };
    /**
     * 外协--协同编辑
     * @param params 参数
     * @returns 回调
     */
    const procurementEdit = (params) => {
      params = params || {};
      return request({
        url: `${getUrl}/outsourcing/edit`,
        method: 'post',
        data: {
          ...params
        }
      });
    };
  
export default {
    synergismPageList,
    exportSynergism,
    reportPageList,
    exportReport,
    outsourcingList,
    procurementEdit
};
