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
              <el-form ref="queryFormRef" :model="queryParams" :inline="true">
                <el-form-item label="用户名称" prop="userName">
                  <el-input v-model="queryParams.userName" placeholder="请输入用户名称" clearable style="width: 200px" @keyup.enter="handleQuery" />
                </el-form-item>
                <el-form-item label="错误时间" style="width: 308px">
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

    <el-card shadow="never">
      <template #header>
        <el-row :gutter="10" class="mb8">
          <!--          <el-col :span="1.5">-->
          <!--            <el-button v-hasPermi="['adminCommon:errorLog:add']" type="primary" plain icon="Plus" @click="handleAdd">新增</el-button>-->
          <!--          </el-col>-->
          <!--          <el-col :span="1.5">-->
          <!--            <el-button v-hasPermi="['adminCommon:errorLog:edit']" type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()"-->
          <!--              >修改</el-button-->
          <!--            >-->
          <!--          </el-col>-->
          <!--          <el-col :span="1.5">-->
          <!--            <el-button v-hasPermi="['adminCommon:errorLog:remove']" type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()"-->
          <!--              >删除</el-button-->
          <!--            >-->
          <!--          </el-col>-->
          <el-col :span="1.5">
            <el-button v-hasPermi="['adminCommon:errorLog:export']" type="warning" plain icon="Download" @click="handleExport">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @query-table="getPageList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="commonErrorLogPageList" @selection-change="handleSelectionChange" border height="600">
        <!--        <el-table-column type="selection" width="55" align="center" />-->
        <!--        <el-table-column v-if="true" label="id" align="center" prop="id" width="300" />-->
        <!--        <el-table-column label="环境" align="center" prop="environment" />-->
        <!--        <el-table-column label="级别" align="center" prop="level" />-->
        <!--        <el-table-column label="来源" align="center" prop="source" />-->
        <el-table-column label="服务" align="center" prop="service" />
        <el-table-column label="模块" align="center" prop="module" />
        <!--        <el-table-column label="用户id" align="center" prop="userId" />-->
        <!--        <el-table-column label="唯一用户id" align="center" prop="uniUserId" />-->
        <el-table-column label="用户名" align="center" prop="userName">
          <template #default="scope">
            <el-tag v-if="scope.row?.userName" type="success">{{ scope.row?.userName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="ip" align="center" prop="ip" width="200">
          <template #default="scope">
            <el-tooltip class="box-item" effect="dark" :content="scope.row?.ip" placement="top-start">
              <el-text class="w-200px mb-2" truncated>
                {{ scope.row?.ip }}
              </el-text>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="地点" align="center" prop="location" width="200">
          <template #default="scope">
            <el-tooltip class="box-item" effect="dark" :content="scope.row?.location" placement="top-start">
              <el-text class="w-200px mb-2" truncated>
                {{ scope.row?.location }}
              </el-text>
            </el-tooltip>
          </template>
        </el-table-column>
        <!--        <el-table-column label="设备信息" align="center" prop="deviceInfo" />-->
        <el-table-column label="设备信息" align="center" prop="deviceInfo" width="200">
          <template #default="scope">
            <el-tooltip class="box-item" effect="dark" :content="scope.row?.deviceInfo" placement="top-start">
              <el-text class="w-150px mb-2" truncated>
                {{ scope.row?.deviceInfo }}
              </el-text>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="请求方法" align="center" prop="requestMethod" />
        <el-table-column label="请求URL" align="center" prop="requestUrl" width="200">
          <template #default="scope">
            <el-tooltip class="box-item" effect="dark" :content="scope.row?.requestUrl" placement="top-start">
              <el-text class="w-150px mb-2" truncated>
                {{ scope.row?.requestUrl }}
              </el-text>
            </el-tooltip>
          </template>
        </el-table-column>
        <!--        <el-table-column label="请求头" align="center" prop="requestHeaders" />-->
        <!--        <el-table-column label="请求体" align="center" prop="requestBody" />-->
        <!--        <el-table-column label="请求查询参数" align="center" prop="requestQueryParams" />-->
        <!--        <el-table-column label="请求详情" align="center" prop="requestDetail" />-->
        <!--        <el-table-column label="响应状态码" align="center" prop="responseStatusCode" />-->
        <!--        <el-table-column label="响应头" align="center" prop="responseHeaders" />-->
        <!--        <el-table-column label="响应体" align="center" prop="responseBody" />-->
        <el-table-column label="错误代码" align="center" prop="errorCode">
          <template #default="scope">
            <el-tag v-if="scope.row?.errorCode" type="danger">{{ scope.row?.errorCode }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="错误信息" align="center" prop="errorMessage" width="200">
          <template #default="scope">
            <el-tooltip class="box-item" effect="dark" :content="scope.row?.errorMessage" placement="top-start">
              <el-text class="w-150px mb-2" truncated>
                {{ scope.row?.errorMessage }}
              </el-text>
            </el-tooltip>
          </template>
        </el-table-column>
        <!--        <el-table-column label="错误详情" align="center" prop="errorDetail" />-->
        <!--        <el-table-column label="额外信息" align="center" prop="additionalInfo" />-->
        <el-table-column label="错误时间" align="center" prop="errorTime" width="180">
          <template #default="scope">
            <span>{{ proxy.parseTime(scope.row.errorTime) }}</span>
          </template>
        </el-table-column>
        <!--        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">-->
        <!--          <template #default="scope">-->
        <!--            <el-tooltip content="查看" placement="top">-->
        <!--              <el-button v-hasPermi="['adminCommon:errorLog:query']" link type="primary" icon="View" @click="handleUpdate(scope.row)"></el-button>-->
        <!--            </el-tooltip>-->
        <!--            <el-tooltip content="修改" placement="top">-->
        <!--              <el-button v-hasPermi="['adminCommon:errorLog:edit']" link type="primary" icon="Edit" @click="handleUpdate(scope.row)"></el-button>-->
        <!--            </el-tooltip>-->
        <!--            <el-tooltip content="删除" placement="top">-->
        <!--              <el-button v-hasPermi="['adminCommon:errorLog:remove']" link type="primary" icon="Delete" @click="handleDelete(scope.row)"></el-button>-->
        <!--            </el-tooltip>-->
        <!--          </template>-->
        <!--        </el-table-column>-->
      </el-table>

      <pagination v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" :total="total" @pagination="getPageList" />
    </el-card>
    <!-- 添加或修改错误日志对话框 -->
    <el-dialog v-model="dialog.visible" :title="dialog.title" width="500px" append-to-body>
      <el-form ref="commonErrorLogFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="错误时间" prop="errorTime">
          <el-date-picker v-model="form.errorTime" clearable type="datetime" value-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择错误时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="环境" prop="environment">
          <el-input v-model="form.environment" placeholder="请输入环境" />
        </el-form-item>
        <el-form-item label="级别" prop="level">
          <el-input v-model="form.level" placeholder="请输入级别" />
        </el-form-item>
        <el-form-item label="来源" prop="source">
          <el-input v-model="form.source" placeholder="请输入来源" />
        </el-form-item>
        <el-form-item label="服务" prop="service">
          <el-input v-model="form.service" placeholder="请输入服务" />
        </el-form-item>
        <el-form-item label="模块" prop="module">
          <el-input v-model="form.module" placeholder="请输入模块" />
        </el-form-item>
        <el-form-item label="用户id" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户id" />
        </el-form-item>
        <el-form-item label="唯一用户id" prop="uniUserId">
          <el-input v-model="form.uniUserId" placeholder="请输入唯一用户id" />
        </el-form-item>
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="ip" prop="ip">
          <el-input v-model="form.ip" placeholder="请输入ip" />
        </el-form-item>
        <el-form-item label="地点" prop="location">
          <el-input v-model="form.location" placeholder="请输入地点" />
        </el-form-item>
        <el-form-item label="设备信息" prop="deviceInfo">
          <el-input v-model="form.deviceInfo" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="请求方法" prop="requestMethod">
          <el-input v-model="form.requestMethod" placeholder="请输入请求方法" />
        </el-form-item>
        <el-form-item label="请求URL" prop="requestUrl">
          <el-input v-model="form.requestUrl" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="请求头" prop="requestHeaders">
          <el-input v-model="form.requestHeaders" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="请求体" prop="requestBody">
          <el-input v-model="form.requestBody" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="请求查询参数" prop="requestQueryParams">
          <el-input v-model="form.requestQueryParams" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="请求详情" prop="requestDetail">
          <el-input v-model="form.requestDetail" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="响应状态码" prop="responseStatusCode">
          <el-input v-model="form.responseStatusCode" placeholder="请输入响应状态码" />
        </el-form-item>
        <el-form-item label="响应头" prop="responseHeaders">
          <el-input v-model="form.responseHeaders" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="响应体" prop="responseBody">
          <el-input v-model="form.responseBody" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="错误代码" prop="errorCode">
          <el-input v-model="form.errorCode" placeholder="请输入错误代码" />
        </el-form-item>
        <el-form-item label="错误信息" prop="errorMessage">
          <el-input v-model="form.errorMessage" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="错误详情" prop="errorDetail">
          <el-input v-model="form.errorDetail" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="额外信息" prop="additionalInfo">
          <el-input v-model="form.additionalInfo" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="CommonErrorLog" lang="ts">
import {
  pageListCommonErrorLog,
  listCommonErrorLog,
  getCommonErrorLog,
  delCommonErrorLog,
  addCommonErrorLog,
  updateCommonErrorLog
} from '@/api/infra/common/commonErrorLog';
import { CommonErrorLogVO, CommonErrorLogQuery, CommonErrorLogForm } from '@/api/infra/common/commonErrorLog/types';
import { CaretRight } from '@element-plus/icons-vue';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const commonErrorLogPageList = ref<CommonErrorLogVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const dateRange = ref<[DateModelType, DateModelType]>(['', '']);

const queryFormRef = ref<ElFormInstance>();
const commonErrorLogFormRef = ref<ElFormInstance>();
const activeNames = ref(['defaultSearch']);

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: CommonErrorLogForm = {
  id: undefined,
  errorTime: undefined,
  environment: undefined,
  level: undefined,
  source: undefined,
  service: undefined,
  module: undefined,
  userId: undefined,
  uniUserId: undefined,
  userName: undefined,
  ip: undefined,
  location: undefined,
  deviceInfo: undefined,
  requestMethod: undefined,
  requestUrl: undefined,
  requestHeaders: undefined,
  requestBody: undefined,
  requestQueryParams: undefined,
  requestDetail: undefined,
  responseStatusCode: undefined,
  responseHeaders: undefined,
  responseBody: undefined,
  errorCode: undefined,
  errorMessage: undefined,
  errorDetail: undefined,
  additionalInfo: undefined
};
const data = reactive<PageData<CommonErrorLogForm, CommonErrorLogQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    errorTime: undefined,
    environment: undefined,
    level: undefined,
    source: undefined,
    service: undefined,
    module: undefined,
    userId: undefined,
    uniUserId: undefined,
    userName: undefined,
    ip: undefined,
    location: undefined,
    deviceInfo: undefined,
    requestMethod: undefined,
    requestUrl: undefined,
    requestHeaders: undefined,
    requestBody: undefined,
    requestQueryParams: undefined,
    requestDetail: undefined,
    responseStatusCode: undefined,
    responseHeaders: undefined,
    responseBody: undefined,
    errorCode: undefined,
    errorMessage: undefined,
    errorDetail: undefined,
    additionalInfo: undefined,
    params: {}
  },
  rules: {
    id: [{ required: true, message: '用户ID不能为空', trigger: 'blur' }],
    errorTime: [{ required: true, message: '错误时间不能为空', trigger: 'blur' }],
    environment: [{ required: true, message: '环境不能为空', trigger: 'blur' }],
    level: [{ required: true, message: '级别不能为空', trigger: 'blur' }],
    source: [{ required: true, message: '来源不能为空', trigger: 'blur' }],
    service: [{ required: true, message: '服务不能为空', trigger: 'blur' }],
    module: [{ required: true, message: '模块不能为空', trigger: 'blur' }],
    userId: [{ required: true, message: '用户id不能为空', trigger: 'blur' }],
    uniUserId: [{ required: true, message: '唯一用户id不能为空', trigger: 'blur' }],
    userName: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
    ip: [{ required: true, message: 'ip不能为空', trigger: 'blur' }],
    location: [{ required: true, message: '地点不能为空', trigger: 'blur' }],
    deviceInfo: [{ required: true, message: '设备信息不能为空', trigger: 'blur' }],
    requestMethod: [{ required: true, message: '请求方法不能为空', trigger: 'blur' }],
    requestUrl: [{ required: true, message: '请求URL不能为空', trigger: 'blur' }],
    requestHeaders: [{ required: true, message: '请求头不能为空', trigger: 'blur' }],
    requestBody: [{ required: true, message: '请求体不能为空', trigger: 'blur' }],
    requestQueryParams: [{ required: true, message: '请求查询参数不能为空', trigger: 'blur' }],
    requestDetail: [{ required: true, message: '请求详情不能为空', trigger: 'blur' }],
    responseStatusCode: [{ required: true, message: '响应状态码不能为空', trigger: 'blur' }],
    responseHeaders: [{ required: true, message: '响应头不能为空', trigger: 'blur' }],
    responseBody: [{ required: true, message: '响应体不能为空', trigger: 'blur' }],
    errorCode: [{ required: true, message: '错误代码不能为空', trigger: 'blur' }],
    errorMessage: [{ required: true, message: '错误信息不能为空', trigger: 'blur' }],
    errorDetail: [{ required: true, message: '错误详情不能为空', trigger: 'blur' }],
    additionalInfo: [{ required: true, message: '额外信息不能为空', trigger: 'blur' }]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询错误日志分页列表 */
const getPageList = async () => {
  loading.value = true;
  const res = await pageListCommonErrorLog(proxy?.addDateRange(queryParams.value, dateRange.value));
  commonErrorLogPageList.value = res.rows;
  total.value = res.total;
  loading.value = false;
};

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
};

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  commonErrorLogFormRef.value?.resetFields();
};

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getPageList();
};

/** 重置按钮操作 */
const resetQuery = () => {
  dateRange.value = ['', ''];
  queryFormRef.value?.resetFields();
  handleQuery();
};

/** 多选框选中数据 */
const handleSelectionChange = (selection: CommonErrorLogVO[]) => {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = '添加错误日志';
};

/** 修改按钮操作 */
const handleUpdate = async (row?: CommonErrorLogVO) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getCommonErrorLog(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = '修改错误日志';
};

/** 提交按钮 */
const submitForm = () => {
  commonErrorLogFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateCommonErrorLog(form.value).finally(() => (buttonLoading.value = false));
      } else {
        await addCommonErrorLog(form.value).finally(() => (buttonLoading.value = false));
      }
      proxy?.$modal.msgSuccess('操作成功');
      dialog.visible = false;
      await getPageList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: CommonErrorLogVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除错误日志编号为"' + _ids + '"的数据项？').finally(() => (loading.value = false));
  await delCommonErrorLog(_ids);
  proxy?.$modal.msgSuccess('删除成功');
  await getPageList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    'infra/admin/common/errorLog/export',
    {
      ...queryParams.value
    },
    `错误日志_${new Date().getTime()}.xlsx`
  );
};

onMounted(() => {
  getPageList();
});
</script>
