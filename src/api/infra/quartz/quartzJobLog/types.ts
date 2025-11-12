export interface JobLogVO {
  /**
   * 任务日志id
   */
  jobLogId: string | number;

  /**
   * 任务名称
   */
  jobName: string;

  /**
   * 任务组名
   */
  jobGroup: string;

  /**
   * 调用目标字符串
   */
  invokeTarget: string;

  /**
   * 日志信息
   */
  jobMessage: string;

  /**
   * 执行状态
   */
  status: string;

  /**
   * 异常信息
   */
  exceptionInfo: string;
}

export interface JobLogForm extends BaseEntity {
  /**
   * 任务日志id
   */
  jobLogId?: string | number;

  /**
   * 任务名称
   */
  jobName?: string;

  /**
   * 任务组名
   */
  jobGroup?: string;

  /**
   * 调用目标字符串
   */
  invokeTarget?: string;

  /**
   * 日志信息
   */
  jobMessage?: string;

  /**
   * 执行状态
   */
  status?: string;

  /**
   * 异常信息
   */
  exceptionInfo?: string;
}

export interface JobLogQuery extends PageQuery {
  /**
   * 任务名称
   */
  jobName?: string;

  /**
   * 任务组名
   */
  jobGroup?: string;

  /**
   * 调用目标字符串
   */
  invokeTarget?: string;

  /**
   * 日志信息
   */
  jobMessage?: string;

  /**
   * 执行状态
   */
  status?: string;

  /**
   * 异常信息
   */
  exceptionInfo?: string;
}
