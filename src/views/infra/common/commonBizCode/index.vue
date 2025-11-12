<template>
  <div class="p-4">
    <el-row :gutter="20">
      <!-- 业务编码分组 -->
      <el-col :lg="4" :xs="24">
        <el-card shadow="hover" style="height: 800px">
          <div v-loading="bizCodeGroupLoading">
            <div class="flex flex-row gap-1">
              <el-input
                v-model="bizCodeGroupNameSearch"
                placeholder="请输入业务编码分组名称"
                prefix-icon="Search"
                clearable
                @input="searchBizCodeGroup"
              />
              <el-tooltip effect="dark" content="新增业务编码分组" placement="top-start">
                <el-button :icon="Plus" type="primary" plain circle size="default" @click="handleBizCodeGroupAdd" />
              </el-tooltip>
            </div>
            <el-tree
              ref="bizCodeGroupTreeRef"
              class="mt-2"
              node-key="id"
              :data="bizCodeGroupOptions"
              :props="{ label: 'groupName', children: 'children' }"
              :expand-on-click-node="false"
              :filter-node-method="filterBizCodeGroupTreeNode"
              highlight-current
              icon="Menu"
              @node-click="handleBizCodeGroupTreeNodeClick"
            >
              <template #default="{ node, data }">
                <div class="flex items-center justify-center gap-2" style="font-size: 14px">
                  <div class="flex items-center flex-1 max-w-[150px] overflow-hidden">
                    <el-icon :size="12" class="mr-1"><Grid /></el-icon>
                    <el-tooltip effect="dark" :content="data.groupName" placement="top-start">
                      <span class="whitespace-nowrap overflow-hidden text-ellipsis">
                        {{ data.groupName }}
                      </span>
                    </el-tooltip>
                  </div>
                  <div class="w-10">
                    <el-button type="primary" link @click="handleBizCodeGroupUpdate(node, data)">
                      <el-tooltip effect="dark" content="编辑" placement="top-start">
                        <el-icon :size="12">
                          <Edit />
                        </el-icon>
                      </el-tooltip>
                    </el-button>
                    <el-button type="danger" link @click="handleBizCodeGroupDelete(node, data)">
                      <el-tooltip effect="dark" content="删除" placement="top-start">
                        <el-icon :size="12">
                          <Delete />
                        </el-icon>
                      </el-tooltip>
                    </el-button>
                  </div>
                </div>
              </template>
            </el-tree>
          </div>
        </el-card>
      </el-col>
      <!-- 业务编码 -->
      <el-col :lg="10" :xs="24" style="">
        <el-card shadow="hover" style="height: 800px">
          <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
            <div v-show="bizCodeShowSearch" class="mb-[10px]">
              <el-card shadow="hover">
                <el-collapse v-model="bizCodeActiveNames" :expand-icon-position="'left'">
                  <el-collapse-item name="defaultSearch" :icon="CaretRight">
                    <template #title="{ isActive }">
                      <div :class="['title-wrapper', { 'is-active': isActive }]">搜索条件</div>
                    </template>
                    <el-form ref="bizCodeQueryFormRef" :model="bizCodeQueryParams" :inline="true" label-width="40px">
                      <el-form-item label="名称" prop="name">
                        <el-input v-model="bizCodeQueryParams.name" placeholder="请输入名称" clearable style="width: 120px" />
                      </el-form-item>
                      <el-form-item label="编码" prop="code">
                        <el-input v-model="bizCodeQueryParams.code" placeholder="请输入编码" clearable style="width: 120px" />
                      </el-form-item>
                      <el-form-item>
                        <el-button type="primary" icon="Search" @click="handleBizCodeQuery">搜索</el-button>
                        <el-button icon="Refresh" @click="resetBizCodeQuery">重置</el-button>
                      </el-form-item>
                    </el-form>
                  </el-collapse-item>
                </el-collapse>
              </el-card>
            </div>
          </transition>
          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button type="primary" plain icon="Plus" @click="handleBizCodeAdd">新增</el-button>
            </el-col>
            <right-toolbar v-model:show-search="bizCodeShowSearch" @query-table="getBizCodeList"></right-toolbar>
          </el-row>

          <el-table
            v-loading="bizCodeLoading"
            :data="bizCodeList"
            border
            stripe
            height="550"
            @row-click="bizCodeRowClick"
            highlight-current-row
            row-key="id"
            :current-row-key="curBizCodeId"
          >
            <el-table-column label="id" align="center" prop="id" v-if="false" />
            <el-table-column label="名称" align="center" prop="name" />
            <el-table-column label="编码" align="center" prop="code" :show-overflow-tooltip="true" />
            <!--            <el-table-column label="连接符" align="center" prop="joinChar" />-->
            <el-table-column label="分组" align="center" prop="groupName" :show-overflow-tooltip="true">
              <template #default="scope">
                <el-tag type="info" v-if="scope.row?.groupName">
                  {{ scope.row?.groupName }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="排序" align="center" prop="sort" width="60" />
            <!--            <el-table-column label="状态" align="center" prop="status">-->
            <!--              <template #default="scope">-->
            <!--                <dict-tag :options="common_status" :value="scope.row.status" />-->
            <!--              </template>-->
            <!--            </el-table-column>-->
            <el-table-column label="状态" align="center" prop="status" width="80">
              <template #default="scope">
                <el-switch v-model="scope.row.status" active-value="1" inactive-value="2" @change="handleBizCodeStatusChange(scope.row)"></el-switch>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width">
              <template #default="scope">
                <el-tooltip v-if="scope.row.status === '1'" content="生成编码" placement="top">
                  <el-button link type="primary" icon="TrendCharts" @click="handleBizCodeGen(scope.row)"></el-button>
                </el-tooltip>
                <el-tooltip content="历史记录" placement="top">
                  <el-button link type="primary" icon="Tickets" @click="handleBizCodeViewHistory(scope.row)"></el-button>
                </el-tooltip>
                <el-tooltip content="修改" placement="top">
                  <el-button link type="primary" icon="Edit" @click="handleBizCodeUpdate(scope.row)"></el-button>
                </el-tooltip>
                <el-tooltip content="删除" placement="top">
                  <el-button link type="primary" icon="Delete" @click="handleBizCodeDelete(scope.row)"></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>

          <pagination
            v-model:page="bizCodeQueryParams.pageNum"
            v-model:limit="bizCodeQueryParams.pageSize"
            :total="bizCodeTotal"
            @pagination="getBizCodeList"
          />
        </el-card>
      </el-col>
      <!-- 业务编码规则 -->
      <el-col :lg="10" :xs="24" style="">
        <el-card shadow="hover" style="height: 800px">
          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button type="primary" plain icon="Plus" @click="handleBizCodeRuleAdd">新增</el-button>
            </el-col>
          </el-row>

          <el-table v-loading="bizCodeRuleLoading" :data="bizCodeRuleList" border height="600">
            <el-table-column label="id" align="center" prop="id" v-if="false" />
            <el-table-column label="序号" align="center" prop="indexNum" />
            <el-table-column label="规则类型" align="center" prop="ruleType">
              <template #default="scope">
                <dict-tag :options="common_biz_code_rule_type" :value="scope.row.ruleType" />
              </template>
            </el-table-column>
            <el-table-column label="业务编码" align="center" prop="bizCode">
              <template #default="scope">
                <el-tag type="info" v-if="scope.row?.bizCode?.name">
                  {{ scope.row?.bizCode?.name }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="状态" align="center" prop="status">
              <template #default="scope">
                <dict-tag :options="common_status" :value="scope.row.status" />
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width">
              <template #default="scope">
                <el-tooltip content="修改" placement="top">
                  <el-button link type="primary" icon="Edit" @click="handleBizCodeRuleUpdate(scope.row)"></el-button>
                </el-tooltip>
                <el-tooltip content="删除" placement="top">
                  <el-button link type="primary" icon="Delete" @click="handleBizCodeRuleDelete(scope.row)"></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>

          <pagination
            v-show="bizCodeRuleTotal > 0"
            v-model:page="bizCodeRuleQueryParams.pageNum"
            v-model:limit="bizCodeRuleQueryParams.pageSize"
            :total="bizCodeRuleTotal"
            @pagination="getBizCodeRuleList"
          />
        </el-card>
      </el-col>
    </el-row>
    <!-- 添加或修改业务编码分组对话框 -->
    <BizCodeGroupDialog ref="bizCodeGroupDialogRef" @close="handleBizCodeGroupDialogClose"></BizCodeGroupDialog>
    <!-- 添加或修改业务编码对话框 -->
    <BizCodeDialog ref="bizCodeDialogRef" @close="handleBizCodeDialogClose"></BizCodeDialog>
    <!-- 添加或修改业务编码规则对话框 -->
    <BizCodeRuleDialog ref="bizCodeRuleDialogRef" @close="handleBizCodeRuleDialogClose"></BizCodeRuleDialog>
    <!-- 添加或修改业务编码历史对话框 -->
    <BizCodeHistoryDialog ref="bizCodeHistoryDialogRef" @close="handleBizCodeHistoryDialogClose"></BizCodeHistoryDialog>
  </div>
</template>

<script setup lang="ts">
import {
  pageListBizCodeGroup,
  listBizCodeGroup,
  getBizCodeGroup,
  delBizCodeGroup,
  addBizCodeGroup,
  updateBizCodeGroup
} from '@/api/infra/common/CommonBizCodeGroup';
import { BizCodeGroupVO, BizCodeGroupQuery, BizCodeGroupForm } from '@/api/infra/common/CommonBizCodeGroup/types';
import { pageListBizCode, listBizCode, getBizCode, delBizCode, addBizCode, updateBizCode, genBizCodeValue } from '@/api/infra/common/commonBizCode';
import { BizCodeVO, BizCodeQuery, BizCodeForm } from '@/api/infra/common/commonBizCode/types';
import { pageListBizCodeRule, getBizCodeRule, delBizCodeRule } from '@/api/infra/common/CommonBizCodeRule';
import { BizCodeRuleVO, BizCodeRuleQuery, BizCodeRuleForm } from '@/api/infra/common/CommonBizCodeRule/types';
import BizCodeGroupDialog from './components/bizCodeGroupDialog.vue';
import BizCodeDialog from './components/bizCodeDialog.vue';
import BizCodeRuleDialog from './components/bizCodeRuleDialog.vue';
import BizCodeHistoryDialog from './components/bizCodeHistoryDialog.vue';
import { CaretRight, Delete, Plus } from '@element-plus/icons-vue';
import { copyText } from '@/utils/common';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { common_status, common_biz_code_rule_type } = toRefs<any>(proxy?.useDict('common_status', 'common_biz_code_rule_type'));

const bizCodeGroupDialogRef = ref<typeof BizCodeGroupDialog>();
const bizCodeDialogRef = ref<typeof BizCodeDialog>();
const bizCodeRuleDialogRef = ref<typeof BizCodeRuleDialog>();
const bizCodeHistoryDialogRef = ref<typeof BizCodeHistoryDialog>();
const bizCodeGroupLoading = ref(false);
const bizCodeGroupOptions = ref<BizCodeGroupVO[]>([]);
const bizCodeGroupTreeRef = ref<ElTreeInstance>();
const bizCodeGroupNameSearch = ref<string>();
const curBizCodeGroup = ref<BizCodeGroupVO>();

const bizCodeActiveNames = ref(['defaultSearch']);
const bizCodeList = ref<BizCodeVO[]>([]);
const bizCodeLoading = ref(true);
const bizCodeShowSearch = ref(true);
const bizCodeTotal = ref(0);
const bizCodeQueryFormRef = ref<ElFormInstance>();
const curBizCodeId = ref<string | number>();
const bizCodeData = reactive<PageData<BizCodeForm, BizCodeQuery>>({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    groupId: undefined,
    name: undefined,
    code: undefined,
    joinChar: undefined,
    introDesc: undefined,
    sort: undefined,
    status: undefined,
    params: {}
  },
  rules: {}
});
const { queryParams: bizCodeQueryParams } = toRefs(bizCodeData);

const bizCodeRuleList = ref<BizCodeRuleVO[]>([]);
const bizCodeRuleTotal = ref(0);
const bizCodeRuleLoading = ref(true);
const bizCodeRuleShowSearch = ref(false);
const bizCodeRuleQueryFormRef = ref<ElFormInstance>();
const bizCodeRuleActiveNames = ref(['defaultSearch']);
const bizCodeRuleData = reactive<PageData<BizCodeRuleForm, BizCodeRuleQuery>>({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    bizCodeId: undefined,
    indexNum: undefined,
    ruleType: undefined,
    constantValue: undefined,
    dateFormatTemplate: undefined,
    serialNumLength: undefined,
    serialNumStartValue: undefined,
    serialNumStepLength: undefined,
    randomCharLength: undefined,
    status: undefined,
    params: {}
  },
  rules: {}
});
const { queryParams: bizCodeRuleQueryParams } = toRefs(bizCodeRuleData);

/** 查询业务编码分组列表 */
const getBizCodeGroupList = async () => {
  console.log('getBizCodeGroupList');
  const res = await listBizCodeGroup();
  bizCodeGroupOptions.value = res.data;
  // if (res.data.length > 0) {
  //   curBizCodeGroup.value = res.data[0];
  // }
};

const searchBizCodeGroup = () => {
  bizCodeGroupTreeRef.value?.filter(bizCodeGroupNameSearch.value);
};

/** 业务编码分组新增按钮操作 */
const handleBizCodeGroupAdd = () => {
  const params = {
    title: '添加业务编码分组',
    row: undefined
  };
  bizCodeGroupDialogRef.value?.acceptParams(params);
};

/** 业务编码分组修改按钮操作 */
const handleBizCodeGroupUpdate = async (node: Node, data: BizCodeGroupVO) => {
  console.log('handleBizCodeGroupUpdate', node, data);
  const _id = data?.id;
  const res = await getBizCodeGroup(_id);
  Object.assign(data, res.data);
  const params = {
    title: '修改业务编码分组',
    row: data
  };
  bizCodeGroupDialogRef.value?.acceptParams(params);
};

/** 业务编码分组删除按钮操作 */
const handleBizCodeGroupDelete = async (node: Node, data: BizCodeGroupVO) => {
  console.log('handleBizCodeGroupDelete', node, data);
  const _ids = data?.id;
  await proxy?.$modal.confirm('是否确认删除业务编码分组"' + data.groupName + '"？').finally(() => console.log('删除业务编码分组完成！'));
  await delBizCodeGroup(_ids);
  proxy?.$modal.msgSuccess('删除成功');
  await getBizCodeGroupList();
  await getBizCodeList();
};

/** 业务编码分组关闭逻辑 */
const handleBizCodeGroupDialogClose = async () => {
  bizCodeGroupLoading.value = true;
  await getBizCodeGroupList();
  await getBizCodeList();
  bizCodeGroupLoading.value = false;
};

/** 业务编码分组树通过条件过滤节点  */
const filterBizCodeGroupTreeNode = (value: string, data: any) => {
  if (!value) {
    return true;
  }
  return data.groupName.indexOf(value) !== -1;
};

/** 业务编码分组树节点单击事件 */
const handleBizCodeGroupTreeNodeClick = (data: BizCodeGroupVO) => {
  // 判断当前节点是否被选中
  if (curBizCodeGroup.value?.id === data.id) {
    // 取消选中
    bizCodeGroupTreeRef.value.setCurrentKey(null);
    curBizCodeGroup.value = undefined;
    bizCodeQueryParams.value.groupId = undefined;
    handleBizCodeQuery();
  } else {
    curBizCodeGroup.value = data;
    bizCodeQueryParams.value.groupId = data.id;
    handleBizCodeQuery();
  }
};

/** 查询业务编码列表 */
const getBizCodeList = async () => {
  console.log('getBizCodeList');
  bizCodeLoading.value = true;
  const res = await pageListBizCode(bizCodeQueryParams.value);
  bizCodeList.value = res.rows;
  bizCodeTotal.value = res.total;
  bizCodeLoading.value = false;
  // 默认选中第一个
  if (bizCodeList.value.length > 0) {
    curBizCodeId.value = bizCodeList.value[0].id;
  } else {
    // 无数据，则业务编码规则也不显示
    curBizCodeId.value = undefined;
  }
};

/** 业务编码新增按钮操作 */
const handleBizCodeAdd = () => {
  const params = {
    title: '添加业务编码',
    row: {
      groupId: bizCodeQueryParams.value.groupId
    }
  };
  bizCodeDialogRef.value?.acceptParams(params);
};

/** 业务编码修改按钮操作 */
const handleBizCodeUpdate = async (row: BizCodeVO) => {
  console.log('handleBizCodeUpdate', row);
  const _id = row?.id;
  const res = await getBizCode(_id);
  Object.assign(row, res.data);
  const params = {
    title: '修改业务编码',
    row: row
  };
  bizCodeDialogRef.value?.acceptParams(params);
};

/** 业务编码删除按钮操作 */
const handleBizCodeDelete = async (row: BizCodeVO) => {
  console.log('handleBizCodeDelete', row);
  const _ids = row?.id;
  await proxy?.$modal.confirm('是否确认删除业务编码"' + row.name + '"？').finally(() => console.log('删除业务编码完成！'));
  await delBizCode(_ids);
  proxy?.$modal.msgSuccess('删除成功');
  await getBizCodeList();
};

/** 业务编码状态修改按钮操作 */
const handleBizCodeStatusChange = async (row: BizCodeVO) => {
  try {
    console.log('handleBizCodeStatusChange', row);
    const params = {
      id: row.id,
      name: row.name,
      status: row.status
    };
    console.log(params);
    const res = await updateBizCode(params);
    if (res.code === 200) {
      if (row.status === '1') {
        proxy?.$modal.msgSuccess('启用成功');
      } else {
        proxy?.$modal.msgError('停用成功');
      }
    } else {
      proxy?.$modal.msgError(res.msg);
    }
  } finally {
    await getBizCodeList();
  }
};

/** 业务编码查看历史按钮操作 */
const handleBizCodeViewHistory = async (row: BizCodeVO) => {
  console.log('handleBizCodeViewHistory', row);
  const _id = row?.id;
  const res = await getBizCode(_id);
  Object.assign(row, res.data);
  const params = {
    title: '业务编码历史',
    row: row
  };
  bizCodeHistoryDialogRef.value?.acceptParams(params);
};

/** 业务编码生成按钮操作 */
const handleBizCodeGen = async (row: BizCodeVO) => {
  console.log('handleBizCodeGen', row);
  const res = await genBizCodeValue({ code: row.code });
  if (res.code === 200) {
    ElMessageBox.confirm('编码生成成功：' + res.data, '提示', {
      confirmButtonText: '确认并复制',
      cancelButtonText: '取消',
      type: 'success',
      center: true
    })
      .then(async () => {
        await copyText(res.data);
        ElMessage({
          type: 'success',
          message: '复制成功'
        });
      })
      .catch((e: any) => {
        console.log(e);
      });
  } else {
    proxy?.$modal.msgError(res.msg);
  }
};

/** 业务编码关闭逻辑 */
const handleBizCodeDialogClose = async () => {
  bizCodeLoading.value = true;
  await getBizCodeList();
  bizCodeLoading.value = false;
};

/** 业务编码搜索按钮操作 */
const handleBizCodeQuery = async () => {
  bizCodeQueryParams.value.pageNum = 1;
  await getBizCodeList();
  await getBizCodeRuleList();
};
/** 业务编码重置按钮操作 */
const resetBizCodeQuery = () => {
  bizCodeQueryFormRef.value?.resetFields();
  handleBizCodeQuery();
};

/** 业务编码行点击操作 */
const bizCodeRowClick = async (row: any) => {
  console.log('bizCodeRowClick', row);
  curBizCodeId.value = row.id;
  await getBizCodeRuleList();
};

/** 查询业务编码规则列表 */
const getBizCodeRuleList = async () => {
  console.log('getBizCodeRuleList');
  bizCodeRuleLoading.value = true;
  if (curBizCodeId.value) {
    bizCodeRuleQueryParams.value.bizCodeId = curBizCodeId.value;
  } else {
    // 无类型查询条件，则不显示
    bizCodeRuleList.value = [];
    bizCodeRuleTotal.value = 0;
    bizCodeRuleLoading.value = false;
    return;
  }
  const res = await pageListBizCodeRule(bizCodeRuleQueryParams.value);
  bizCodeRuleList.value = res.rows;
  bizCodeRuleTotal.value = res.total;
  bizCodeRuleLoading.value = false;
};

/** 业务编码规则新增按钮操作 */
const handleBizCodeRuleAdd = () => {
  // 序号处理
  const params = {
    title: '添加业务编码规则',
    row: {
      bizCodeId: bizCodeRuleQueryParams.value.bizCodeId,
      indexNum: bizCodeRuleList.value.length + 1
    }
  };
  bizCodeRuleDialogRef.value?.acceptParams(params);
};

/** 业务编码规则修改按钮操作 */
const handleBizCodeRuleUpdate = async (row: BizCodeRuleVO) => {
  console.log('handleBizCodeRuleUpdate', row);
  const _id = row?.id;
  const res = await getBizCodeRule(_id);
  Object.assign(row, res.data);
  const params = {
    title: '修改业务编码规则',
    row: row
  };
  bizCodeRuleDialogRef.value?.acceptParams(params);
};

/** 业务编码规则删除按钮操作 */
const handleBizCodeRuleDelete = async (row: BizCodeRuleVO) => {
  console.log('handleBizCodeRuleDelete', row);
  const _ids = row?.id;
  await proxy?.$modal.confirm('是否确认删除业务编码规则"' + row.indexNum + '"？').finally(() => console.log('删除业务编码规则完成！'));
  await delBizCodeRule(_ids);
  proxy?.$modal.msgSuccess('删除成功');
  await getBizCodeRuleList();
};

/** 业务编码规则关闭逻辑 */
const handleBizCodeRuleDialogClose = async () => {
  bizCodeRuleLoading.value = true;
  await getBizCodeRuleList();
  bizCodeRuleLoading.value = false;
};

/** 业务编码历史关闭逻辑 */
const handleBizCodeHistoryDialogClose = async () => {
  await getBizCodeList();
  await getBizCodeRuleList();
};

onMounted(async () => {
  // 初始化业务编码分组数据
  await getBizCodeGroupList();
  await getBizCodeList();
  await getBizCodeRuleList();
});
</script>
