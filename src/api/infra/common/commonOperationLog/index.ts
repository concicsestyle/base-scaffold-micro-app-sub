import request from '../../../../utils/request';
import { OperationLogQuery, OperationLogVO } from './types';
import { AxiosPromise } from 'axios';

// 查询操作日志列表
export function list(query: OperationLogQuery): AxiosPromise<OperationLogVO[]> {
  return request({
    url: '/infra/admin/common/operationLog/list',
    method: 'get',
    params: query
  });
}

// 删除操作日志
export function delOperlog(operationId: string | number | Array<string | number>) {
  return request({
    url: '/infra/admin/common/operationLog/' + operationId,
    method: 'delete'
  });
}

// 清空操作日志
export function cleanOperlog() {
  return request({
    url: '/infra/admin/common/operationLog/clean',
    method: 'delete'
  });
}
