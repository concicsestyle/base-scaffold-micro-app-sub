import request from '../../../../utils/request';
import { AxiosPromise } from 'axios';
import { CacheVO } from './types';

// 查询缓存详细
export function getCache(): AxiosPromise<CacheVO> {
  return request({
    url: '/infra/admin/global/cache',
    method: 'get'
  });
}

// 查询缓存名称列表
export function listCacheName() {
  return request({
    url: '/infra/admin/global/cache/getNames',
    method: 'get'
  });
}

// 查询缓存键名列表
export function listCacheKey(cacheName: string) {
  return request({
    url: '/infra/admin/global/cache/getKeys/' + cacheName,
    method: 'get'
  });
}

// 查询缓存内容
export function getCacheValue(cacheName: string, cacheKey: string) {
  return request({
    url: '/infra/admin/global/cache/getValue/' + cacheName + '/' + cacheKey,
    method: 'get'
  });
}

// 清理指定名称缓存
export function clearCacheName(cacheName: string) {
  return request({
    url: '/infra/admin/global/cache/clearCacheName/' + cacheName,
    method: 'delete'
  });
}

// 清理指定键名缓存
export function clearCacheKey(cacheName: string, cacheKey: string) {
  return request({
    url: '/infra/admin/global/cache/clearCacheKey/' + cacheName + '/' + cacheKey,
    method: 'delete'
  });
}

// 清理全部缓存
export function clearCacheAll() {
  return request({
    url: '/infra/admin/global/cache/clearCacheAll',
    method: 'delete'
  });
}
