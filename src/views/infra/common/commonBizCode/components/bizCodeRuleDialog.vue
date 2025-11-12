<template>
  <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body draggable overflow align-center>
    <el-form ref="bizCodeRuleFormRef" :model="form" :rules="rules" label-width="90px">
      <el-form-item label="业务编码" prop="bizCodeId">
        <el-select v-model="form.bizCodeId" placeholder="请选择业务编码" :disabled="true">
          <el-option v-for="item in bizCodeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="序号" prop="indexNum">
        <el-input-number v-model="form.indexNum" placeholder="请输入序列号，规则执行顺序，数值越小优先级越高" :min="1" style="width: 150px" />
      </el-form-item>
      <el-form-item label="规则类型" prop="ruleType">
        <el-select v-model="form.ruleType" placeholder="请选择规则类型">
          <el-option v-for="dict in common_biz_code_rule_type" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="form.ruleType === 'constant'" label="常量值" prop="constantValue">
        <el-input v-model="form.constantValue" placeholder="请输入常量值" />
      </el-form-item>
      <el-form-item v-if="form.ruleType === 'date_time'" label="日期时间" prop="dateFormatTemplate">
        <el-select v-model="form.dateFormatTemplate" placeholder="请选择日期时间格式">
          <el-option v-for="dict in date_time_format" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="form.ruleType === 'serial_num'" label="编号长度" prop="serialNumLength">
        <el-input-number v-model="form.serialNumLength" placeholder="请输入编号长度" :min="3" style="width: 200px" />
      </el-form-item>
      <el-form-item v-if="form.ruleType === 'serial_num'" label="编号起始值" prop="serialNumStartValue">
        <el-input-number v-model="form.serialNumStartValue" placeholder="请输入编号起始值" :min="0" style="width: 200px" />
      </el-form-item>
      <el-form-item v-if="form.ruleType === 'serial_num'" label="编号步长" prop="serialNumStepLength">
        <el-input-number v-model="form.serialNumStepLength" placeholder="请输入编号步长" :min="1" style="width: 200px" />
      </el-form-item>
      <el-form-item v-if="form.ruleType === 'random_char'" label="字符长度" prop="randomCharLength">
        <el-input-number v-model="form.randomCharLength" placeholder="请输入字符长度" :min="8" style="width: 200px" />
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
<script setup name="BizCodeRuleDialog" lang="ts">
import { addBizCodeRule, updateBizCodeRule } from '@/api/infra/common/CommonBizCodeRule';
import { BizCodeRuleQuery, BizCodeRuleForm } from '@/api/infra/common/CommonBizCodeRule/types';
import { listBizCode } from '@/api/infra/common/commonBizCode';
import { BizCodeVO } from '@/api/infra/common/commonBizCode/types';
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { common_biz_code_rule_type, common_status, date_time_format } = toRefs<any>(
  proxy?.useDict('common_biz_code_rule_type', 'common_status', 'date_time_format')
);

const buttonLoading = ref(false);
const bizCodeRuleFormRef = ref<ElFormInstance>();
const emits = defineEmits(['close']);
const dialog = reactive<DialogOption>({
  visible: false,
  title: '',
  row: undefined
});
const initFormData: BizCodeRuleForm = {
  id: undefined,
  bizCodeId: undefined,
  ruleType: undefined,
  constantValue: undefined,
  dateFormatTemplate: 'yyyyMMdd',
  serialNumLength: 6,
  serialNumStartValue: 1,
  serialNumStepLength: 1,
  randomCharLength: undefined,
  indexNum: 1,
  status: '1'
};
const data = reactive<PageData<BizCodeRuleForm, BizCodeRuleQuery>>({
  form: { ...initFormData },
  rules: {
    id: [{ required: true, message: 'id不能为空', trigger: 'blur' }],
    ruleType: [{ required: true, message: '规则类型不能为空', trigger: 'change' }],
    indexNum: [{ required: true, message: '序号不能为空', trigger: 'change' }],
    constantValue: [
      {
        required: true,
        message: '常量值不能为空',
        trigger: 'blur',
        validator: (rule, value, callback) => {
          if (form.value.ruleType === 'constant') {
            if (!value) {
              return callback(new Error('常量值不能为空'));
            }
          }
          callback();
        }
      }
    ],
    dateFormatTemplate: [
      {
        required: true,
        message: '日期时间格式不能为空',
        trigger: 'change',
        validator: (rule, value, callback) => {
          if (form.value.ruleType === 'date_time') {
            if (!value) {
              return callback(new Error('日期时间不能为空'));
            }
          }
          callback();
        }
      }
    ],
    serialNumLength: [
      {
        required: true,
        message: '编号长度不能为空',
        trigger: 'change',
        validator: (rule, value, callback) => {
          if (form.value.ruleType === 'serial_num') {
            if (!value) {
              return callback(new Error('编号长度不能为空'));
            }
          }
          callback();
        }
      }
    ],
    serialNumStartValue: [
      {
        required: true,
        message: '编号起始值不能为空',
        trigger: 'change',
        validator: (rule, value, callback) => {
          if (form.value.ruleType === 'serial_num') {
            if (value === undefined || value === null) {
              return callback(new Error('编号起始值不能为空'));
            }
          }
          callback();
        }
      }
    ],
    serialNumStepLength: [
      {
        required: true,
        message: '编号步长不能为空',
        trigger: 'change',
        validator: (rule, value, callback) => {
          if (form.value.ruleType === 'serial_num') {
            if (!value) {
              return callback(new Error('编号步长不能为空'));
            }
          }
          callback();
        }
      }
    ]
  }
});
const { form, rules } = toRefs(data);

const bizCodeList = ref<BizCodeVO[]>([]);

/** 打开弹窗，接收参数 */
const acceptParams = async (params: DialogOption) => {
  reset();
  await getBizCodeList();
  dialog.visible = true;
  dialog.title = params.title;
  if (params.row?.id) {
    // 修改
    form.value = params.row;
  } else {
    // 新增
    form.value = { ...initFormData };
    if (params.row?.bizCodeId) {
      form.value.bizCodeId = params.row.bizCodeId;
      form.value.indexNum = params.row.indexNum;
    }
  }
};

/** 查询业务编码列表 */
const getBizCodeList = async () => {
  const res = await listBizCode();
  bizCodeList.value = res.data;
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
  bizCodeRuleFormRef.value?.resetFields();
};

/** 提交按钮 */
const submitForm = () => {
  bizCodeRuleFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateBizCodeRule(form.value).finally(() => (buttonLoading.value = false));
      } else {
        await addBizCodeRule(form.value).finally(() => (buttonLoading.value = false));
      }
      proxy?.$modal.msgSuccess('操作成功');
      dialog.visible = false;
      emits('close');
    }
  });
};

defineExpose({ acceptParams });
</script>
