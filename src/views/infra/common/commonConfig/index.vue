<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="search">
        <el-collapse v-model="activeNames" :expand-icon-position="'left'">
          <el-collapse-item name="defaultSearch" :icon="CaretRight">
            <template #title="{ isActive }">
              <div :class="['title-wrapper', { 'is-active': isActive }]">搜索条件</div>
            </template>
            <el-form ref="queryFormRef" :model="queryParams" :inline="true" label-width="68px">
              <el-form-item label="名称" prop="name">
                <el-input v-model="queryParams.name" placeholder="请输入名称" clearable style="width: 240px" @keyup.enter="handleQuery" />
              </el-form-item>
              <el-form-item label="编码" prop="code">
                <el-input v-model="queryParams.code" placeholder="请输入编码" clearable style="width: 240px" @keyup.enter="handleQuery" />
              </el-form-item>
              <el-form-item label="类型" prop="type">
                <el-select v-model="queryParams.type" placeholder="请选择类型" clearable>
                  <el-option v-for="dict in common_config_type" :key="dict.value" :label="dict.label" :value="dict.value" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
                <el-button icon="Refresh" @click="resetQuery">重置</el-button>
              </el-form-item>
            </el-form>
          </el-collapse-item>
        </el-collapse>
      </div>
    </transition>

    <el-card shadow="never">
      <template #header>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button v-hasPermi="['adminCommon:config:add']" type="primary" plain icon="Plus" @click="handleAdd">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button v-hasPermi="['adminCommon:config:edit']" type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()"
              >修改</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button v-hasPermi="['adminCommon:config:remove']" type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button v-hasPermi="['adminCommon:config:export']" type="warning" plain icon="Download" @click="handleExport">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @query-table="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="commonConfigList" @selection-change="handleSelectionChange" height="550" border>
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column v-if="true" label="id" align="center" prop="id" />
        <el-table-column label="名称" align="center" prop="name" />
        <el-table-column label="编码" align="center" prop="code" />
        <el-table-column label="类型" align="center" prop="type">
          <template #default="scope">
            <dict-tag :options="common_config_type" :value="scope.row.type" />
          </template>
        </el-table-column>
        <el-table-column label="更新时间" align="center" prop="updateTime" width="180">
          <template #default="scope">
            <span>{{ proxy.parseTime(scope.row.updateTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button v-hasPermi="['adminCommon:config:edit']" link type="primary" icon="Edit" @click="handleUpdate(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button v-hasPermi="['adminCommon:config:remove']" link type="primary" icon="Delete" @click="handleDelete(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" :total="total" @pagination="getList" />
    </el-card>
    <!-- 添加或修改通用配置对话框 -->
    <el-dialog v-model="dialog.visible" :title="dialog.title" width="1000px" center draggable append-to-body>
      <el-form ref="commonConfigFormRef" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="编码" prop="code">
              <el-input v-model="form.code" placeholder="请输入编码" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="类型" prop="type">
              <el-select v-model="form.type" placeholder="请选择类型">
                <el-option v-for="dict in common_config_type" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="详情" prop="detail">
              <div v-if="form.type === 'text'">
                <el-input v-model="form.detail" type="textarea" placeholder="请输入文本内容" style="width: 800px" :rows="10" />
              </div>
              <div v-if="form.type === 'rich_text'">
                <editor v-model="form.detail" :min-height="192" />
              </div>
              <div v-if="form.type === 'json'">
                <json-editor v-model:text="form.detail" style="width: 800px" height="400" mode="text" />
              </div>
              <div v-if="form.type === 'image'">
                <ImageUploadPublic v-model="form.detail" />
              </div>
              <div v-if="form.type === 'file'">
                <fileUpload v-model="form.detail" />
              </div>
            </el-form-item>
          </el-col>
        </el-row>
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

<script setup name="CommonConfig" lang="ts">
import { listCommonConfig, getCommonConfig, delCommonConfig, addCommonConfig, updateCommonConfig } from '@/api/infra/common/commonConfig';
import { CommonConfigVO, CommonConfigQuery, CommonConfigForm } from '@/api/infra/common/commonConfig/types';
import JsonEditor from 'vue3-ts-jsoneditor';
import { CaretRight } from '@element-plus/icons-vue';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { common_config_type } = toRefs<any>(proxy?.useDict('common_config_type'));

const commonConfigList = ref<CommonConfigVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const commonConfigFormRef = ref<ElFormInstance>();
const activeNames = ref(['defaultSearch']);

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: CommonConfigForm = {
  id: undefined,
  name: undefined,
  code: undefined,
  type: 'text',
  detail: undefined
};
const data = reactive<PageData<CommonConfigForm, CommonConfigQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    name: undefined,
    code: undefined,
    type: undefined,
    detail: undefined
  },
  rules: {
    id: [{ required: true, message: 'id不能为空', trigger: 'blur' }],
    name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
    type: [{ required: true, message: '类型不能为空', trigger: 'change' }],
    detail: [{ required: true, message: '详情不能为空', trigger: 'blur' }]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询通用配置列表 */
const getList = async () => {
  loading.value = true;
  const res = await listCommonConfig(queryParams.value);
  commonConfigList.value = res.rows;
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
  commonConfigFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: CommonConfigVO[]) => {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  dialog.visible = true;
  dialog.title = '添加通用配置';
  nextTick(() => {
    reset();
  });
};

/** 修改按钮操作 */
const handleUpdate = (row?: CommonConfigVO) => {
  loading.value = true;
  dialog.visible = true;
  dialog.title = '修改通用配置';
  nextTick(async () => {
    reset();
    const _id = row?.id || ids.value[0];
    const res = await getCommonConfig(_id);
    loading.value = false;
    Object.assign(form.value, res.data);
  });
};

/** 提交按钮 */
const submitForm = () => {
  commonConfigFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateCommonConfig(form.value).finally(() => (buttonLoading.value = false));
      } else {
        await addCommonConfig(form.value).finally(() => (buttonLoading.value = false));
      }
      proxy?.$modal.msgSuccess('操作成功');
      dialog.visible = false;
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: CommonConfigVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除通用配置编号为"' + _ids + '"的数据项？').finally(() => (loading.value = false));
  await delCommonConfig(_ids);
  proxy?.$modal.msgSuccess('删除成功');
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    'infra/admin/common/config/export',
    {
      ...queryParams.value
    },
    `通用配置_${new Date().getTime()}.xlsx`
  );
};

onMounted(() => {
  getList();
});
</script>
