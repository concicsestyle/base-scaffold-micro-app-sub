export interface CommonContentVO {
  /**
   * id
   */
  id: string | number;

  /**
   * 分类编码
   */
  categoryCode: string;

  /**
   * 分类名称
   */
  categoryName: string;

  /**
   * 标题
   */
  title: string;

  /**
   * 内容类型
   */
  contentType: string;

  /**
   * 简要描述
   */
  briefDesc: string;

  /**
   * 封面图片
   */
  coverPictures: string;

  /**
   * 详细介绍描述
   */
  detailIntroDesc: string;

  /**
   * 视频地址
   */
  videoUrls: string | number;

  /**
   * 文件、附件地址
   */
  fileUrls: string;

  /**
   * 开始时间
   */
  startTime: string;

  /**
   * 结束时间
   */
  endTime: string;

  /**
   * 跳转类型
   */
  redirectType: string;

  /**
   * 跳转值、路径、链接
   */
  redirectValue: string;

  /**
   * 跳转参数
   */
  redirectParam: string;

  /**
   * 来源
   */
  source: string;

  /**
   * 关键字、标签
   */
  keywordTag: string;

  /**
   * 作者名称
   */
  authorName: string;

  /**
   * 发布时间
   */
  publicTime: string;

  /**
   * 访问数
   */
  accessNum: number;

  /**
   * 置顶标识
   */
  topFlag: number;

  /**
   * 额外信息
   */
  extInfo: string;

  /**
   * 排序
   */
  sort: number;

  /**
   * 状态
   */
  status: string;
}

export interface CommonContentForm extends BaseEntity {
  /**
   * id
   */
  id?: string | number;

  /**
   * 分类编码
   */
  categoryCode?: string;

  /**
   * 标题
   */
  title?: string;

  /**
   * 内容类型
   */
  contentType?: string;

  /**
   * 简要描述
   */
  briefDesc?: string;

  /**
   * 封面图片
   */
  coverPictures?: string;

  /**
   * 详细介绍描述
   */
  detailIntroDesc?: string;

  /**
   * 视频地址
   */
  videoUrls?: string | number;

  /**
   * 文件、附件地址
   */
  fileUrls?: string;

  /**
   * 开始时间
   */
  startTime?: string;

  /**
   * 结束时间
   */
  endTime?: string;

  /**
   * 跳转类型
   */
  redirectType?: string;

  /**
   * 跳转值、路径、链接
   */
  redirectValue?: string;

  /**
   * 跳转参数
   */
  redirectParam?: string;

  /**
   * 来源
   */
  source?: string;

  /**
   * 关键字、标签
   */
  keywordTag?: string;

  /**
   * 作者名称
   */
  authorName?: string;

  /**
   * 发布时间
   */
  publicTime?: string;

  /**
   * 访问数
   */
  accessNum?: number;

  /**
   * 置顶标识
   */
  topFlag?: number;

  /**
   * 额外信息
   */
  extInfo?: string;

  /**
   * 排序
   */
  sort?: number;

  /**
   * 状态
   */
  status?: string;
}

export interface CommonContentQuery extends PageQuery {
  /**
   * 分类编码
   */
  categoryCode?: string;

  /**
   * 标题
   */
  title?: string;

  /**
   * 内容类型
   */
  contentType?: string;

  /**
   * 简要描述
   */
  briefDesc?: string;

  /**
   * 封面图片
   */
  coverPictures?: string;

  /**
   * 详细介绍描述
   */
  detailIntroDesc?: string;

  /**
   * 视频地址
   */
  videoUrls?: string | number;

  /**
   * 文件、附件地址
   */
  fileUrls?: string;

  /**
   * 开始时间
   */
  startTime?: string;

  /**
   * 结束时间
   */
  endTime?: string;

  /**
   * 跳转类型
   */
  redirectType?: string;

  /**
   * 跳转值、路径、链接
   */
  redirectValue?: string;

  /**
   * 跳转参数
   */
  redirectParam?: string;

  /**
   * 来源
   */
  source?: string;

  /**
   * 关键字、标签
   */
  keywordTag?: string;

  /**
   * 作者名称
   */
  authorName?: string;

  /**
   * 发布时间
   */
  publicTime?: string;

  /**
   * 访问数
   */
  accessNum?: number;

  /**
   * 置顶标识
   */
  topFlag?: number;

  /**
   * 额外信息
   */
  extInfo?: string;

  /**
   * 排序
   */
  sort?: number;

  /**
   * 状态
   */
  status?: string;

  /**
   * 包含子分类标识
   */
  containSubCategoryFlag?: number;
}
