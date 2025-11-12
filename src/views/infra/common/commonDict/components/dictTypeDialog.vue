<template>
  <el-dialog v-model="dialog.visible" :title="dialog.title" width="500px" append-to-body>
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="字典分组" prop="dictGroupId">
        <el-tree-select
          v-model="form.dictGroupId"
          :data="dictGroupTreeList"
          :props="{ value: 'id', label: 'groupName', children: 'children' }"
          value-key="code"
          placeholder="请选择分组"
          check-strictly
          clearable
        />
      </el-form-item>
      <el-form-item label="字典名称" prop="dictName">
        <el-input v-model="form.dictName" placeholder="请输入字典名称" />
      </el-form-item>
      <el-form-item label="字典类型" prop="dictType">
        <el-input v-model="form.dictType" placeholder="请输入字典类型" />
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number v-model="form.sort" placeholder="请输入排序" style="width: 150px"></el-input-number>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { addType, updateType } from '@/api/infra/common/commonDict/type';
import { DictTypeForm, DictTypeQuery } from '@/api/infra/common/commonDict/type/types';
import { listDictGroup } from '@/api/infra/common/CommonDictGroup';
import { DictGroupVO } from '@/api/infra/common/CommonDictGroup/types';

const emits = defineEmits(['close']);
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const formRef = ref<ElFormInstance>();
const dialog = reactive<DialogOption>({
  visible: false,
  title: '',
  row: undefined
});

const initFormData: DictTypeForm = {
  dictId: undefined,
  dictGroupId: undefined,
  dictName: '',
  dictType: '',
  sort: 100,
  remark: ''
};

const data = reactive<PageData<DictTypeForm, DictTypeQuery>>({
  form: { ...initFormData },
  rules: {
    dictName: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
    dictType: [{ required: true, message: '类型不能为空', trigger: 'blur' }]
  }
});

const { form, rules } = toRefs(data);

const dictGroupTreeList = ref<DictGroupVO[]>([]);

/** 打开弹窗，接收参数 */
const acceptParams = async (params: DialogOption) => {
  console.log('params', params);
  reset();
  await getDictGroupTreeList();
  dialog.visible = true;
  dialog.title = params.title;
  if (params.row?.dictId) {
    // 修改
    form.value = params.row;
  } else {
    // 新增
    form.value = { ...initFormData };
    if (params.row?.dictGroupId) {
      form.value.dictGroupId = params.row.dictGroupId;
    }
  }
};

/** 查询字典分组树列表 */
const getDictGroupTreeList = async () => {
  const res = await listDictGroup();
  dictGroupTreeList.value = res.data;
};

/** 提交按钮 */
const submitForm = () => {
  formRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      form.value.dictId ? await updateType(form.value) : await addType(form.value);
      proxy?.$modal.msgSuccess('操作成功');
      dialog.visible = false;
      emits('close');
    }
  });
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
  formRef.value?.resetFields();
};

defineExpose({ acceptParams });
</script>
