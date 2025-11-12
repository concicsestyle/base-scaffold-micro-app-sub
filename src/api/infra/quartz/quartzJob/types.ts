export interface JobVO {
  /**
   * 任务id
   */
  jobId: string | number;

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
   * cron执行表达式
   */
  cronExpression: string;

  /**
   * 计划执行错误策略
   */
  misfirePolicy: string;

  /**
   * 是否并发执行
   */
  concurrent: string;

  /**
   * 状态
   */
  status: string;

  /**
   * 下次执行时间
   */
  nextValidTime: string;
}

export interface JobForm extends BaseEntity {
  /**
   * 任务id
   */
  jobId?: string | number;

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
   * cron执行表达式
   */
  cronExpression?: string;

  /**
   * 计划执行错误策略
   */
  misfirePolicy?: string;

  /**
   * 是否并发执行
   */
  concurrent?: string;

  /**
   * 状态
   */
  status?: string;

  /**
   * 下次执行时间
   */
  nextValidTime?: string;
}

export interface JobQuery extends PageQuery {
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
   * cron执行表达式
   */
  cronExpression?: string;

  /**
   * 计划执行错误策略
   */
  misfirePolicy?: string;

  /**
   * 是否并发执行
   */
  concurrent?: string;

  /**
   * 状态
   */
  status?: string;
}
