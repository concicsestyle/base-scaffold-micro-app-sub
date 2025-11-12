export interface DictGroupVO {
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

  /**
   * 字典类型数量
   */
  commonDictTypeNum: number;

  /**
   * 子数据
   */
  children?: DictGroupVO[];
}

export interface DictGroupForm extends BaseEntity {
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

export interface DictGroupQuery extends PageQuery {
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
