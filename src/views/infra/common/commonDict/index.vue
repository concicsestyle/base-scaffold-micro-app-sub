<template>
  <div class="p-4">
    <el-row :gutter="20">
      <!-- 字典分组 -->
      <el-col :lg="4" :xs="24">
        <el-card shadow="hover" style="height: 800px">
          <div v-loading="dictGroupLoading">
            <div class="flex flex-row gap-1">
              <el-input v-model="dictGroupNameSearch" placeholder="请输入字典分组名称" prefix-icon="Search" clearable @input="searchDictGroup" />
              <el-tooltip effect="dark" content="新增字典分组" placement="top-start">
                <el-button :icon="Plus" type="primary" plain circle size="default" @click="handleDictGroupAdd" />
              </el-tooltip>
            </div>
            <el-tree
              ref="dictGroupTreeRef"
              class="mt-2"
              node-key="id"
              :data="dictGroupOptions"
              :props="{ label: 'groupName', children: 'children' }"
              :expand-on-click-node="false"
              :filter-node-method="filterDictGroupTreeNode"
              highlight-current
              icon="Menu"
              @node-click="handleDictGroupTreeNodeClick"
            >
              <template #default="{ node, data }">
                <div class="flex items-center justify-center gap-2" style="font-size: 14px">
                  <div class="flex items-center flex-1 max-w-[150px] overflow-hidden">
                    <el-icon :size="12" class="mr-1"><Grid /></el-icon>
                    <el-tooltip effect="dark" :content="data.groupName" placement="top-start">
                      <span class="whitespace-nowrap overflow-hidden text-ellipsis">
                        {{ data.groupName }}
                      </span>
                    </el-tooltip>
                  </div>
                  <div class="w-10">
                    <el-button type="primary" link @click="handleDictGroupUpdate(node, data)">
                      <el-tooltip effect="dark" content="编辑" placement="top-start">
                        <el-icon :size="12">
                          <Edit />
                        </el-icon>
                      </el-tooltip>
                    </el-button>
                    <el-button type="danger" link @click="handleDictGroupDelete(node, data)">
                      <el-tooltip effect="dark" content="删除" placement="top-start">
                        <el-icon :size="12">
                          <Delete />
                        </el-icon>
                      </el-tooltip>
                    </el-button>
                  </div>
                </div>
              </template>
            </el-tree>
          </div>
        </el-card>
      </el-col>
      <!-- 字典类型 -->
      <el-col :lg="10" :xs="24" style="">
        <el-card shadow="hover" style="height: 800px">
          <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
            <div v-show="dictTypeShowSearch" class="mb-[10px]">
              <el-card shadow="hover">
                <el-collapse v-model="dictTypeActiveNames" :expand-icon-position="'left'">
                  <el-collapse-item name="defaultSearch" :icon="CaretRight">
                    <template #title="{ isActive }">
                      <div :class="['title-wrapper', { 'is-active': isActive }]">搜索条件</div>
                    </template>
                    <el-form ref="dictTypeQueryFormRef" :model="dictTypeQueryParams" :inline="true" label-width="68px">
                      <el-form-item label="字典名称" prop="dictName">
                        <el-input v-model="dictTypeQueryParams.dictName" placeholder="请输入字典名称" clearable style="width: 120px" />
                      </el-form-item>
                      <el-form-item label="字典类型" prop="dictType">
                        <el-input v-model="dictTypeQueryParams.dictType" placeholder="请输入字典类型" clearable style="width: 120px" />
                      </el-form-item>
                      <el-form-item>
                        <el-button type="primary" icon="Search" @click="handleDictTypeQuery">搜索</el-button>
                        <el-button icon="Refresh" @click="resetDictTypeQuery">重置</el-button>
                      </el-form-item>
                    </el-form>
                  </el-collapse-item>
                </el-collapse>
              </el-card>
            </div>
          </transition>
          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button type="primary" plain icon="Plus" @click="handleDictTypeAdd">新增</el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button type="danger" plain icon="Refresh" @click="handleDictTypRefreshCache">刷新所有缓存</el-button>
            </el-col>
            <right-toolbar v-model:show-search="dictTypeShowSearch" @query-table="getDictTypeList"></right-toolbar>
          </el-row>

          <el-table
            v-loading="dictTypeLoading"
            :data="dictTypeList"
            border
            stripe
            height="550"
            @row-click="dictTypeRowClick"
            highlight-current-row
            row-key="dictType"
            :current-row-key="curDictTypeType"
          >
            <el-table-column label="字典名称" align="center" prop="dictName" :show-overflow-tooltip="true" />
            <el-table-column label="字典类型" align="center" prop="dictType" :show-overflow-tooltip="true" />
            <el-table-column label="字典分组" align="center" prop="dictGroupName" :show-overflow-tooltip="true">
              <template #default="scope">
                <el-tag type="success" v-if="scope.row.dictGroupName">
                  {{ scope.row.dictGroupName }}
                </el-tag>
                <span v-else>- -</span>
              </template>
            </el-table-column>
            <el-table-column label="排序" align="center" prop="sort" :show-overflow-tooltip="true" width="60" />
            <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width">
              <template #default="scope">
                <el-tooltip content="修改" placement="top">
                  <el-button link type="primary" icon="Edit" @click="handleDictTypeUpdate(scope.row)"></el-button>
                </el-tooltip>
                <el-tooltip content="删除" placement="top">
                  <el-button link type="primary" icon="Delete" @click="handleDictTypeDelete(scope.row)"></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>

          <pagination
            v-model:page="dictTypeQueryParams.pageNum"
            v-model:limit="dictTypeQueryParams.pageSize"
            :total="dictTypeTotal"
            @pagination="getDictTypeList"
          />
        </el-card>
      </el-col>
      <!-- 字典数据 -->
      <el-col :lg="10" :xs="24" style="">
        <el-card shadow="hover" style="height: 800px">
          <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
            <div v-show="dictDataShowSearch" class="mb-[10px]">
              <el-card shadow="hover">
                <el-collapse v-model="dictDataActiveNames" :expand-icon-position="'left'">
                  <el-collapse-item name="defaultSearch" :icon="CaretRight">
                    <template #title="{ isActive }">
                      <div :class="['title-wrapper', { 'is-active': isActive }]">搜索条件</div>
                    </template>
                    <el-form ref="dictDataQueryFormRef" :model="dictDataQueryParams" :inline="true" label-width="68px">
                      <el-form-item label="字典标签" prop="dictLabel">
                        <el-input v-model="dictDataQueryParams.dictLabel" placeholder="请输入字典标签" clearable style="width: 150px" />
                      </el-form-item>
                      <el-form-item>
                        <el-button type="primary" icon="Search" @click="handleDictDataQuery">搜索</el-button>
                        <el-button icon="Refresh" @click="resetDictDataQuery">重置</el-button>
                      </el-form-item>
                    </el-form>
                  </el-collapse-item>
                </el-collapse>
              </el-card>
            </div>
          </transition>

          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button type="primary" plain icon="Plus" @click="handleDictDataAdd">新增</el-button>
            </el-col>
            <right-toolbar v-model:showSearch="dictDataShowSearch" @query-table="getDictDataList"></right-toolbar>
          </el-row>

          <el-table v-loading="dictDataLoading" :data="dictDataList" border height="550">
            <el-table-column label="字典标签" align="center" prop="dictLabel">
              <template #default="scope">
                <span
                  v-if="
                    (scope.row.listClass === '' || scope.row.listClass === 'default') && (scope.row.cssClass === '' || scope.row.cssClass == null)
                  "
                  >{{ scope.row.dictLabel }}</span
                >
                <el-tag
                  v-else
                  :type="scope.row.listClass === 'primary' || scope.row.listClass === 'default' ? 'primary' : scope.row.listClass"
                  :class="scope.row.cssClass"
                  >{{ scope.row.dictLabel }}</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column label="字典键值" align="center" prop="dictValue" :show-overflow-tooltip="true" />
            <el-table-column label="字典类型" align="center" prop="dictTypeName" :show-overflow-tooltip="true">
              <template #default="scope">
                <el-tag type="success" v-if="scope.row.dictTypeName">
                  {{ scope.row.dictTypeName }}
                </el-tag>
                <span v-else>- -</span>
              </template>
            </el-table-column>
            <el-table-column label="字典排序" align="center" prop="dictSort" />
            <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width">
              <template #default="scope">
                <el-tooltip content="修改" placement="top">
                  <el-button link type="primary" icon="Edit" @click="handleDictDataUpdate(scope.row)"></el-button>
                </el-tooltip>
                <el-tooltip content="删除" placement="top">
                  <el-button link type="primary" icon="Delete" @click="handleDictDataDelete(scope.row)"></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>

          <pagination
            v-show="dictDataTotal > 0"
            v-model:page="dictDataQueryParams.pageNum"
            v-model:limit="dictDataQueryParams.pageSize"
            :total="dictDataTotal"
            @pagination="getDictDataList"
          />
        </el-card>
      </el-col>
    </el-row>
    <!-- 添加或修改字典分组对话框 -->
    <DictGroupDialog ref="dictGroupDialogRef" @close="handleDictGroupDialogClose"></DictGroupDialog>
    <!-- 添加或修改字典类型对话框 -->
    <DictTypeDialog ref="dictTypeDialogRef" @close="handleDictTypeDialogClose"></DictTypeDialog>
    <!-- 添加或修改字典数据对话框 -->
    <DictDataDialog ref="dictDataDialogRef" @close="handleDictDataDialogClose"></DictDataDialog>
  </div>
</template>

<script setup lang="ts">
import { useDictStore } from '@/store/modules/dict';
import { listDictGroup, getDictGroup, delDictGroup } from '@/api/infra/common/CommonDictGroup';
import { listType, getType, delType, refreshCache } from '@/api/infra/common/commonDict/type';
import { listData, getData, delData } from '@/api/infra/common/commonDict/data';
import { DictGroupVO } from '@/api/infra/common/CommonDictGroup/types';
import { DictTypeForm, DictTypeQuery, DictTypeVO } from '@/api/infra/common/commonDict/type/types';
import { DictDataForm, DictDataQuery, DictDataVO } from '@/api/infra/common/commonDict/data/types';
import DictGroupDialog from './components/dictGroupDialog.vue';
import DictTypeDialog from './components/dictTypeDialog.vue';
import DictDataDialog from './components/dictDataDialog.vue';
import { CaretRight, Delete, Plus } from '@element-plus/icons-vue';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const dictGroupDialogRef = ref<typeof DictGroupDialog>();
const dictTypeDialogRef = ref<typeof DictTypeDialog>();
const dictDataDialogRef = ref<typeof DictDataDialog>();
const dictGroupLoading = ref(false);
const dictGroupOptions = ref<DictGroupVO[]>([]);
const dictGroupTreeRef = ref<ElTreeInstance>();
const dictGroupNameSearch = ref<string>();
const curDictGroup = ref<DictGroupVO>();

const dictTypeActiveNames = ref(['defaultSearch']);
const dictTypeList = ref<DictTypeVO[]>([]);
const dictTypeLoading = ref(true);
const dictTypeShowSearch = ref(true);
const dictTypeTotal = ref(0);
const dictTypeQueryFormRef = ref<ElFormInstance>();
const dateRange = ref<[DateModelType, DateModelType]>(['', '']);
const curDictTypeType = ref<string>();
const dictTypeData = reactive<PageData<DictTypeForm, DictTypeQuery>>({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    dictGroupId: undefined,
    dictName: '',
    dictType: ''
  },
  rules: {}
});
const { queryParams: dictTypeQueryParams } = toRefs(dictTypeData);

const dictDataList = ref<DictDataVO[]>([]);
const dictDataTotal = ref(0);
const dictDataLoading = ref(true);
const dictDataShowSearch = ref(false);
const dictDataQueryFormRef = ref<ElFormInstance>();
const dictDataActiveNames = ref(['defaultSearch']);
const dictDataData = reactive<PageData<DictDataForm, DictDataQuery>>({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    dictName: '',
    dictType: '',
    dictLabel: ''
  },
  rules: {}
});
const { queryParams: dictDataQueryParams } = toRefs(dictDataData);

/** 查询字典分组列表 */
const getDictGroupList = async () => {
  console.log('getDictGroupList');
  const res = await listDictGroup();
  dictGroupOptions.value = res.data;
  // if (res.data.length > 0) {
  //   curDictGroup.value = res.data[0];
  // }
};

const searchDictGroup = () => {
  dictGroupTreeRef.value?.filter(dictGroupNameSearch.value);
};

/** 字典分组新增按钮操作 */
const handleDictGroupAdd = () => {
  const params = {
    title: '添加字典分组',
    row: undefined
  };
  dictGroupDialogRef.value?.acceptParams(params);
};

/** 字典分组修改按钮操作 */
const handleDictGroupUpdate = async (node: Node, data: DictGroupVO) => {
  console.log('handleDictGroupUpdate', node, data);
  const _id = data?.id;
  const res = await getDictGroup(_id);
  Object.assign(data, res.data);
  const params = {
    title: '修改字典分组',
    row: data
  };
  dictGroupDialogRef.value?.acceptParams(params);
};

/** 字典分组删除按钮操作 */
const handleDictGroupDelete = async (node: Node, data: DictGroupVO) => {
  console.log('handleDictGroupDelete', node, data);
  const _ids = data?.id;
  await proxy?.$modal.confirm('是否确认删除字典分组"' + data.groupName + '"？').finally(() => console.log('删除字典分组完成！'));
  await delDictGroup(_ids);
  proxy?.$modal.msgSuccess('删除成功');
  await getDictGroupList();
  await getDictTypeList();
};

/** 字典分组关闭逻辑 */
const handleDictGroupDialogClose = async () => {
  dictGroupLoading.value = true;
  await getDictGroupList();
  await getDictTypeList();
  dictGroupLoading.value = false;
};

/** 字典分组树通过条件过滤节点  */
const filterDictGroupTreeNode = (value: string, data: any) => {
  if (!value) {
    return true;
  }
  return data.groupName.indexOf(value) !== -1;
};

/** 字典分组树节点单击事件 */
const handleDictGroupTreeNodeClick = (data: DictGroupVO) => {
  // 判断当前节点是否被选中
  if (curDictGroup.value?.id === data.id) {
    // 取消选中
    dictGroupTreeRef.value.setCurrentKey(null);
    curDictGroup.value = undefined;
    dictTypeQueryParams.value.dictGroupId = undefined;
    handleDictTypeQuery();
  } else {
    curDictGroup.value = data;
    dictTypeQueryParams.value.dictGroupId = data.id;
    handleDictTypeQuery();
  }
};

/** 查询字典类型列表 */
const getDictTypeList = async () => {
  console.log('getDictTypeList');
  dictTypeLoading.value = true;
  const res = await listType(proxy?.addDateRange(dictTypeQueryParams.value, dateRange.value));
  dictTypeList.value = res.rows;
  dictTypeTotal.value = res.total;
  dictTypeLoading.value = false;
  // 默认选中第一个
  if (dictTypeList.value.length > 0) {
    curDictTypeType.value = dictTypeList.value[0].dictType;
  } else {
    // 无数据，则字典数据也不显示
    curDictTypeType.value = undefined;
  }
};

/** 字典类型新增按钮操作 */
const handleDictTypeAdd = () => {
  const params = {
    title: '添加字典类型',
    row: {
      dictGroupId: dictTypeQueryParams.value.dictGroupId
    }
  };
  dictTypeDialogRef.value?.acceptParams(params);
};

/** 字典类型修改按钮操作 */
const handleDictTypeUpdate = async (row: DictTypeVO) => {
  console.log('handleDictTypeUpdate', row);
  const _id = row?.dictId;
  const res = await getType(_id);
  Object.assign(row, res.data);
  const params = {
    title: '修改字典类型',
    row: row
  };
  dictTypeDialogRef.value?.acceptParams(params);
};

/** 字典类型删除按钮操作 */
const handleDictTypeDelete = async (row: DictTypeVO) => {
  console.log('handleDictTypeDelete', row);
  const _ids = row?.dictId;
  await proxy?.$modal.confirm('是否确认删除字典类型"' + row.dictName + '"？').finally(() => console.log('删除字典类型完成！'));
  await delType(_ids);
  proxy?.$modal.msgSuccess('删除成功');
  await getDictTypeList();
};

/** 字典类型关闭逻辑 */
const handleDictTypeDialogClose = async () => {
  dictTypeLoading.value = true;
  await getDictTypeList();
  dictTypeLoading.value = false;
};

/** 字典类型搜索按钮操作 */
const handleDictTypeQuery = async () => {
  dictTypeQueryParams.value.pageNum = 1;
  await getDictTypeList();
  await getDictDataList();
};
/** 字典类型重置按钮操作 */
const resetDictTypeQuery = () => {
  dateRange.value = ['', ''];
  dictTypeQueryFormRef.value?.resetFields();
  handleDictTypeQuery();
};

/** 字典类型刷新缓存按钮操作 */
const handleDictTypRefreshCache = async () => {
  await refreshCache();
  proxy?.$modal.msgSuccess('刷新成功');
  useDictStore().cleanDict();
};

/** 字典类型行点击操作 */
const dictTypeRowClick = async (row: any) => {
  console.log('dictTypeRowClick', row);
  curDictTypeType.value = row.dictType;
  // 设置字典数据字典标签查询条件为空
  dictDataQueryParams.value.dictLabel = undefined;
  await getDictDataList();
};

/** 查询字典数据列表 */
const getDictDataList = async () => {
  console.log('getDictDataList');
  dictDataLoading.value = true;
  if (curDictTypeType.value) {
    dictDataQueryParams.value.dictType = curDictTypeType.value;
  } else {
    // 无类型查询条件，则不显示
    dictDataList.value = [];
    dictDataTotal.value = 0;
    dictDataLoading.value = false;
    return;
  }
  const res = await listData(dictDataQueryParams.value);
  dictDataList.value = res.rows;
  dictDataTotal.value = res.total;
  dictDataLoading.value = false;
};

/** 字典数据新增按钮操作 */
const handleDictDataAdd = () => {
  const params = {
    title: '添加字典数据',
    row: {
      dictType: dictDataQueryParams.value.dictType
    }
  };
  dictDataDialogRef.value?.acceptParams(params);
};

/** 字典数据修改按钮操作 */
const handleDictDataUpdate = async (row: DictDataVO) => {
  console.log('handleDictDataUpdate', row);
  const _id = row?.dictCode;
  const res = await getData(_id);
  Object.assign(row, res.data);
  const params = {
    title: '修改字典数据',
    row: row
  };
  dictDataDialogRef.value?.acceptParams(params);
};

/** 字典数据删除按钮操作 */
const handleDictDataDelete = async (row: DictDataVO) => {
  console.log('handleDictDataDelete', row);
  const _ids = row?.dictCode;
  await proxy?.$modal.confirm('是否确认删除字典数据"' + row.dictLabel + '"？').finally(() => console.log('删除字典数据完成！'));
  await delData(_ids);
  proxy?.$modal.msgSuccess('删除成功');
  await getDictDataList();
};

/** 字典数据关闭逻辑 */
const handleDictDataDialogClose = async () => {
  dictDataLoading.value = true;
  await getDictDataList();
  dictDataLoading.value = false;
};

/** 字典数据搜索按钮操作 */
const handleDictDataQuery = () => {
  dictDataQueryParams.value.pageNum = 1;
  getDictDataList();
};

/** 字典数据搜索按钮操作 */
const resetDictDataQuery = () => {
  dictDataQueryFormRef.value?.resetFields();
  dictDataQueryParams.value.dictType = curDictTypeType.value;
  handleDictDataQuery();
};

onMounted(async () => {
  // 初始化字典分组数据
  await getDictGroupList();
  await getDictTypeList();
  await getDictDataList();
});
</script>
