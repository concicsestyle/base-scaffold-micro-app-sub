<template>
  <div>
    <el-dialog v-model="showDialog" center title="分配部门" destroy-on-close close-on-click-modal draggable width="1200px" @close="closeDialog">
      <el-card shadow="hover">
        <template #header>
          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button type="primary" plain icon="Plus" @click="handleAdd">新增</el-button>
            </el-col>
          </el-row>
        </template>
        <el-table :data="userDeptArr">
          <el-table-column label="部门" align="center" prop="dept.deptName" width="300">
            <template #default="scope">
              <span>{{ scope.row.dept.deptName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="排序" align="center" prop="sort" />
          <el-table-column label="专职/兼职" align="center" prop="createTime">
            <template #default="scope">
              <span>{{ scope.row.fullTimeFlag === 1 ? '专职' : '兼职' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" align="center" class-name="small-padding fixed-width">
            <template #default="scope">
              <el-tooltip content="修改" placement="top">
                <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"></el-button>
              </el-tooltip>
              <el-tooltip content="删除" placement="top">
                <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-dialog>

    <!-- 添加或修改管理端-用户部门关联对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" center draggable append-to-body>
      <el-form ref="userDeptFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="部门" prop="deptId">
          <el-tree-select
            v-model="form.deptId"
            :data="deptOptions"
            :props="{ value: 'deptId', label: 'deptName', children: 'children' } as any"
            value-key="deptId"
            placeholder="选择部门"
            check-strictly
          />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" placeholder="请输入排序" />
        </el-form-item>
        <el-form-item label="专职标识" prop="fullTimeFlag">
          <el-select v-model="form.fullTimeFlag" filterable placeholder="请选择">
            <el-option v-for="item in fullTimeFlagOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="AssignDept">
import { userDeptList, updateUserDept, addUserDept, delUserDept } from '@/api/infra/admin/adminUser';
import { listDept } from '@/api/infra/admin/adminDept';
import { UserVO } from '@/api/infra/admin/adminUser/types';

interface DeptOptionsType {
  deptId: number | string;
  deptName: string;
  children: DeptOptionsType[];
}
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const deptOptions = ref<DeptOptionsType[]>([]);
const showDialog = ref(false);
const userDeptArr = ref<any[]>();
const curUser = ref<UserVO>();

const userDeptFormRef = ref<ElFormInstance>();
const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const fullTimeFlagOptions = [
  {
    value: 1,
    label: '专职'
  },
  {
    value: 0,
    label: '兼职'
  }
];

const form = ref({
  userId: undefined,
  deptId: undefined,
  oldDeptId: undefined,
  sort: 1,
  fullTimeFlag: undefined
});

const rules = ref({
  userId: [{ required: true, message: '用户ID不能为空', trigger: 'blur' }],
  deptId: [{ required: true, message: '部门不能为空', trigger: 'blur' }],
  fullTimeFlag: [{ required: true, message: '专职/兼职不能为空', trigger: 'blur' }]
});

const getList = async (row: any) => {
  const userDeptListRes = await userDeptList({ userId: row.userId });
  userDeptArr.value = userDeptListRes.data;
};

// 弹窗打开
const openDialog = async (row: UserVO) => {
  console.log(row);
  curUser.value = row;
  proxy?.$modal.loading('加载中...');
  await getList(curUser.value);
  console.log(userDeptArr.value);
  proxy?.$modal.closeLoading();
  showDialog.value = true;
};

// 弹窗关闭
const closeDialog = () => {
  showDialog.value = false;
};

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
};

/** 表单重置 */
const reset = () => {
  form.value = {
    userId: undefined,
    deptId: undefined,
    oldDeptId: undefined,
    sort: 1,
    fullTimeFlag: undefined
  };
  userDeptFormRef.value?.resetFields();
};

/** 新增按钮操作 */
const handleAdd = async () => {
  const res = await listDept({ ignoreDataPermissionFlag: 1 });
  const data = proxy?.handleTree<DeptOptionsType>(res.data, 'deptId');
  if (data) {
    deptOptions.value = data;
  }
  reset();
  form.value.userId = curUser.value.userId;
  dialog.visible = true;
  dialog.title = '新增';
};

/** 修改按钮操作 */
const handleUpdate = async (row?: any) => {
  const res = await listDept({ ignoreDataPermissionFlag: 1 });
  const data = proxy?.handleTree<DeptOptionsType>(res.data, 'deptId');
  if (data) {
    deptOptions.value = data;
  }
  reset();
  form.value.oldDeptId = row.deptId;
  Object.assign(form.value, row);
  dialog.visible = true;
  dialog.title = '修改';
};

/** 提交按钮 */
const submitForm = () => {
  userDeptFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      if (dialog.title === '修改') {
        await updateUserDept(form.value);
      } else {
        await addUserDept(form.value);
      }
      proxy?.$modal.msgSuccess('操作成功');
      dialog.visible = false;
      await getList(curUser.value);
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: any) => {
  await proxy?.$modal.confirm('是否确认删除？');
  await delUserDept({ userId: row.userId, deptId: row.deptId });
  proxy?.$modal.msgSuccess('删除成功');
  await getList(curUser.value);
};

// 暴露变量
defineExpose({
  openDialog
});
</script>

<style lang="scss" scoped></style>
