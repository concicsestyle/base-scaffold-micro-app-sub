<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-collapse v-model="activeNames" :expand-icon-position="'left'">
            <el-collapse-item name="defaultSearch" :icon="CaretRight">
              <template #title="{ isActive }">
                <div :class="['title-wrapper', { 'is-active': isActive }]">搜索条件</div>
              </template>
              <el-form ref="queryFormRef" :model="queryParams" :inline="true">
                <el-form-item label="分类类型" prop="type">
                  <el-select v-model="queryParams.type" placeholder="请选择分类类型" clearable>
                    <el-option v-for="dict in common_content_category_type" :key="dict.value" :label="dict.label" :value="dict.value" />
                  </el-select>
                </el-form-item>
                <el-form-item label="父分类" label-width="100px" prop="parentCode">
                  <el-tree-select
                    v-model="queryParams.parentCode"
                    :data="commonContentCategoryTreeList"
                    :props="{ value: 'code', label: 'name', children: 'children' }"
                    value-key="code"
                    placeholder="请选择父分类"
                    check-strictly
                    clearable
                  />
                </el-form-item>
                <el-form-item label="分类名称" prop="name">
                  <el-input v-model="queryParams.name" placeholder="请输入分类名称" clearable @keyup.enter="handleQuery" />
                </el-form-item>
                <el-form-item label="分类编码" prop="code">
                  <el-input v-model="queryParams.code" placeholder="请输入分类编码" clearable @keyup.enter="handleQuery" />
                </el-form-item>
                <el-form-item label="显示类型" prop="showType">
                  <el-select v-model="queryParams.showType" placeholder="请选择显示类型" clearable>
                    <el-option v-for="dict in show_type" :key="dict.value" :label="dict.label" :value="dict.value" />
                  </el-select>
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
            </el-collapse-item>
          </el-collapse>
        </el-card>
      </div>
    </transition>

    <el-card shadow="never">
      <template #header>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button v-hasPermi="['adminCommon:contentCategory:add']" type="primary" plain icon="Plus" @click="handleAdd">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button v-hasPermi="['adminCommon:contentCategory:edit']" type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()"
              >修改</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              v-hasPermi="['adminCommon:contentCategory:remove']"
              type="danger"
              plain
              icon="Delete"
              :disabled="multiple"
              @click="handleDelete()"
              >删除</el-button
            >
          </el-col>
          <!--          <el-col :span="1.5">-->
          <!--            <el-button v-hasPermi="['adminCommon:contentCategory:export']" type="warning" plain icon="Download" @click="handleExport"-->
          <!--              >导出</el-button-->
          <!--            >-->
          <!--          </el-col>-->
          <right-toolbar v-model:showSearch="showSearch" @query-table="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="commonContentCategoryList" @selection-change="handleSelectionChange" border height="550">
        <el-table-column type="selection" width="55" align="center" />
        <!--        <el-table-column v-if="true" label="id" align="center" prop="id" />-->
        <el-table-column label="类型" align="center" prop="type">
          <template #default="scope">
            <dict-tag :options="common_content_category_type" :value="scope.row.type" />
          </template>
        </el-table-column>
        <el-table-column label="分类名称" align="center" prop="name">
          <template #default="scope">
            <el-tag v-if="scope.row.name">{{ scope.row.name }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="父名称" align="center" prop="parentName">
          <template #default="scope">
            <el-tag v-if="scope.row.parentName" type="warning">{{ scope.row.parentName }}</el-tag>
          </template>
        </el-table-column>
        <!--        <el-table-column label="分类名称" align="center" prop="name" />-->
        <el-table-column label="分类编码" align="center" prop="code" width="300">
          <template #default="scope">
            <el-tag v-if="scope.row.code" type="danger">{{ scope.row.code }}</el-tag>
          </template>
        </el-table-column>
        <!--        <el-table-column label="图标图片" align="center" prop="icon" width="100">-->
        <!--          <template #default="scope">-->
        <!--            <image-preview :src="scope.row.icon" :width="50" :height="50" />-->
        <!--          </template>-->
        <!--        </el-table-column>-->
        <el-table-column label="显示类型" align="center" prop="showType">
          <template #default="scope">
            <dict-tag :options="show_type" :value="scope.row.showType" />
          </template>
        </el-table-column>
        <el-table-column label="排序值" align="center" prop="sort" />
        <el-table-column label="状态" align="center" prop="status">
          <template #default="scope">
            <dict-tag :options="common_status" :value="scope.row.status" />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button
                v-hasPermi="['adminCommon:contentCategory:edit']"
                link
                type="primary"
                icon="Edit"
                @click="handleUpdate(scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button
                v-hasPermi="['adminCommon:contentCategory:remove']"
                link
                type="primary"
                icon="Delete"
                @click="handleDelete(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" :total="total" @pagination="getList" />
    </el-card>
    <!-- 添加或修改通用内容分类对话框 -->
    <el-dialog v-model="dialog.visible" center :title="dialog.title" width="1000px" append-to-body draggable>
      <el-form ref="commonContentCategoryFormRef" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="类型" prop="type">
              <el-select v-model="form.type" placeholder="请选择类型">
                <el-option v-for="dict in common_content_category_type" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="父分类" prop="parentCode">
              <el-tree-select
                v-model="form.parentCode"
                :data="commonContentCategoryTreeList"
                :props="{ value: 'code', label: 'name', children: 'children' }"
                value-key="code"
                placeholder="请选择分类"
                check-strictly
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="分类名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入分类名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分类编码" prop="code">
              <el-input v-model="form.code" :disabled="form?.id" placeholder="请输入分类编码，不填则自动生成" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="显示类型" prop="showType">
              <el-select v-model="form.showType" placeholder="请选择显示类型">
                <el-option v-for="dict in show_type" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序类型" prop="sortType">
              <el-select v-model="form.sortType" placeholder="请选择排序类型">
                <el-option v-for="dict in sort_type" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="排序值" prop="sort">
              <el-input-number v-model="form.sort" placeholder="请输入排序值" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio v-for="dict in common_status" :key="dict.value" :value="dict.value">{{ dict.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="图标图片" prop="icon">
          <image-upload-public v-model="form.icon" />
        </el-form-item>
        <el-form-item label="介绍描述">
          <editor v-model="form.introDesc" :min-height="192" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="CommonContentCategory" lang="ts">
import {
  treeListCommonContentCategory,
  listCommonContentCategory,
  getCommonContentCategory,
  delCommonContentCategory,
  addCommonContentCategory,
  updateCommonContentCategory
} from '@/api/infra/common/commonContentCategory';
import { CommonContentCategoryVO, CommonContentCategoryQuery, CommonContentCategoryForm } from '@/api/infra/common/commonContentCategory/types';
import { CaretRight } from '@element-plus/icons-vue';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { sort_type, show_type, common_content_category_type, common_status } = toRefs<any>(
  proxy?.useDict('sort_type', 'show_type', 'common_content_category_type', 'common_status')
);

const commonContentCategoryTreeList = ref<CommonContentCategoryVO[]>([]);
const commonContentCategoryList = ref<CommonContentCategoryVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const commonContentCategoryFormRef = ref<ElFormInstance>();
const activeNames = ref(['defaultSearch']);

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: CommonContentCategoryForm = {
  id: undefined,
  type: undefined,
  parentCode: undefined,
  name: undefined,
  code: undefined,
  icon: undefined,
  introDesc: undefined,
  showType: 'show',
  sortType: 'default',
  sort: 100,
  status: '1'
};
const data = reactive<PageData<CommonContentCategoryForm, CommonContentCategoryQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    type: undefined,
    parentCode: undefined,
    name: undefined,
    code: undefined,
    icon: undefined,
    introDesc: undefined,
    showType: undefined,
    sortType: undefined,
    sort: undefined,
    status: undefined
  },
  rules: {
    id: [{ required: true, message: 'id不能为空', trigger: 'blur' }],
    type: [{ required: true, message: '类型不能为空', trigger: 'change' }],
    name: [{ required: true, message: '分类名称不能为空', trigger: 'blur' }]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询通用内容分类树列表 */
const getCommonContentCategoryTreeList = async () => {
  const res = await treeListCommonContentCategory();
  commonContentCategoryTreeList.value = res.data;
};

/** 查询通用内容分类列表 */
const getList = async () => {
  loading.value = true;
  const res = await listCommonContentCategory(queryParams.value);
  commonContentCategoryList.value = res.rows;
  total.value = res.total;
  loading.value = false;
};

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
};

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  commonContentCategoryFormRef.value?.resetFields();
};

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
};

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
};

/** 多选框选中数据 */
const handleSelectionChange = (selection: CommonContentCategoryVO[]) => {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = '添加通用内容分类';
};

/** 修改按钮操作 */
const handleUpdate = async (row?: CommonContentCategoryVO) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getCommonContentCategory(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = '修改通用内容分类';
};

/** 提交按钮 */
const submitForm = () => {
  commonContentCategoryFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateCommonContentCategory(form.value).finally(() => (buttonLoading.value = false));
      } else {
        await addCommonContentCategory(form.value).finally(() => (buttonLoading.value = false));
      }
      proxy?.$modal.msgSuccess('操作成功');
      dialog.visible = false;
      await getList();
      await getCommonContentCategoryTreeList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: CommonContentCategoryVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除通用内容分类编号为"' + _ids + '"的数据项？').finally(() => (loading.value = false));
  await delCommonContentCategory(_ids);
  proxy?.$modal.msgSuccess('删除成功');
  await getList();
  await getCommonContentCategoryTreeList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    'infra/admin/common/contentCategory/export',
    {
      ...queryParams.value
    },
    `commonContentCategory_${new Date().getTime()}.xlsx`
  );
};

onMounted(() => {
  getList();
  getCommonContentCategoryTreeList();
});
</script>
