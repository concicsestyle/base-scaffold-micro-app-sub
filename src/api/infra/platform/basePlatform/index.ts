import request from '../../../../utils/request';
import { AxiosPromise } from 'axios';

// 查询用户应用列表
export function getUserAppAllList(): AxiosPromise<any[]> {
  return request({
    url: 'infra/admin/basePlatformApp/getUserAppAllList',
    headers: {
      isEncrypt: true
    },
    method: 'post'
  });
}

// 获取应用授权编码
export function getAppCodeInfo(query: any): AxiosPromise<any> {
  return request({
    url: 'infra/admin/basePlatformApp/getAppCodeInfo',
    headers: {
      isEncrypt: true
    },
    method: 'post',
    params: query
  });
}

// 同步全量组织架构相关信息
export function syncAllOrgRelationInfo(query: any) {
  return request({
    url: 'infra/admin/basePlatformOrg/syncAllOrgRelationInfo',
    method: 'get',
    params: query
  });
}

// 根据userId同步用户详细信息
export function syncUserDetailInfoByUserId(query: any) {
  return request({
    url: 'infra/admin/basePlatformOrg/syncUserDetailInfoByUserId',
    method: 'get',
    params: query
  });
}
