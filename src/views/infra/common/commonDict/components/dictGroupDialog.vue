<template>
  <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
    <el-form ref="dictGroupFormRef" :model="form" :rules="rules" label-width="80px">
      <!--      <el-form-item label="父id" prop="parentId">-->
      <!--        <el-input v-model="form.parentId" placeholder="请输入父id" />-->
      <!--      </el-form-item>-->
      <el-form-item label="分组名称" prop="groupName">
        <el-input v-model="form.groupName" placeholder="请输入分组名称" />
      </el-form-item>
      <el-form-item label="介绍描述" prop="introDesc">
        <el-input v-model="form.introDesc" placeholder="请输入介绍描述" type="textarea" :rows="2" />
      </el-form-item>
      <el-form-item label="排序值" prop="sort">
        <el-input-number v-model="form.sort" placeholder="请输入排序值" :min="0" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio v-for="dict in common_status" :key="dict.value" :value="dict.value">{{ dict.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
type DialogOptions = {
  title: string;
  row: any;
};
import { addDictGroup, updateDictGroup } from '@/api/infra/common/CommonDictGroup';
import { DictGroupQuery, DictGroupForm } from '@/api/infra/common/CommonDictGroup/types';
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { common_status } = toRefs<any>(proxy?.useDict('common_status'));

const buttonLoading = ref(false);
const dictGroupFormRef = ref<ElFormInstance>();
const emits = defineEmits(['close']);
const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});
const initFormData: DictGroupForm = {
  id: undefined,
  parentId: undefined,
  groupName: undefined,
  introDesc: undefined,
  sort: 100,
  status: '1'
};
const data = reactive<PageData<DictGroupForm, DictGroupQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    parentId: undefined,
    groupName: undefined,
    introDesc: undefined,
    sort: 100,
    status: '1',
    params: {}
  },
  rules: {
    id: [{ required: true, message: 'id不能为空', trigger: 'blur' }],
    groupName: [{ required: true, message: '分组名称不能为空', trigger: 'blur' }]
  }
});
const { form, rules } = toRefs(data);

/** 打开弹窗，接收参数 */
const acceptParams = (params: DialogOptions) => {
  reset();
  dialog.visible = true;
  dialog.title = params.title;
  if (params.row) {
    form.value = params.row;
  }
};

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
};

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  dictGroupFormRef.value?.resetFields();
};

/** 提交按钮 */
const submitForm = () => {
  dictGroupFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateDictGroup(form.value).finally(() => (buttonLoading.value = false));
      } else {
        await addDictGroup(form.value).finally(() => (buttonLoading.value = false));
      }
      proxy?.$modal.msgSuccess('操作成功');
      dialog.visible = false;
      emits('close');
    }
  });
};

defineExpose({ acceptParams });
</script>
