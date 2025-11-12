import request from '../../../utils/request';
import { AxiosPromise } from 'axios';
import { RouteRecordRaw } from 'vue-router';
import { UserQuery } from '@/api/infra/admin/adminUser/types';

// 获取路由
export function getRouters(query: any): AxiosPromise<RouteRecordRaw[]> {
  return request({
    url: 'infra/admin/admin/menu/getRouters',
    method: 'get',
    params: query
  });
}
