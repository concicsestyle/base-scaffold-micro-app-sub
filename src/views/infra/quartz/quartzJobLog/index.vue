<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryRef" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="任务名称" prop="jobName">
        <el-input v-model="queryParams.jobName" placeholder="请输入任务名称" clearable style="width: 240px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="任务组名" prop="jobGroup">
        <el-select v-model="queryParams.jobGroup" placeholder="请选择任务组名" clearable style="width: 240px">
          <el-option v-for="dict in quartz_job_group" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="执行状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择执行状态" clearable style="width: 240px">
          <el-option v-for="dict in success_fail_status" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="执行时间" style="width: 308px">
        <el-date-picker
          v-model="dateRange"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="datetimerange"
          range-separator="-"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button v-hasPermi="['adminQuartz:quartzJobLog:remove']" type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button v-hasPermi="['adminQuartz:quartzJobLog:clean']" type="danger" plain icon="Delete" @click="handleClean">清空</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button v-hasPermi="['adminQuartz:quartzJobLog:export']" type="warning" plain icon="Download" @click="handleExport">导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Close" @click="handleClose">关闭</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @query-table="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="jobLogList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="日志编号" width="80" align="center" prop="jobLogId" />
      <el-table-column label="任务名称" align="center" prop="jobName" :show-overflow-tooltip="true" />
      <el-table-column label="任务组名" align="center" prop="jobGroup" :show-overflow-tooltip="true">
        <template #default="scope">
          <dict-tag :options="quartz_job_group" :value="scope.row.jobGroup" />
        </template>
      </el-table-column>
      <el-table-column label="调用目标字符串" align="center" prop="invokeTarget" :show-overflow-tooltip="true" />
      <el-table-column label="日志信息" align="center" prop="jobMessage" :show-overflow-tooltip="true" />
      <el-table-column label="执行状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :options="success_fail_status" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="执行时间" align="center" prop="createTime" width="180">
        <template #default="scope">
          <span>{{ proxy.parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button v-hasPermi="['adminQuartz:quartzJobLog:query']" link type="primary" icon="View" @click="handleView(scope.row)">详细</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" :total="total" @pagination="getList" />

    <!-- 调度日志详细 -->
    <el-dialog v-model="open" title="调度日志详细" width="700px" append-to-body>
      <el-form :model="form" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="日志序号：">{{ form.jobLogId }}</el-form-item>
            <el-form-item label="任务名称：">{{ form.jobName }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务分组：">{{ form.jobGroup }}</el-form-item>
            <el-form-item label="执行时间：">{{ form.createTime }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="调用方法：">{{ form.invokeTarget }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="日志信息：">{{ form.jobMessage }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="执行状态：">
              <div v-if="form?.status == 0">正常</div>
              <div v-else-if="form?.status == 1">失败</div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item v-if="form?.status == 1" label="异常信息：">{{ form.exceptionInfo }}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="open = false">关 闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="JobLog" lang="ts">
import { getJob } from '@/api/infra/quartz/quartzJob';
import { JobVO } from '@/api/infra/quartz/quartzJob/types';
import { listJobLog, delJobLog, cleanJobLog } from '@/api/infra/quartz/quartzJobLog';
import { JobLogVO, JobLogQuery, JobLogForm } from '@/api/infra/quartz/quartzJobLog/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { success_fail_status, quartz_job_group } = toRefs<any>(proxy?.useDict('success_fail_status', 'quartz_job_group'));

const jobLogList = ref<JobLogVO[]>([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const multiple = ref(true);
const total = ref(0);
const dateRange = ref([]);
const route = useRoute();

const initFormData: JobLogForm = {
  jobLogId: undefined,
  jobName: undefined,
  jobGroup: undefined,
  invokeTarget: undefined,
  jobMessage: undefined,
  status: undefined,
  exceptionInfo: undefined,
  createBy: undefined,
  createDept: undefined,
  createTime: undefined,
  updateBy: undefined,
  updateTime: undefined
};

const data = reactive<PageData<JobLogForm, JobLogQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    jobName: undefined,
    jobGroup: undefined,
    status: undefined
  },
  rules: {}
});

const { queryParams, form, rules } = toRefs(data);

const queryRef = ref<ElFormInstance>();
const jobRef = ref<ElFormInstance>();

/** 查询调度日志列表 */
const getList = () => {
  loading.value = true;
  listJobLog(proxy.addDateRange(queryParams.value, dateRange.value)).then((response) => {
    jobLogList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
};

// 返回按钮
const handleClose = () => {
  const obj = { path: '/infra/commonTool/quartzJob' };
  proxy.$tab.closeOpenPage(obj);
};

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
};

/** 重置按钮操作 */
const resetQuery = () => {
  dateRange.value = [];
  queryRef.value?.resetFields();
  handleQuery();
};

// 多选框选中数据
const handleSelectionChange = (selection: JobLogVO[]) => {
  ids.value = selection.map((item) => item.jobLogId);
  multiple.value = !selection.length;
};

/** 详细按钮操作 */
const handleView = (row: JobLogVO) => {
  open.value = true;
  form.value = row;
};

/** 删除按钮操作 */
const handleDelete = () => {
  proxy.$modal
    .confirm('是否确认删除调度日志编号为"' + ids.value + '"的数据项?')
    .then(function () {
      return delJobLog(ids.value);
    })
    .then(() => {
      getList();
      proxy.$modal.msgSuccess('删除成功');
    })
    .catch(() => {});
};

/** 清空按钮操作 */
const handleClean = () => {
  proxy.$modal
    .confirm('是否确认清空所有调度日志数据项?')
    .then(function () {
      return cleanJobLog();
    })
    .then(() => {
      getList();
      proxy.$modal.msgSuccess('清空成功');
    })
    .catch(() => {});
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy.download(
    'infra/admin/quartz/jobLog/export',
    {
      ...queryParams.value
    },
    `jobLog_${new Date().getTime()}.xlsx`
  );
};

onMounted(() => {
  const jobId = route.params && route.params.jobId;
  if (jobId !== undefined && jobId != 0) {
    getJob(jobId).then((response) => {
      queryParams.value.jobName = response.data.jobName;
      queryParams.value.jobGroup = response.data.jobGroup;
      getList();
    });
  } else {
    getList();
  }
});
</script>
