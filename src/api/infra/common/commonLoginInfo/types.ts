export interface LoginInfoVO {
  infoId: string | number;
  tenantId: string | number;
  userName: string;
  status: string;
  ipaddr: string;
  loginLocation: string;
  loginTime: string;
  browser: string;
  os: string;
  msg: string;
}

export interface LoginInfoQuery extends PageQuery {
  ipaddr: string;
  userName: string;
  status: string;
  orderByColumn: string;
  isAsc: string;
}
