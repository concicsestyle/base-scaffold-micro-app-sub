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
              <el-form ref="queryFormRef" :model="queryParams" :inline="true" label-width="68px">
                <el-form-item label="操作地址" prop="operationIp">
                  <el-input
                    v-model="queryParams.operationIp"
                    placeholder="请输入操作地址"
                    clearable
                    style="width: 200px"
                    @keyup.enter="handleQuery"
                  />
                </el-form-item>
                <el-form-item label="系统模块" prop="title">
                  <el-input v-model="queryParams.title" placeholder="请输入系统模块" clearable style="width: 200px" @keyup.enter="handleQuery" />
                </el-form-item>
                <el-form-item label="操作人员" prop="operatorName">
                  <el-input
                    v-model="queryParams.operatorName"
                    placeholder="请输入操作人员"
                    clearable
                    style="width: 240px"
                    @keyup.enter="handleQuery"
                  />
                </el-form-item>
                <el-form-item label="类型" prop="businessType">
                  <el-select v-model="queryParams.businessType" placeholder="操作类型" clearable style="width: 200px">
                    <el-option v-for="dict in operation_type" :key="dict.value" :label="dict.label" :value="dict.value" />
                  </el-select>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                  <el-select v-model="queryParams.status" placeholder="操作状态" clearable style="width: 200px">
                    <el-option v-for="dict in success_fail_status" :key="dict.value" :label="dict.label" :value="dict.value" />
                  </el-select>
                </el-form-item>
                <el-form-item label="操作时间" style="width: 308px">
                  <el-date-picker
                    v-model="dateRange"
                    value-format="YYYY-MM-DD HH:mm:ss"
                    type="daterange"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"
                  ></el-date-picker>
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

    <el-card shadow="hover">
      <template #header>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              v-hasPermi="['adminCommon:operationLog:remove']"
              type="danger"
              plain
              icon="Delete"
              :disabled="multiple"
              @click="handleDelete()"
            >
              删除
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button v-hasPermi="['adminCommon:operationLog:remove']" type="danger" plain icon="WarnTriangleFilled" @click="handleClean"
              >清空</el-button
            >
          </el-col>
          <!--          <el-col :span="1.5">-->
          <!--            <el-button v-hasPermi="['adminCommon:operationLog:export']" type="warning" plain icon="Download" @click="handleExport">导出</el-button>-->
          <!--          </el-col>-->
          <right-toolbar v-model:showSearch="showSearch" @query-table="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table
        ref="operationLogTableRef"
        v-loading="loading"
        :data="operationLogList"
        :default-sort="defaultSort"
        @selection-change="handleSelectionChange"
        @sort-change="handleSortChange"
        border
        height="550"
      >
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column label="日志编号" align="center" prop="operationId" />
        <el-table-column label="系统模块" align="center" prop="title" :show-overflow-tooltip="true" />
        <el-table-column label="操作类型" align="center" prop="businessType">
          <template #default="scope">
            <dict-tag :options="operation_type" :value="scope.row.businessType" />
          </template>
        </el-table-column>
        <el-table-column
          label="操作人员"
          align="center"
          width="110"
          prop="operatorName"
          :show-overflow-tooltip="true"
          sortable="custom"
          :sort-orders="['descending', 'ascending']"
        />
        <el-table-column label="部门" align="center" prop="operatorDeptName" width="130" :show-overflow-tooltip="true" />
        <el-table-column label="操作地址" align="center" prop="operationIp" width="130" :show-overflow-tooltip="true" />
        <el-table-column label="操作状态" align="center" prop="status">
          <template #default="scope">
            <dict-tag :options="success_fail_status" :value="scope.row.status" />
          </template>
        </el-table-column>
        <el-table-column
          label="操作日期"
          align="center"
          prop="operationTime"
          width="180"
          sortable="custom"
          :sort-orders="['descending', 'ascending']"
        >
          <template #default="scope">
            <span>{{ proxy.parseTime(scope.row.operationTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="消耗时间"
          align="center"
          prop="costTime"
          width="110"
          :show-overflow-tooltip="true"
          sortable="custom"
          :sort-orders="['descending', 'ascending']"
        >
          <template #default="scope">
            <span>{{ scope.row.costTime }}毫秒</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="详细" placement="top">
              <el-button v-hasPermi="['adminCommon:operationLog:query']" link type="primary" icon="View" @click="handleView(scope.row)"> </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" :total="total" @pagination="getList" />
    </el-card>
    <!-- 操作日志详细 -->
    <OperInfoDialog ref="operInfoDialogRef" />
  </div>
</template>

<script setup name="OperationLog" lang="ts">
import { list, delOperlog, cleanOperlog } from '@/api/infra/common/commonOperationLog';
import { OperationLogForm, OperationLogQuery, OperationLogVO } from '@/api/infra/common/commonOperationLog/types';
import OperInfoDialog from './oper-info-dialog.vue';
import { CaretRight } from '@element-plus/icons-vue';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { operation_type, success_fail_status } = toRefs<any>(proxy?.useDict('operation_type', 'success_fail_status'));

const operationLogList = ref<OperationLogVO[]>([]);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<number | string>>([]);
const multiple = ref(true);
const total = ref(0);
const dateRange = ref<[DateModelType, DateModelType]>(['', '']);
const defaultSort = ref<any>({ prop: 'operationTime', order: 'descending' });

const operationLogTableRef = ref<ElTableInstance>();
const queryFormRef = ref<ElFormInstance>();
const activeNames = ref(['defaultSearch']);

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const data = reactive<PageData<OperationLogForm, OperationLogQuery>>({
  form: {
    operationId: undefined,
    tenantId: undefined,
    title: '',
    businessType: 0,
    businessTypes: undefined,
    method: '',
    requestMethod: '',
    operatorType: 0,
    operatorName: '',
    operatorDeptName: '',
    operationUrl: '',
    operationIp: '',
    operationLocation: '',
    operationParam: '',
    operationTime: '',
    jsonResult: '',
    status: 0,
    errorMsg: '',
    costTime: 0
  },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    operationIp: '',
    title: '',
    operatorName: '',
    businessType: '',
    status: '',
    orderByColumn: defaultSort.value.prop,
    isAsc: defaultSort.value.order
  },
  rules: {}
});

const { queryParams, form } = toRefs(data);

/** 查询登录日志 */
const getList = async () => {
  loading.value = true;
  const res = await list(proxy?.addDateRange(queryParams.value, dateRange.value));
  operationLogList.value = res.rows;
  total.value = res.total;
  loading.value = false;
};
/** 操作日志类型字典翻译 */
const typeFormat = (row: OperationLogForm) => {
  return proxy?.selectDictLabel(operation_type.value, row.businessType);
};
/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
};
/** 重置按钮操作 */
const resetQuery = () => {
  dateRange.value = ['', ''];
  queryFormRef.value?.resetFields();
  queryParams.value.pageNum = 1;
  operationLogTableRef.value?.sort(defaultSort.value.prop, defaultSort.value.order);
};
/** 多选框选中数据 */
const handleSelectionChange = (selection: OperationLogVO[]) => {
  ids.value = selection.map((item) => item.operationId);
  multiple.value = !selection.length;
};
/** 排序触发事件 */
const handleSortChange = (column: any) => {
  queryParams.value.orderByColumn = column.prop;
  queryParams.value.isAsc = column.order;
  getList();
};

const operInfoDialogRef = ref<InstanceType<typeof OperInfoDialog>>();
/** 详细按钮操作 */
const handleView = (row: OperationLogVO) => {
  operInfoDialogRef.value.openDialog(row);
};

/** 删除按钮操作 */
const handleDelete = async (row?: OperationLogVO) => {
  const operationIds = row?.operationId || ids.value;
  await proxy?.$modal.confirm('是否确认删除日志编号为"' + operationIds + '"的数据项?');
  await delOperlog(operationIds);
  await getList();
  proxy?.$modal.msgSuccess('删除成功');
};

/** 清空按钮操作 */
const handleClean = async () => {
  await proxy?.$modal.confirm('是否确认清空所有操作日志数据项?');
  await cleanOperlog();
  await getList();
  proxy?.$modal.msgSuccess('清空成功');
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    'infra/admin/common/operationLog/export',
    {
      ...queryParams.value
    },
    `config_${new Date().getTime()}.xlsx`
  );
};
onMounted(() => {
  getList();
});
</script>
