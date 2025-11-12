import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { JobVO, JobForm, JobQuery } from './types';

/**
 * 查询定时任务调度列表
 * @param query
 * @returns {*}
 */

export const listJob = (query?: JobQuery): AxiosPromise<JobVO[]> => {
  return request({
    url: '/infra/admin/quartz/job/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询定时任务调度详细
 * @param jobId
 */
export const getJob = (jobId: string | number): AxiosPromise<JobVO> => {
  return request({
    url: '/infra/admin/quartz/job/' + jobId,
    method: 'get'
  });
};

/**
 * 新增定时任务调度
 * @param data
 */
export const addJob = (data: JobForm) => {
  return request({
    url: '/infra/admin/quartz/job',
    method: 'post',
    data: data
  });
};

/**
 * 修改定时任务调度
 * @param data
 */
export const updateJob = (data: JobForm) => {
  return request({
    url: '/infra/admin/quartz/job',
    method: 'put',
    data: data
  });
};

/**
 * 删除定时任务调度
 * @param jobId
 */
export const delJob = (jobId: string | number | Array<string | number>) => {
  return request({
    url: '/infra/admin/quartz/job/' + jobId,
    method: 'delete'
  });
};

/**
 * 任务状态修改
 */
export function changeJobStatus(jobId: string | number, status: string | number) {
  const data = {
    jobId,
    status
  };
  return request({
    url: '/infra/admin/quartz/job/changeStatus',
    method: 'put',
    data: data
  });
}

/**
 * 定时任务立即执行一次
 */
export function runJob(jobId: string | number, jobGroup: string | number) {
  const data = {
    jobId,
    jobGroup
  };
  return request({
    url: '/infra/admin/quartz/job/run',
    method: 'put',
    data: data
  });
}
