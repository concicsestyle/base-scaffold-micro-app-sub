export interface BizCodeVO {
  /**
   * id
   */
  id: string | number;

  /**
   * 分组id
   */
  groupId: string | number;

  /**
   * 名称
   */
  name: string;

  /**
   * 编码
   */
  code: string;

  /**
   * 连接符
   */
  joinChar: string;

  /**
   * 介绍描述
   */
  introDesc: string;

  /**
   * 排序值
   */
  sort: number;

  /**
   * 状态
   */
  status: string;
}

export interface BizCodeForm extends BaseEntity {
  /**
   * id
   */
  id?: string | number;

  /**
   * 分组id
   */
  groupId?: string | number;

  /**
   * 名称
   */
  name?: string;

  /**
   * 编码
   */
  code?: string;

  /**
   * 连接符
   */
  joinChar?: string;

  /**
   * 介绍描述
   */
  introDesc?: string;

  /**
   * 排序值
   */
  sort?: number;

  /**
   * 状态
   */
  status?: string;
}

export interface BizCodeQuery extends PageQuery {
  /**
   * 分组id
   */
  groupId?: string | number;

  /**
   * 名称
   */
  name?: string;

  /**
   * 编码
   */
  code?: string;

  /**
   * 连接符
   */
  joinChar?: string;

  /**
   * 介绍描述
   */
  introDesc?: string;

  /**
   * 排序值
   */
  sort?: number;

  /**
   * 状态
   */
  status?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
