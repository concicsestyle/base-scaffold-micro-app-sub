<template>
  <div class="advanced-search-container">
    <!-- 动态按钮组：打开弹窗 + 清空条件 -->
    <div class="search-btn-group">
      <el-button
        type="success"
        @click="showAdvancedSearch = true"
        icon="Search"
        class="advanced-search-btn"
        :loading="isSearching"
        :disabled="isSearching"
      >
        高级搜索
      </el-button>

      <el-button
        type="default"
        @click="handleClearSearch"
        icon="Delete"
        class="clear-search-btn"
        :loading="isSearching"
        :disabled="isSearching || !hasConfiguredConditions"
        v-if="hasConfiguredConditions"
      >
        清空高级搜索条件
      </el-button>
    </div>

    <!-- 高级搜索弹窗 -->
    <el-dialog
      v-model="showAdvancedSearch"
      :title="title"
      center
      width="60%"
      :before-close="handleClose"
      :close-on-click-modal="!isSearching"
      :close-on-press-escape="!isSearching"
    >
      <div class="search-criteria">
        <div v-for="(condition, index) in conditions" :key="index" class="condition-row">
          <!-- 逻辑关系选择 -->
          <el-select v-model="condition.logic" placeholder="逻辑" class="logic-select" v-if="index > 0" :disabled="isSearching">
            <el-option label="并且" value="AND"></el-option>
            <el-option label="或者" value="OR"></el-option>
          </el-select>

          <!-- 字段选择 -->
          <el-select v-model="condition.field" placeholder="选择字段" class="field-select" @change="handleFieldChange(index)" :disabled="isSearching">
            <el-option v-for="field in fields" :key="field.value" :label="field.label" :value="field.value"></el-option>
          </el-select>

          <!-- 条件选择 -->
          <el-select v-model="condition.operator" placeholder="选择条件" class="operator-select" :disabled="isSearching">
            <el-option v-for="op in getOperators(condition.field)" :key="op.value" :label="op.label" :value="op.value"></el-option>
          </el-select>

          <!-- 值输入框 -->
          <div class="value-input-wrapper">
            <component
              :is="getInputComponent(condition.field)"
              v-model="condition.value"
              :placeholder="getFieldPlaceholder(condition.field)"
              class="value-input"
              :disabled="isSearching"
              v-bind="getComponentProps(condition.field)"
              v-if="getInputComponent(condition.field)"
            >
              <template v-if="getInputComponent(condition.field) === ElSelect">
                <el-option
                  v-for="option in getFieldOptions(condition.field)"
                  :key="`option-${option.value}`"
                  :label="option.label"
                  :value="option.value"
                ></el-option>
              </template>
            </component>
          </div>

          <!-- 删除按钮 -->
          <el-button
            type="danger"
            icon="Delete"
            circle
            class="delete-btn"
            @click="removeCondition(index)"
            v-if="conditions.length > 1"
            :disabled="isSearching"
          ></el-button>
        </div>

        <!-- 添加条件按钮 -->
        <el-button type="success" icon="Plus" class="add-condition-btn" @click="addCondition" :disabled="isSearching"> 添加条件 </el-button>
      </div>

      <template #footer>
        <el-button @click="resetSearch" :disabled="isSearching"> 重置 </el-button>
        <el-button type="primary" @click="doSearch" :loading="isSearching" :disabled="isSearching">
          <template v-if="isSearching">
            <el-icon><Loading /></el-icon>
            搜索中...
          </template>
          <template v-else> 搜索 </template>
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { ElInput, ElSelect, ElDatePicker, ElOption, ElMessage, ElIcon } from 'element-plus';

// 1. 类型定义
export interface SearchField {
  label: string;
  value: string;
  type: 'text' | 'number' | 'date' | 'select' | 'datetime';
  operators: string[];
  options?: { label: string; value: any }[];
  placeholder?: string;
  dateFormat?: string;
}

interface Operator {
  label: string;
  value: string;
}

export interface SearchCondition {
  logic: 'AND' | 'OR';
  field: string;
  operator: string;
  value: any;
}

// 2. 接收父组件参数
const props = defineProps<{
  fields: SearchField[];
  title?: string;
  operators?: Operator[];
}>();

// 3. 状态管理
const showAdvancedSearch = ref<boolean>(false);
const isSearching = ref<boolean>(false);
const conditions = ref<SearchCondition[]>([{ logic: 'AND', field: '', operator: '', value: null }]);

// 关键1：筛选“有效条件”（排除空/无效配置）
const validConditions = computed(() => {
  return conditions.value.filter(
    (cond) =>
      // 仅保留“字段、运算符、值都非空”的条件
      cond.field !== '' && cond.operator !== '' && cond.value != null && cond.value !== '' && cond.value !== undefined
  );
});

// 关键2：判断是否有有效条件（控制清空按钮显示）
const hasConfiguredConditions = computed(() => validConditions.value.length > 0);

// 4. 重置与清空方法
const resetSearch = () => {
  conditions.value = [{ logic: 'AND', field: '', operator: '', value: null }];
};

// 优化：清空条件 → 输出空数组
const handleClearSearch = () => {
  resetSearch();
  // 无有效条件，传递空数组
  emit('search', { conditions: [] });
  ElMessage.success('已清空高级搜索条件');
};

// 5. 运算符配置
const operators = ref<Operator[]>(
  props.operators || [
    { label: '等于', value: 'eq' },
    { label: '不等于', value: 'ne' },
    { label: '大于', value: 'gt' },
    { label: '小于', value: 'lt' },
    { label: '大于等于', value: 'gte' },
    { label: '小于等于', value: 'lte' },
    { label: '包含', value: 'like' },
    { label: '不包含', value: 'notLike' }
  ]
);

// 6. 监听字段配置变化
watch(
  () => props.fields,
  (newFields) => {
    if (newFields?.length) resetSearch();
  },
  { immediate: true, deep: true }
);

// 7. 条件操作方法
const addCondition = () => {
  conditions.value.push({ logic: 'AND', field: '', operator: '', value: null });
};

const removeCondition = (index: number) => {
  conditions.value.splice(index, 1);
};

const handleFieldChange = (index: number) => {
  conditions.value[index].operator = '';
  conditions.value[index].value = null;
};

// 8. 组件与配置映射方法
const getOperators = (fieldValue: string): Operator[] => {
  if (!fieldValue || !props.fields.length) return [];
  const field = props.fields.find((f) => f.value === fieldValue);
  return field?.operators ? operators.value.filter((op) => field.operators.includes(op.value)) : operators.value;
};

const getInputComponent = (fieldValue: string) => {
  if (!fieldValue || !props.fields.length) return null;
  const field = props.fields.find((f) => f.value === fieldValue);
  switch (field?.type) {
    case 'date':
    case 'datetime':
      return ElDatePicker;
    case 'select':
      return ElSelect;
    case 'number':
    case 'text':
    default:
      return ElInput;
  }
};

const getComponentProps = (fieldValue: string) => {
  if (!fieldValue || !props.fields.length) return {};
  const field = props.fields.find((f) => f.value === fieldValue);
  if (!field) return {};

  switch (field.type) {
    case 'date':
      return { type: 'date', format: field.dateFormat || 'YYYY-MM-DD', valueFormat: 'YYYY-MM-DD' };
    case 'datetime':
      return { type: 'datetime', format: field.dateFormat || 'YYYY-MM-DD HH:mm:ss', valueFormat: 'YYYY-MM-DD HH:mm:ss' };
    case 'select':
      return { placeholder: field.placeholder || `请选择${field.label}`, clearable: false };
    case 'number':
      return { type: 'number', step: '1' };
    default:
      return { placeholder: field.placeholder || `请输入${getFieldLabel(fieldValue)}` };
  }
};

const getFieldLabel = (fieldValue: string): string => {
  const field = props.fields.find((f) => f.value === fieldValue);
  return field ? field.label : '';
};

const getFieldPlaceholder = (fieldValue: string): string => {
  const field = props.fields.find((f) => f.value === fieldValue);
  return field?.placeholder || `请输入${getFieldLabel(fieldValue)}`;
};

const getFieldOptions = (fieldValue: string) => {
  const field = props.fields.find((f) => f.value === fieldValue);
  return field?.options || [];
};

// 9. 搜索逻辑（核心优化：无有效条件时输出空数组）
const emit = defineEmits<{
  (e: 'search', params: { conditions: SearchCondition[] }): Promise<void> | void;
  (e: 'close'): void;
}>();

const doSearch = async () => {
  // 优化：无需验证“所有条件完整”，直接取有效条件
  const effectiveConditions = validConditions.value;

  try {
    isSearching.value = true;
    // 关键：无有效条件 → 传递空数组；有则传递有效条件
    await emit('search', { conditions: effectiveConditions });
    showAdvancedSearch.value = false;
  } catch (error) {
    ElMessage.error(`搜索失败：${error instanceof Error ? error.message : '未知错误'}`);
  } finally {
    isSearching.value = false;
  }
};

const handleClose = () => {
  showAdvancedSearch.value = false;
  emit('close');
};
</script>

<style scoped lang="scss">
.advanced-search-container {
  display: inline-block;
}

.search-btn-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.advanced-search-btn {
  margin-left: 10px;
}

.clear-search-btn {
  color: #606266;
  border-color: #dcdfe6;
  &:hover {
    color: #409eff;
    border-color: #c6e2ff;
    background-color: #ecf5ff;
  }
}

.condition-row {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  gap: 8px;
  flex-wrap: nowrap;
}

.logic-select {
  width: 80px;
}

.field-select {
  width: 140px;
}

.operator-select {
  width: 120px;
}

.value-input-wrapper {
  flex: 1;
  position: relative;
}

.value-input {
  width: 100%;
}

.delete-btn {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
}

.add-condition-btn {
  margin-top: 8px;
}

.search-criteria {
  min-height: 300px;
  max-height: 600px;
  overflow-y: auto;
  padding-right: 8px;
  padding-bottom: 16px;
}

:deep(.el-button--loading) {
  opacity: 0.8;
}

:deep(.el-select-disabled .el-input__inner) {
  cursor: not-allowed;
}
</style>
