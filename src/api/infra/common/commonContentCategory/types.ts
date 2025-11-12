export interface CommonContentCategoryVO {
  /**
   * id
   */
  id: string | number;

  /**
   * 类型
   */
  type: string;

  /**
   * 父编码
   */
  parentCode: string;

  /**
   * 父名称
   */
  parentName: string;

  /**
   * 分类名称
   */
  name: string;

  /**
   * 分类编码
   */
  code: string;

  /**
   * 图标图片
   */
  icon: string;

  /**
   * 介绍描述
   */
  introDesc: string;

  /**
   * 显示类型
   */
  showType: string;

  /**
   * 排序类型
   */
  sortType: string;

  /**
   * 排序值
   */
  sort: number;

  /**
   * 状态
   */
  status: string;

  /**
   * 子数据
   */
  children?: CommonContentCategoryVO[];
}

export interface CommonContentCategoryForm extends BaseEntity {
  /**
   * id
   */
  id?: string | number;

  /**
   * 类型
   */
  type?: string;

  /**
   * 父编码
   */
  parentCode?: string;

  /**
   * 分类名称
   */
  name?: string;

  /**
   * 分类编码
   */
  code?: string;

  /**
   * 图标图片
   */
  icon?: string;

  /**
   * 介绍描述
   */
  introDesc?: string;

  /**
   * 显示类型
   */
  showType?: string;

  /**
   * 排序类型
   */
  sortType?: string;

  /**
   * 排序值
   */
  sort?: number;

  /**
   * 状态
   */
  status?: string;
}

export interface CommonContentCategoryQuery extends PageQuery {
  /**
   * 类型
   */
  type?: string;

  /**
   * 父编码
   */
  parentCode?: string;

  /**
   * 分类名称
   */
  name?: string;

  /**
   * 分类编码
   */
  code?: string;

  /**
   * 图标图片
   */
  icon?: string;

  /**
   * 介绍描述
   */
  introDesc?: string;

  /**
   * 显示类型
   */
  showType?: string;

  /**
   * 排序类型
   */
  sortType?: string;

  /**
   * 排序值
   */
  sort?: number;

  /**
   * 状态
   */
  status?: string;
}
