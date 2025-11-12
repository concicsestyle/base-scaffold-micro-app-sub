export interface BizCodeHistoryVO {
  /**
   * id
   */
  id: string | number;

  /**
   * 分组id
   */
  groupId: string | number;

  /**
   * 业务编码id
   */
  bizCodeId: string | number;

  /**
   * 业务编码编码
   */
  bizCodeCode: string;

  /**
   * 业务编码名称
   */
  bizCodeName: string;

  /**
   * 编码值
   */
  codeValue: string;

  /**
   * 生成时间
   */
  genTime: string;

  /**
   * 失效标识
   */
  expireFlag: number;

  /**
   * 规则快照
   */
  ruleSnapshot: string;

  /**
   * 状态
   */
  status: string;
}

export interface BizCodeHistoryForm extends BaseEntity {
  /**
   * id
   */
  id?: string | number;

  /**
   * 分组id
   */
  groupId?: string | number;

  /**
   * 业务编码id
   */
  bizCodeId?: string | number;

  /**
   * 业务编码编码
   */
  bizCodeCode?: string;

  /**
   * 业务编码名称
   */
  bizCodeName?: string;

  /**
   * 编码值
   */
  codeValue?: string;

  /**
   * 生成时间
   */
  genTime?: string;

  /**
   * 失效标识
   */
  expireFlag?: number;

  /**
   * 规则快照
   */
  ruleSnapshot?: string;

  /**
   * 状态
   */
  status?: string;
}

export interface BizCodeHistoryQuery extends PageQuery {
  /**
   * 分组id
   */
  groupId?: string | number;

  /**
   * 业务编码id
   */
  bizCodeId?: string | number;

  /**
   * 业务编码编码
   */
  bizCodeCode?: string;

  /**
   * 业务编码名称
   */
  bizCodeName?: string;

  /**
   * 编码值
   */
  codeValue?: string;

  /**
   * 生成时间
   */
  genTime?: string;

  /**
   * 失效标识
   */
  expireFlag?: number;

  /**
   * 规则快照
   */
  ruleSnapshot?: string;

  /**
   * 状态
   */
  status?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
