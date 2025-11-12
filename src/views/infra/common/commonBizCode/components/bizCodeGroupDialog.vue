<template>
  <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body draggable overflow>
    <el-form ref="bizCodeGroupFormRef" :model="form" :rules="rules" label-width="80px">
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
        <el-input-number v-model="form.sort" placeholder="请输入排序值" style="width: 200px" />
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
import { addBizCodeGroup, updateBizCodeGroup } from '@/api/infra/common/CommonBizCodeGroup';
import { BizCodeGroupQuery, BizCodeGroupForm } from '@/api/infra/common/CommonBizCodeGroup/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { common_status } = toRefs<any>(proxy?.useDict('common_status'));

const emits = defineEmits(['close']);
const buttonLoading = ref(false);
const bizCodeGroupFormRef = ref<ElFormInstance>();
const dialog = reactive<DialogOption>({
  visible: false,
  title: '',
  row: undefined
});
const initFormData: BizCodeGroupForm = {
  id: undefined,
  parentId: undefined,
  groupName: undefined,
  introDesc: undefined,
  sort: 100,
  status: '1'
};
const data = reactive<PageData<BizCodeGroupForm, BizCodeGroupQuery>>({
  form: { ...initFormData },
  rules: {
    id: [{ required: true, message: 'id不能为空', trigger: 'blur' }],
    groupName: [{ required: true, message: '分组名称不能为空', trigger: 'blur' }]
  }
});
const { form, rules } = toRefs(data);

/** 打开弹窗，接收参数 */
const acceptParams = (params: DialogOption) => {
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
  emits('close');
};

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  bizCodeGroupFormRef.value?.resetFields();
};

/** 提交按钮 */
const submitForm = () => {
  bizCodeGroupFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateBizCodeGroup(form.value).finally(() => (buttonLoading.value = false));
      } else {
        await addBizCodeGroup(form.value).finally(() => (buttonLoading.value = false));
      }
      proxy?.$modal.msgSuccess('操作成功');
      dialog.visible = false;
      emits('close');
    }
  });
};

defineExpose({ acceptParams });
</script>
