import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { JobLogVO, JobLogForm, JobLogQuery } from './types';

/**
 * 查询定时任务调度日志列表
 * @param query
 * @returns {*}
 */

export const listJobLog = (query?: JobLogQuery): AxiosPromise<JobLogVO[]> => {
  return request({
    url: '/infra/admin/quartz/jobLog/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询定时任务调度日志详细
 * @param jobLogId
 */
export const getJobLog = (jobLogId: string | number): AxiosPromise<JobLogVO> => {
  return request({
    url: '/infra/admin/quartz/jobLog/' + jobLogId,
    method: 'get'
  });
};

/**
 * 新增定时任务调度日志
 * @param data
 */
export const addJobLog = (data: JobLogForm) => {
  return request({
    url: '/infra/admin/quartz/jobLog',
    method: 'post',
    data: data
  });
};

/**
 * 修改定时任务调度日志
 * @param data
 */
export const updateJobLog = (data: JobLogForm) => {
  return request({
    url: '/infra/admin/quartz/jobLog',
    method: 'put',
    data: data
  });
};

/**
 * 删除定时任务调度日志
 * @param jobLogId
 */
export const delJobLog = (jobLogId: string | number | Array<string | number>) => {
  return request({
    url: '/infra/admin/quartz/jobLog/' + jobLogId,
    method: 'delete'
  });
};

/**
 * 清空调度日志
 */
export function cleanJobLog() {
  return request({
    url: '/infra/admin/quartz/jobLog/clean',
    method: 'delete'
  });
}
