export interface BizCodeRuleVO {
  /**
   * id
   */
  id: string | number;

  /**
   * 业务编码id
   */
  bizCodeId: string | number;

  /**
   * 序列号，排序值，规则执行顺序，数值越小优先级越高
   */
  indexNum: number;

  /**
   * 规则类型，字典类型：common_biz_code_rule_type
   */
  ruleType: string;

  /**
   * 规则类型-constant：常量值
   */
  constantValue: string;

  /**
   * 规则类型-date_time：日期时间格式化模板
   */
  dateFormatTemplate: string;

  /**
   * 规则类型-serial_num：编号长度
   */
  serialNumLength: number;

  /**
   * 规则类型-serial_num：编号起始值
   */
  serialNumStartValue: number;

  /**
   * 规则类型-serial_num：编号步长
   */
  serialNumStepLength: number;

  /**
   * 规则类型-random_char：随机字符长度
   */
  randomCharLength: number;

  /**
   * 状态
   */
  status: string;
}

export interface BizCodeRuleForm extends BaseEntity {
  /**
   * id
   */
  id?: string | number;

  /**
   * 业务编码id
   */
  bizCodeId?: string | number;

  /**
   * 序列号，排序值，规则执行顺序，数值越小优先级越高
   */
  indexNum?: number;

  /**
   * 规则类型，字典类型：common_biz_code_rule_type
   */
  ruleType?: string;

  /**
   * 规则类型-constant：常量值
   */
  constantValue?: string;

  /**
   * 规则类型-date_time：日期时间格式化模板
   */
  dateFormatTemplate?: string;

  /**
   * 规则类型-serial_num：编号长度
   */
  serialNumLength?: number;

  /**
   * 规则类型-serial_num：编号起始值
   */
  serialNumStartValue?: number;

  /**
   * 规则类型-serial_num：编号步长
   */
  serialNumStepLength?: number;

  /**
   * 规则类型-random_char：随机字符长度
   */
  randomCharLength?: number;

  /**
   * 状态
   */
  status?: string;
}

export interface BizCodeRuleQuery extends PageQuery {
  /**
   * 业务编码id
   */
  bizCodeId?: string | number;

  /**
   * 序列号，排序值，规则执行顺序，数值越小优先级越高
   */
  indexNum?: number;

  /**
   * 规则类型，字典类型：common_biz_code_rule_type
   */
  ruleType?: string;

  /**
   * 规则类型-constant：常量值
   */
  constantValue?: string;

  /**
   * 规则类型-date_time：日期时间格式化模板
   */
  dateFormatTemplate?: string;

  /**
   * 规则类型-serial_num：编号长度
   */
  serialNumLength?: number;

  /**
   * 规则类型-serial_num：编号起始值
   */
  serialNumStartValue?: number;

  /**
   * 规则类型-serial_num：编号步长
   */
  serialNumStepLength?: number;

  /**
   * 规则类型-random_char：随机字符长度
   */
  randomCharLength?: number;

  /**
   * 状态
   */
  status?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
