<template>
  <el-dialog :title="dialog.title" v-model="dialog.visible" width="1000px" center append-to-body draggable overflow @close="handleDialogClose">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-collapse v-model="bizCodeHistoryActiveNames" :expand-icon-position="'left'">
            <el-collapse-item name="defaultSearch" :icon="CaretRight">
              <template #title="{ isActive }">
                <div :class="['title-wrapper', { 'is-active': isActive }]">搜索条件</div>
              </template>
              <el-form ref="queryFormRef" :model="queryParams" :inline="true">
                <el-form-item label="编码值" prop="codeValue">
                  <el-input v-model="queryParams.codeValue" placeholder="请输入编码值" clearable @keyup.enter="handleQuery" />
                </el-form-item>
                <el-form-item label="失效标识" prop="expireFlag">
                  <el-select v-model="queryParams.expireFlag" placeholder="请选择" clearable>
                    <el-option v-for="dict in common_flag" :key="dict.value" :label="dict.label" :value="dict.value" />
                  </el-select>
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
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()">删除</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getPageList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="bizCodeHistoryPageList" @selection-change="handleSelectionChange" border height="500">
        <el-table-column type="selection" width="55" align="center" />
        <!--        <el-table-column label="id" align="center" prop="id" v-if="true" />-->
        <el-table-column label="业务编码" align="center" prop="bizCodeGroup.groupName">
          <template #default="scope">
            <span>{{ scope.row.bizCodeGroup.groupName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="业务编码名称" align="center" prop="bizCodeName" />
        <el-table-column label="编码值" align="center" prop="codeValue" width="300" />
        <el-table-column label="生成时间" align="center" prop="genTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.genTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="失效标识" align="center" prop="expireFlag">
          <template #default="scope">
            <dict-tag :options="common_flag" :value="scope.row.expireFlag" />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <pagination :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getPageList" />
    </el-card>
  </el-dialog>
</template>

<script setup lang="ts">
import { pageListBizCodeHistory, delBizCodeHistory } from '@/api/infra/common/CommonBizCodeHistory';
import { BizCodeHistoryVO, BizCodeHistoryQuery, BizCodeHistoryForm } from '@/api/infra/common/CommonBizCodeHistory/types';
import { CaretRight } from '@element-plus/icons-vue';
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { common_flag } = toRefs<any>(proxy?.useDict('common_status', 'common_flag'));
const emits = defineEmits(['close']);
const bizCodeHistoryPageList = ref<BizCodeHistoryVO[]>([]);
const loading = ref(true);
const showSearch = ref(false);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const bizCodeHistoryActiveNames = ref(['defaultSearch']);
const queryFormRef = ref<ElFormInstance>();
const dialog = reactive<DialogOption>({
  visible: false,
  title: '',
  row: undefined
});

const data = reactive<PageData<BizCodeHistoryForm, BizCodeHistoryQuery>>({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    groupId: undefined,
    bizCodeId: undefined,
    bizCodeCode: undefined,
    bizCodeName: undefined,
    codeValue: undefined,
    genTime: undefined,
    expireFlag: undefined,
    ruleSnapshot: undefined,
    status: undefined,
    params: {}
  },
  rules: {}
});
const { queryParams } = toRefs(data);

/** 打开弹窗，接收参数 */
const acceptParams = async (params: DialogOption) => {
  console.log('bizCodeHistoryDialog', params);
  dialog.visible = true;
  dialog.title = params.title;
  if (params.row?.id) {
    queryParams.value.bizCodeId = params.row.id;
  }
  await getPageList();
};

/** 查询业务编码历史分页列表 */
const getPageList = async () => {
  loading.value = true;
  const res = await pageListBizCodeHistory(queryParams.value);
  bizCodeHistoryPageList.value = res.rows;
  total.value = res.total;
  loading.value = false;
};

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getPageList();
};

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
};

/** 多选框选中数据 */
const handleSelectionChange = (selection: BizCodeHistoryVO[]) => {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 删除按钮操作 */
const handleDelete = async (row?: BizCodeHistoryVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除业务编码历史编号为"' + _ids + '"的数据项？').finally(() => (loading.value = false));
  await delBizCodeHistory(_ids);
  proxy?.$modal.msgSuccess('删除成功');
  await getPageList();
};

const handleDialogClose = () => {
  queryFormRef.value?.resetFields();
  dialog.visible = false;
  emits('close');
};

defineExpose({ acceptParams });
</script>
