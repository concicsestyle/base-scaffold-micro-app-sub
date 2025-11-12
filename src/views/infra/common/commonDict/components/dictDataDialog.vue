<template>
  <el-dialog v-model="dialog.visible" :title="dialog.title" width="500px" append-to-body>
    <el-form ref="dataFormRef" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="字典类型">
        <el-select v-model="form.dictType" style="width: 200px" :disabled="true">
          <el-option v-for="item in typeOptions" :key="item.dictId" :label="item.dictName" :value="item.dictType" />
        </el-select>
      </el-form-item>
      <el-form-item label="数据标签" prop="dictLabel">
        <el-input v-model="form.dictLabel" placeholder="请输入数据标签" />
      </el-form-item>
      <el-form-item label="数据键值" prop="dictValue">
        <el-input v-model="form.dictValue" placeholder="请输入数据键值" />
      </el-form-item>
      <el-form-item label="样式属性" prop="cssClass">
        <el-input v-model="form.cssClass" placeholder="请输入样式属性" />
      </el-form-item>
      <el-form-item label="显示排序" prop="dictSort">
        <el-input-number v-model="form.dictSort" controls-position="right" :min="0" />
      </el-form-item>
      <el-form-item label="回显样式" prop="listClass">
        <el-select v-model="form.listClass">
          <el-option v-for="item in listClassOptions" :key="item.value" :label="item.label + '(' + item.value + ')'" :value="item.value"></el-option>
        </el-select>
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
import { useDictStore } from '@/store/modules/dict';
import { optionselect as getDictOptionselect } from '@/api/infra/common/commonDict/type';
import { addData, updateData } from '@/api/infra/common/commonDict/data';
import { DictTypeVO } from '@/api/infra/common/commonDict/type/types';
import { DictDataForm, DictDataQuery } from '@/api/infra/common/commonDict/data/types';

const emits = defineEmits(['close']);
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const typeOptions = ref<DictTypeVO[]>([]);
const dataFormRef = ref<ElFormInstance>();
const dialog = reactive<DialogOption>({
  visible: false,
  title: '',
  row: undefined
});

// 数据标签回显样式
const listClassOptions = ref<Array<{ value: string; label: string }>>([
  { value: 'default', label: '默认' },
  { value: 'primary', label: '主要' },
  { value: 'success', label: '成功' },
  { value: 'info', label: '信息' },
  { value: 'warning', label: '警告' },
  { value: 'danger', label: '危险' }
]);

const initFormData: DictDataForm = {
  dictCode: undefined,
  dictLabel: '',
  dictValue: '',
  cssClass: '',
  listClass: 'primary',
  dictSort: 0,
  remark: ''
};
const data = reactive<PageData<DictDataForm, DictDataQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    dictName: '',
    dictType: '',
    dictLabel: ''
  },
  rules: {
    dictLabel: [{ required: true, message: '数据标签不能为空', trigger: 'blur' }],
    dictValue: [{ required: true, message: '数据键值不能为空', trigger: 'blur' }],
    dictSort: [{ required: true, message: '数据顺序不能为空', trigger: 'blur' }]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 打开弹窗，接收参数 */
const acceptParams = async (params: DialogOption) => {
  console.log('params', params);
  reset();
  await getDictTypeList();
  dialog.visible = true;
  dialog.title = params.title;
  if (params.row?.dictCode) {
    // 修改
    form.value = params.row;
  } else {
    // 新增
    form.value = { ...initFormData };
    if (params.row?.dictType) {
      form.value.dictType = params.row.dictType;
    }
  }
};

/** 查询字典类型列表 */
const getDictTypeList = async () => {
  const res = await getDictOptionselect();
  typeOptions.value = res.data;
};

/** 取消按钮 */
const cancel = () => {
  dialog.visible = false;
  reset();
  emits('close');
};

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  dataFormRef.value?.resetFields();
};

/** 提交按钮 */
const submitForm = () => {
  dataFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      form.value.dictCode ? await updateData(form.value) : await addData(form.value);
      useDictStore().removeDict(queryParams.value.dictType);
      proxy?.$modal.msgSuccess('操作成功');
      dialog.visible = false;
      emits('close');
    }
  });
};

defineExpose({ acceptParams });
</script>
