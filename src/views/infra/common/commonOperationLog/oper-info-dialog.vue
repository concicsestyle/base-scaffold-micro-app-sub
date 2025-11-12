<template>
  <el-dialog v-model="open" title="操作日志详细" width="1200px" append-to-body close-on-click-modal draggable center @closed="info = null">
    <el-descriptions v-if="info" :column="1" border>
      <el-descriptions-item label="操作状态" label-align="center" label-width="120px">
        <template #default>
          <el-tag v-if="info.status === 0" type="success">正常</el-tag>
          <el-tag v-else-if="info.status === 1" type="danger">失败</el-tag>
        </template>
      </el-descriptions-item>
      <el-descriptions-item label="登录信息" label-align="center" label-width="120px">
        <template #default> {{ info.operatorName }} / {{ info.operatorDeptName }} / {{ info.operationIp }} / {{ info.operationLocation }} </template>
      </el-descriptions-item>
      <el-descriptions-item label="请求信息" label-align="center" label-width="120px">
        <template #default> {{ info.requestMethod }} {{ info.operationUrl }} </template>
      </el-descriptions-item>
      <el-descriptions-item label="操作模块" label-align="center" label-width="120px">
        <template #default> {{ info.title }} / {{ typeFormat(info) }} </template>
      </el-descriptions-item>
      <el-descriptions-item label="操作方法" label-align="center" label-width="120px">
        <template #default>
          {{ info.method }}
        </template>
      </el-descriptions-item>
      <el-descriptions-item label="请求参数" label-align="center" label-width="120px">
        <template #default>
          <div class="max-h-300px overflow-y-auto">
            <VueJsonPretty :data="formatToJsonObject(info.operationParam)" />
          </div>
        </template>
      </el-descriptions-item>
      <el-descriptions-item label="返回参数" label-align="center" label-width="120px">
        <template #default>
          <div class="max-h-300px overflow-y-auto">
            <VueJsonPretty :data="formatToJsonObject(info.jsonResult)" />
          </div>
        </template>
      </el-descriptions-item>
      <el-descriptions-item label="消耗时间" label-align="center" label-width="120px">
        <template #default>
          <span> {{ info.costTime }}ms </span>
        </template>
      </el-descriptions-item>
      <el-descriptions-item label="操作时间" label-align="center" label-width="120px">
        <template #default> {{ proxy.parseTime(info.operationTime) }}</template>
      </el-descriptions-item>
      <el-descriptions-item v-if="info.status === 1" label="异常信息" label-align="center" label-width="120px">
        <template #default>
          <span class="text-danger"> {{ info.errorMsg }}</span>
        </template>
      </el-descriptions-item>
    </el-descriptions>
  </el-dialog>
</template>

<script setup lang="ts">
import { OperationLogForm } from '@/api/infra/common/commonOperationLog/types';
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';

const open = ref(false);
const info = ref<OperationLogForm | null>(null);
function openDialog(row: OperationLogForm) {
  info.value = row;
  open.value = true;
}

function closeDialog() {
  open.value = false;
}

defineExpose({
  openDialog,
  closeDialog
});

/**
 * json转为对象
 * @param data 原始数据
 */
function formatToJsonObject(data: string) {
  try {
    return JSON.parse(data);
  } catch (error) {
    return data;
  }
}

/**
 * 字典信息
 */
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { operation_type } = toRefs<any>(proxy?.useDict('operation_type'));
const typeFormat = (row: OperationLogForm) => {
  return proxy?.selectDictLabel(operation_type.value, row.businessType);
};
</script>

<style lang="scss" scoped>
/**
label宽度固定
*/
:deep(.el-descriptions__label) {
  min-width: 100px;
}
/**
文字超过 换行显示
*/
:deep(.el-descriptions__content) {
  max-width: 300px;
}
</style>
