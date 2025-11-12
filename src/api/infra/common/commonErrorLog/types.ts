export interface CommonErrorLogVO {
  /**
   * 用户ID
   */
  id: string | number;

  /**
   * 错误时间
   */
  errorTime: string;

  /**
   * 环境
   */
  environment: string;

  /**
   * 级别
   */
  level: string;

  /**
   * 来源
   */
  source: string;

  /**
   * 服务
   */
  service: string;

  /**
   * 模块
   */
  module: string;

  /**
   * 用户id
   */
  userId: string | number;

  /**
   * 唯一用户id
   */
  uniUserId: string | number;

  /**
   * 用户名
   */
  userName: string;

  /**
   * ip
   */
  ip: string;

  /**
   * 地点
   */
  location: string;

  /**
   * 设备信息
   */
  deviceInfo: string;

  /**
   * 请求方法
   */
  requestMethod: string;

  /**
   * 请求URL
   */
  requestUrl: string;

  /**
   * 请求头
   */
  requestHeaders: string;

  /**
   * 请求体
   */
  requestBody: string;

  /**
   * 请求查询参数
   */
  requestQueryParams: string;

  /**
   * 请求详情
   */
  requestDetail: string;

  /**
   * 响应状态码
   */
  responseStatusCode: string;

  /**
   * 响应头
   */
  responseHeaders: string;

  /**
   * 响应体
   */
  responseBody: string;

  /**
   * 错误代码
   */
  errorCode: string;

  /**
   * 错误信息
   */
  errorMessage: string;

  /**
   * 错误详情
   */
  errorDetail: string;

  /**
   * 额外信息
   */
  additionalInfo: string;
}

export interface CommonErrorLogForm extends BaseEntity {
  /**
   * 用户ID
   */
  id?: string | number;

  /**
   * 错误时间
   */
  errorTime?: string;

  /**
   * 环境
   */
  environment?: string;

  /**
   * 级别
   */
  level?: string;

  /**
   * 来源
   */
  source?: string;

  /**
   * 服务
   */
  service?: string;

  /**
   * 模块
   */
  module?: string;

  /**
   * 用户id
   */
  userId?: string | number;

  /**
   * 唯一用户id
   */
  uniUserId?: string | number;

  /**
   * 用户名
   */
  userName?: string;

  /**
   * ip
   */
  ip?: string;

  /**
   * 地点
   */
  location?: string;

  /**
   * 设备信息
   */
  deviceInfo?: string;

  /**
   * 请求方法
   */
  requestMethod?: string;

  /**
   * 请求URL
   */
  requestUrl?: string;

  /**
   * 请求头
   */
  requestHeaders?: string;

  /**
   * 请求体
   */
  requestBody?: string;

  /**
   * 请求查询参数
   */
  requestQueryParams?: string;

  /**
   * 请求详情
   */
  requestDetail?: string;

  /**
   * 响应状态码
   */
  responseStatusCode?: string;

  /**
   * 响应头
   */
  responseHeaders?: string;

  /**
   * 响应体
   */
  responseBody?: string;

  /**
   * 错误代码
   */
  errorCode?: string;

  /**
   * 错误信息
   */
  errorMessage?: string;

  /**
   * 错误详情
   */
  errorDetail?: string;

  /**
   * 额外信息
   */
  additionalInfo?: string;
}

export interface CommonErrorLogQuery extends PageQuery {
  /**
   * 错误时间
   */
  errorTime?: string;

  /**
   * 环境
   */
  environment?: string;

  /**
   * 级别
   */
  level?: string;

  /**
   * 来源
   */
  source?: string;

  /**
   * 服务
   */
  service?: string;

  /**
   * 模块
   */
  module?: string;

  /**
   * 用户id
   */
  userId?: string | number;

  /**
   * 唯一用户id
   */
  uniUserId?: string | number;

  /**
   * 用户名
   */
  userName?: string;

  /**
   * ip
   */
  ip?: string;

  /**
   * 地点
   */
  location?: string;

  /**
   * 设备信息
   */
  deviceInfo?: string;

  /**
   * 请求方法
   */
  requestMethod?: string;

  /**
   * 请求URL
   */
  requestUrl?: string;

  /**
   * 请求头
   */
  requestHeaders?: string;

  /**
   * 请求体
   */
  requestBody?: string;

  /**
   * 请求查询参数
   */
  requestQueryParams?: string;

  /**
   * 请求详情
   */
  requestDetail?: string;

  /**
   * 响应状态码
   */
  responseStatusCode?: string;

  /**
   * 响应头
   */
  responseHeaders?: string;

  /**
   * 响应体
   */
  responseBody?: string;

  /**
   * 错误代码
   */
  errorCode?: string;

  /**
   * 错误信息
   */
  errorMessage?: string;

  /**
   * 错误详情
   */
  errorDetail?: string;

  /**
   * 额外信息
   */
  additionalInfo?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
