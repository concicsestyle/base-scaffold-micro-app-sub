<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="父id" prop="parentId">
              <el-input v-model="queryParams.parentId" placeholder="请输入父id" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="分组名称" prop="groupName">
              <el-input v-model="queryParams.groupName" placeholder="请输入分组名称" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="介绍描述" prop="introDesc">
              <el-input v-model="queryParams.introDesc" placeholder="请输入介绍描述" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="排序值" prop="sort">
              <el-input v-model="queryParams.sort" placeholder="请输入排序值" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
                <el-option v-for="dict in common_status" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
              <el-button icon="Refresh" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </transition>

    <el-card shadow="never">
      <template #header>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['adminCommon:dictGroup:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['adminCommon:dictGroup:edit']"
              >修改</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['adminCommon:dictGroup:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['adminCommon:dictGroup:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getPageList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="dictGroupPageList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="id" align="center" prop="id" v-if="true" />
        <el-table-column label="父id" align="center" prop="parentId" />
        <el-table-column label="分组名称" align="center" prop="groupName" />
        <el-table-column label="介绍描述" align="center" prop="introDesc" />
        <el-table-column label="排序值" align="center" prop="sort" />
        <el-table-column label="状态" align="center" prop="status">
          <template #default="scope">
            <dict-tag :options="common_status" :value="scope.row.status" />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['adminCommon:dictGroup:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['adminCommon:dictGroup:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total > 0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getPageList"
      />
    </el-card>
    <!-- 添加或修改字典分组对话框 -->
    <DictGroupDialog ref="dictGroupDialogRef" @close="handleDialogClose"></DictGroupDialog>
  </div>
</template>

<script setup name="DictGroup" lang="ts">
import { pageListDictGroup, listDictGroup, getDictGroup, delDictGroup, addDictGroup, updateDictGroup } from '@/api/infra/common/CommonDictGroup';
import { DictGroupVO, DictGroupQuery, DictGroupForm } from '@/api/infra/common/CommonDictGroup/types';
import DictGroupDialog from './components/dialog.vue';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { common_status } = toRefs<any>(proxy?.useDict('common_status'));

const dictGroupPageList = ref<DictGroupVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const dictGroupFormRef = ref<ElFormInstance>();
const dictGroupDialogRef = ref<typeof DictGroupDialog>();

const initFormData: DictGroupForm = {
  id: undefined,
  parentId: undefined,
  groupName: undefined,
  introDesc: undefined,
  sort: undefined,
  status: undefined
};
const data = reactive<PageData<DictGroupForm, DictGroupQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    parentId: undefined,
    groupName: undefined,
    introDesc: undefined,
    sort: undefined,
    status: undefined,
    params: {}
  },
  rules: {
    id: [{ required: true, message: 'id不能为空', trigger: 'blur' }],
    groupName: [{ required: true, message: '分组名称不能为空', trigger: 'blur' }]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询字典分组分页列表 */
const getPageList = async () => {
  loading.value = true;
  const res = await pageListDictGroup(queryParams.value);
  dictGroupPageList.value = res.rows;
  total.value = res.total;
  loading.value = false;
};

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  dictGroupFormRef.value?.resetFields();
};

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getPageList();
};

const handleDialogClose = () => {
  getPageList();
};

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
};

/** 多选框选中数据 */
const handleSelectionChange = (selection: DictGroupVO[]) => {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  const params = {
    title: '添加字典分组',
    row: form.value
  };
  dictGroupDialogRef.value?.acceptParams(params);
};

/** 修改按钮操作 */
const handleUpdate = async (row?: DictGroupVO) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getDictGroup(_id);
  Object.assign(form.value, res.data);
  const params = {
    title: '修改字典分组',
    row: form.value
  };
  dictGroupDialogRef.value?.acceptParams(params);
};

/** 删除按钮操作 */
const handleDelete = async (row?: DictGroupVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除字典分组编号为"' + _ids + '"的数据项？').finally(() => (loading.value = false));
  await delDictGroup(_ids);
  proxy?.$modal.msgSuccess('删除成功');
  await getPageList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    'common/dictGroup/export',
    {
      ...queryParams.value
    },
    `dictGroup_${new Date().getTime()}.xlsx`
  );
};

onMounted(() => {
  getPageList();
});
</script>
