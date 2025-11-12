export interface CommonConfigVO {
  /**
   * id
   */
  id: string | number;

  /**
   * 名称
   */
  name: string;

  /**
   * 编码
   */
  code: string;

  /**
   * 类型
   */
  type: string;

  /**
   * 详情
   */
  detail: string;
}

export interface CommonConfigForm extends BaseEntity {
  /**
   * id
   */
  id?: string | number;

  /**
   * 名称
   */
  name?: string;

  /**
   * 编码
   */
  code?: string;

  /**
   * 类型
   */
  type?: string;

  /**
   * 详情
   */
  detail?: string;
}

export interface CommonConfigQuery extends PageQuery {
  /**
   * 名称
   */
  name?: string;

  /**
   * 编码
   */
  code?: string;

  /**
   * 类型
   */
  type?: string;

  /**
   * 详情
   */
  detail?: string;
}
