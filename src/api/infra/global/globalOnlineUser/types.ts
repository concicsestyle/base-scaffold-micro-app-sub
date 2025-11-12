export interface OnlineQuery extends PageQuery {
  ipaddr: string;
  userName: string;
}

export interface OnlineVO extends BaseEntity {
  tokenId: string;
  deptName: string;
  userName: string;
  ipaddr: string;
  loginLocation: string;
  loginTime: number;
  browser: string;
  os: string;
}
