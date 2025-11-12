export interface BizCodeGroupVO {
  /**
   * id
   */
  id: string | number;

  /**
   * 父id
   */
  parentId: string | number;

  /**
   * 分组名称
   */
  groupName: string;

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

export interface BizCodeGroupForm extends BaseEntity {
  /**
   * id
   */
  id?: string | number;

  /**
   * 父id
   */
  parentId?: string | number;

  /**
   * 分组名称
   */
  groupName?: string;

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

export interface BizCodeGroupQuery extends PageQuery {
  /**
   * 父id
   */
  parentId?: string | number;

  /**
   * 分组名称
   */
  groupName?: string;

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
