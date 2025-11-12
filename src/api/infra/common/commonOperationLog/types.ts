export interface OperationLogQuery extends PageQuery {
  operationIp: string;
  title: string;
  operatorName: string;
  businessType: string;
  status: string;
  orderByColumn: string;
  isAsc: string;
}

export interface OperationLogVO extends BaseEntity {
  operationId: string | number;
  tenantId: string;
  title: string;
  businessType: number;
  businessTypes: number[] | undefined;
  method: string;
  requestMethod: string;
  operatorType: number;
  operatorName: string;
  operatorDeptName: string;
  operationUrl: string;
  operationIp: string;
  operationLocation: string;
  operationParam: string;
  operationTime: string;
  jsonResult: string;
  status: number;
  errorMsg: string;
  costTime: number;
}

export interface OperationLogForm {
  operationId: number | string | undefined;
  tenantId: string | number | undefined;
  title: string;
  businessType: number;
  businessTypes: number[] | undefined;
  method: string;
  requestMethod: string;
  operatorType: number;
  operatorName: string;
  operatorDeptName: string;
  operationUrl: string;
  operationIp: string;
  operationLocation: string;
  operationParam: string;
  operationTime: string;
  jsonResult: string;
  status: number;
  errorMsg: string;
  costTime: number;
}
