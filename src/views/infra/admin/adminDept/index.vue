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
                <el-form-item label="部门名称" prop="deptName">
                  <el-input v-model="queryParams.deptName" placeholder="请输入部门名称" clearable style="width: 240px" @keyup.enter="handleQuery" />
                </el-form-item>
                <el-form-item label="部门编码" prop="deptCode">
                  <el-input v-model="queryParams.deptCode" placeholder="请输入部门编码" clearable style="width: 240px" @keyup.enter="handleQuery" />
                </el-form-item>
                <el-form-item label="部门类别" prop="deptCategory">
                  <el-select v-model="queryParams.deptCategory" placeholder="部门类别" clearable style="width: 200px">
                    <el-option v-for="dict in dept_category" :key="dict.value" :label="dict.label" :value="dict.value" />
                  </el-select>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                  <el-select v-model="queryParams.status" placeholder="部门状态" clearable>
                    <el-option v-for="dict in normal_disable" :key="dict.value" :label="dict.label" :value="dict.value" />
                  </el-select>
                </el-form-item>
                <br />
                <el-form-item style="margin-left: 20px">
                  <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
                  <el-button icon="Refresh" @click="resetQuery">重置</el-button>
                  <!-- 高级搜索组件 -->
                  <AdvancedSearch @search="handleAdvancedSearch" :fields="searchFields" title="用户高级搜索" />
                </el-form-item>
              </el-form>
            </el-collapse-item>
          </el-collapse>
        </el-card>
      </div>
    </transition>

    <el-card shadow="hover">
      <template #header>
        <el-row :gutter="10">
          <el-col :span="1.5">
            <el-button v-hasPermi="['adminAdmin:dept:add']" type="primary" plain icon="Plus" @click="handleAdd()">新增 </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="info" plain icon="Sort" @click="handleToggleExpandAll">展开/折叠</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @query-table="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table
        ref="deptTableRef"
        v-loading="loading"
        :data="deptList"
        row-key="deptId"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        :default-expand-all="isExpandAll"
        :expand-row-keys="expandRowKeys"
        border
        height="650"
      >
        <el-table-column prop="deptId" label="部门id" v-if="false"></el-table-column>
        <el-table-column prop="deptName" label="部门名称" width="400"></el-table-column>
        <el-table-column prop="deptCategory" align="center" label="部门类别">
          <template #default="scope">
            <dict-tag v-if="scope.row.deptCategory" :options="dept_category" :value="scope.row.deptCategory" />
          </template>
        </el-table-column>
        <el-table-column prop="deptCode" align="center" label="部门编码" width="300"></el-table-column>
        <!--        <el-table-column prop="phone" align="center" label="联系电话"></el-table-column>-->
        <!--        <el-table-column prop="email" align="center" label="邮箱"></el-table-column>-->
        <el-table-column prop="status" align="center" label="状态">
          <template #default="scope">
            <dict-tag :options="normal_disable" :value="scope.row.status" />
          </template>
        </el-table-column>
        <el-table-column prop="orderNum" align="center" label="排序" width="100"></el-table-column>
        <!--        <el-table-column label="创建时间" align="center" prop="createTime">-->
        <!--          <template #default="scope">-->
        <!--            <span>{{ proxy.parseTime(scope.row.createTime) }}</span>-->
        <!--          </template>-->
        <!--        </el-table-column>-->
        <el-table-column fixed="right" align="center" label="操作">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button v-hasPermi="['adminAdmin:dept:edit']" link type="primary" icon="Edit" @click="handleUpdate(scope.row)" />
            </el-tooltip>
            <el-tooltip content="新增" placement="top">
              <el-button v-hasPermi="['adminAdmin:dept:add']" link type="primary" icon="Plus" @click="handleAdd(scope.row)" />
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button v-hasPermi="['adminAdmin:dept:remove']" link type="primary" icon="Delete" @click="handleDelete(scope.row)" />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialog.visible" :title="dialog.title" destroy-on-close center draggable append-to-body width="600px">
      <el-form ref="deptFormRef" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col v-if="form.parentId !== 0" :span="24">
            <el-form-item label="上级部门" prop="parentId">
              <el-tree-select
                v-model="form.parentId"
                :data="deptOptions"
                :props="{ value: 'deptId', label: 'deptName', children: 'children' } as any"
                value-key="deptId"
                placeholder="选择上级部门"
                check-strictly
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门名称" prop="deptName">
              <el-input v-model="form.deptName" placeholder="请输入部门名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门类别" prop="deptCategory">
              <el-select v-model="form.deptCategory" placeholder="请选择">
                <el-option v-for="dict in dept_category" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门编码" prop="deptCode">
              <el-input v-model="form.deptCode" placeholder="请输入部门名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="orderNum">
              <el-input-number v-model="form.orderNum" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责人" prop="leader">
              <el-select v-model="form.leader" placeholder="请选择负责人">
                <el-option v-for="item in deptUserList" :key="item.userId" :label="`${item.nickName}`" :value="item.userId" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入联系电话" maxlength="11" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门状态">
              <el-radio-group v-model="form.status">
                <el-radio v-for="dict in normal_disable" :key="dict.value" :value="dict.value">{{ dict.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Dept" lang="ts">
import { listDept, getDept, delDept, addDept, updateDept, listDeptExcludeChild } from '@/api/infra/admin/adminDept';
import { DeptForm, DeptQuery, DeptVO } from '@/api/infra/admin/adminDept/types';
import { UserVO } from '@/api/infra/admin/adminUser/types';
import { listUserByDeptId } from '@/api/infra/admin/adminUser';
import { CaretRight } from '@element-plus/icons-vue';

interface DeptOptionsType {
  deptId: number | string;
  deptName: string;
  children: DeptOptionsType[];
}

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { normal_disable, dept_category } = toRefs<any>(proxy?.useDict('normal_disable', 'dept_category'));

const deptList = ref<DeptVO[]>([]);
const loading = ref(true);
const showSearch = ref(true);
const deptOptions = ref<DeptOptionsType[]>([]);
const isExpandAll = ref(false);
const deptUserList = ref<UserVO[]>([]);
const expandRowKeys = ref<any[]>([]);

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const deptTableRef = ref<ElTableInstance>();
const queryFormRef = ref<ElFormInstance>();
const deptFormRef = ref<ElFormInstance>();

const initFormData: DeptForm = {
  deptId: undefined,
  parentId: undefined,
  deptName: undefined,
  deptCategory: undefined,
  deptCode: undefined,
  orderNum: 0,
  leader: undefined,
  phone: undefined,
  email: undefined,
  status: '0'
};
const initData: PageData<DeptForm, DeptQuery> = {
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    deptName: undefined,
    deptCategory: undefined,
    deptCode: undefined,
    status: undefined
  },
  rules: {
    parentId: [{ required: true, message: '上级部门不能为空', trigger: 'blur' }],
    deptName: [{ required: true, message: '部门名称不能为空', trigger: 'blur' }],
    orderNum: [{ required: true, message: '显示排序不能为空', trigger: 'blur' }],
    email: [{ type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }],
    phone: [{ pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: '请输入正确的手机号码', trigger: 'blur' }]
  }
};
const data = reactive<PageData<DeptForm, DeptQuery>>(initData);

const { queryParams, form, rules } = toRefs<PageData<DeptForm, DeptQuery>>(data);

const activeNames = ref(['defaultSearch']);

/** 查询菜单列表 */
const getList = async () => {
  loading.value = true;
  const res = await listDept(queryParams.value);
  const data = proxy?.handleTree<DeptVO>(res.data, 'deptId');
  if (data) {
    // 设置默认展开行
    expandRowKeys.value = data.map((item) => {
      return String(item.deptId);
    });
    deptList.value = data;
  }
  setTimeout(() => {
    loading.value = false;
  }, 3000);
};

/** 查询当前部门的所有用户 */
async function getDeptAllUser(deptId: any) {
  if (deptId !== null && deptId !== '' && deptId !== undefined) {
    const res = await listUserByDeptId(deptId);
    deptUserList.value = res.data;
  }
}

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
};
/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  deptFormRef.value?.resetFields();
};

/** 搜索按钮操作 */
const handleQuery = () => {
  getList();
};
/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
};

/** 展开/折叠操作 */
const handleToggleExpandAll = () => {
  isExpandAll.value = !isExpandAll.value;
  toggleExpandAll(deptList.value, isExpandAll.value);
};
/** 展开/折叠所有 */
const toggleExpandAll = (data: DeptVO[], status: boolean) => {
  data.forEach((item) => {
    deptTableRef.value?.toggleRowExpansion(item, status);
    if (item.children && item.children.length > 0) toggleExpandAll(item.children, status);
  });
};

/** 新增按钮操作 */
const handleAdd = async (row?: DeptVO) => {
  reset();
  const res = await listDept();
  const data = proxy?.handleTree<DeptOptionsType>(res.data, 'deptId');
  if (data) {
    deptOptions.value = data;
    if (row && row.deptId) {
      form.value.parentId = row?.deptId;
    }
    dialog.visible = true;
    dialog.title = '添加部门';
  }
};

/** 修改按钮操作 */
const handleUpdate = async (row: DeptVO) => {
  reset();
  //查询当前部门所有用户
  getDeptAllUser(row.deptId);
  const res = await getDept(row.deptId);
  form.value = res.data;
  const response = await listDeptExcludeChild(row.deptId);
  const data = proxy?.handleTree<DeptOptionsType>(response.data, 'deptId');
  if (data) {
    deptOptions.value = data;
    if (data.length === 0) {
      const noResultsOptions: DeptOptionsType = {
        deptId: res.data.parentId,
        deptName: res.data.parentName,
        children: []
      };
      deptOptions.value.push(noResultsOptions);
    }
  }
  dialog.visible = true;
  dialog.title = '修改部门';
};
/** 提交按钮 */
const submitForm = () => {
  deptFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      form.value.deptId ? await updateDept(form.value) : await addDept(form.value);
      proxy?.$modal.msgSuccess('操作成功');
      dialog.visible = false;
      await getList();
    }
  });
};
/** 删除按钮操作 */
const handleDelete = async (row: DeptVO) => {
  await proxy?.$modal.confirm('是否确认删除名称为"' + row.deptName + '"的数据项?');
  await delDept(row.deptId);
  await getList();
  proxy?.$modal.msgSuccess('删除成功');
};

onMounted(() => {
  getList();
});

import AdvancedSearch, { type SearchCondition, type SearchField } from '@/components/AdvancedSearch/index.vue';
import { jsonToHexUpperCase } from '@/utils/common';

// 定义搜索字段配置 - 通过props传递给高级搜索组件
const searchFields: SearchField[] = [
  {
    label: '部门名称',
    value: 'deptName',
    type: 'text',
    operators: ['eq', 'like'],
    placeholder: '请输入部门名称'
  },
  {
    label: '部门编码',
    value: 'deptCode',
    type: 'text',
    operators: ['eq', 'like'],
    placeholder: '请输入部门编码'
  },
  {
    label: '部门类别',
    value: 'deptCategory',
    type: 'select',
    operators: ['eq'],
    options: [
      { label: '集团', value: 'group' },
      { label: '公司', value: 'company' },
      { label: '子公司', value: 'subcompany' },
      { label: '部门', value: 'department' },
      { label: '科室', value: 'office' }
    ],
    placeholder: '请选择部门类别'
  },
  {
    label: '状态',
    value: 'status',
    type: 'select',
    operators: ['eq'],
    options: [
      { label: '正常', value: '0' },
      { label: '停用', value: '1' }
    ],
    placeholder: '请选择状态'
  }
];

// 处理高级搜索
const handleAdvancedSearch = async (params: { conditions: SearchCondition[] }) => {
  try {
    // 清空已有搜索条件
    queryFormRef.value?.resetFields();
    // 赋值
    console.log('高级搜索 params', params);
    queryParams.value.conditionsStr = jsonToHexUpperCase(JSON.stringify(params.conditions));
    await getList();
  } catch (error) {
    ElMessage.error('搜索失败: ' + (error instanceof Error ? error.message : String(error)));
  }
};
</script>
