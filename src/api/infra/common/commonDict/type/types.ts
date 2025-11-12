export interface DictTypeVO extends BaseEntity {
  dictId: number | string;
  dictGroupId: number | string;
  dictName: string;
  dictType: string;
  sort: number;
  remark: string;
}

export interface DictTypeForm {
  dictId?: number | string | undefined;
  dictGroupId?: number | string | undefined;
  dictName?: string;
  dictType?: string;
  sort?: number;
  remark?: string;
}

export interface DictTypeQuery extends PageQuery {
  dictGroupId?: number | string | undefined;
  dictName?: string;
  dictType?: string;
}
