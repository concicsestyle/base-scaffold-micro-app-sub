<template>
  <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body draggable overflow>
    <el-form ref="bizCodeFormRef" :model="form" :rules="rules" label-width="60px">
      <el-form-item label="分组" prop="groupId">
        <el-tree-select
          v-model="form.groupId"
          :data="bizCodeGroupList"
          :props="{ value: 'id', label: 'groupName', children: 'children' }"
          value-key="code"
          placeholder="请选择分组"
          check-strictly
          clearable
        />
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item label="编码" prop="code">
        <el-input v-model="form.code" placeholder="请输入编码" />
      </el-form-item>
      <el-form-item label="连接符" prop="joinChar">
        <el-input v-model="form.joinChar" placeholder="请输入连接符" />
      </el-form-item>
      <el-form-item label="介绍描述" prop="introDesc">
        <el-input v-model="form.introDesc" placeholder="请输入介绍描述" type="textarea" :rows="2" />
      </el-form-item>
      <el-form-item label="排序值" prop="sort">
        <el-input-number v-model="form.sort" placeholder="请输入排序值" />
      </el-form-item>
      <!--      <el-form-item label="状态" prop="status">-->
      <!--        <el-radio-group v-model="form.status">-->
      <!--          <el-radio v-for="dict in common_status" :key="dict.value" :value="dict.value">{{ dict.label }}</el-radio>-->
      <!--        </el-radio-group>-->
      <!--      </el-form-item>-->
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup name="BizCodeDialog" lang="ts">
import { addBizCode, updateBizCode } from '@/api/infra/common/commonBizCode';
import { BizCodeQuery, BizCodeForm } from '@/api/infra/common/commonBizCode/types';
import { listBizCodeGroup } from '@/api/infra/common/CommonBizCodeGroup';
import { BizCodeGroupVO } from '@/api/infra/common/CommonBizCodeGroup/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { common_status } = toRefs<any>(proxy?.useDict('common_status'));

const emits = defineEmits(['close']);
const buttonLoading = ref(false);
const bizCodeFormRef = ref<ElFormInstance>();
const dialog = reactive<DialogOption>({
  visible: false,
  title: '',
  row: undefined
});
const initFormData: BizCodeForm = {
  id: undefined,
  groupId: undefined,
  name: undefined,
  code: undefined,
  joinChar: undefined,
  introDesc: undefined,
  sort: 100,
  status: '2'
};
const data = reactive<PageData<BizCodeForm, BizCodeQuery>>({
  form: { ...initFormData },
  rules: {
    id: [{ required: true, message: 'id不能为空', trigger: 'blur' }],
    name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
    code: [{ required: true, message: '编码不能为空', trigger: 'blur' }]
  }
});
const { form, rules } = toRefs(data);

const bizCodeGroupList = ref<BizCodeGroupVO[]>([]);

/** 打开弹窗，接收参数 */
const acceptParams = async (params: DialogOption) => {
  reset();
  await getBizCodeGroupList();
  dialog.visible = true;
  dialog.title = params.title;
  if (params.row?.id) {
    // 修改
    form.value = params.row;
  } else {
    // 新增
    form.value = { ...initFormData };
    if (params.row?.groupId) {
      form.value.groupId = params.row.groupId;
    }
  }
};

/** 查询字典分组树列表 */
const getBizCodeGroupList = async () => {
  const res = await listBizCodeGroup();
  bizCodeGroupList.value = res.data;
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
  bizCodeFormRef.value?.resetFields();
};

/** 提交按钮 */
const submitForm = () => {
  bizCodeFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateBizCode(form.value).finally(() => (buttonLoading.value = false));
      } else {
        await addBizCode(form.value).finally(() => (buttonLoading.value = false));
      }
      proxy?.$modal.msgSuccess('操作成功');
      dialog.visible = false;
      emits('close');
    }
  });
};

defineExpose({ acceptParams });
</script>
