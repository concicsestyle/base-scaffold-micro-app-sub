<template>
  <div>
    <el-dialog v-model="showDialog" center title="分配角色" destroy-on-close close-on-click-modal draggable width="1200px" @close="closeDialog">
      <el-card shadow="hover">
        <template #header>
          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button type="primary" plain icon="Plus" @click="handleAdd">新增</el-button>
            </el-col>
          </el-row>
        </template>
        <el-table :data="userRoleArr">
          <el-table-column label="角色" align="center" prop="role.roleName" width="200">
            <template #default="scope">
              <span>{{ scope.row.role.roleName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="部门" align="center" prop="deptList">
            <template #default="scope">
              <span>{{ formatDept(scope.row.deptList) }}</span>
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
    <el-dialog :title="dialog.title" v-model="dialog.visible" draggable width="500px" center append-to-body>
      <el-form ref="userDeptFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="角色" prop="roleId">
          <el-select v-model="form.roleId" filterable placeholder="请选择">
            <el-option v-for="item in roleAllList" :key="item.roleId" :label="item.roleName" :value="item.roleId"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门" prop="deptIdList">
          <el-tree-select
            v-model="form.deptIdList"
            :data="deptOptions"
            :props="{ value: 'deptId', label: 'deptName', children: 'children' } as any"
            value-key="deptId"
            placeholder="选择部门"
            check-strictly
            multiple
          />
        </el-form-item>
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

<script setup lang="ts" name="AssignDept">
import { userRoleList, addOrUpdateUserRole, delUserRole } from '@/api/infra/admin/adminUser';
import { listDept } from '@/api/infra/admin/adminDept';
import { UserVO } from '@/api/infra/admin/adminUser/types';
import { listRoleAll } from '@/api/infra/admin/adminRole';
import { RoleVO } from '@/api/infra/admin/adminRole/types';

interface DeptOptionsType {
  deptId: number | string;
  deptName: string;
  children: DeptOptionsType[];
}
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const deptOptions = ref<DeptOptionsType[]>([]);
const showDialog = ref(false);
const userRoleArr = ref<any[]>();
const curUser = ref<UserVO>();

const userDeptFormRef = ref<ElFormInstance>();
const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const roleAllList = ref<RoleVO[]>([]);

const form = ref({
  userId: undefined,
  roleId: undefined,
  oldRoleId: undefined,
  deptIdList: undefined
});

const rules = ref({
  userId: [{ required: true, message: '用户ID不能为空', trigger: 'blur' }],
  roleId: [{ required: true, message: '角色ID不能为空', trigger: 'blur' }]
});

const getList = async (row: any) => {
  const userRoleListRes = await userRoleList({ userId: row.userId });
  userRoleArr.value = userRoleListRes.data;
};

// 弹窗打开
const openDialog = async (row: UserVO) => {
  console.log(row);
  curUser.value = row;
  proxy?.$modal.loading('加载中...');
  roleAllList.value = (await listRoleAll()).data;
  await getList(curUser.value);
  console.log(userRoleArr.value);
  proxy?.$modal.closeLoading();
  showDialog.value = true;
};

// 弹窗关闭
const closeDialog = () => {
  showDialog.value = false;
};

/** 格式化部门 */
const formatDept = (list: any[]) => {
  if (!list || list.length === 0) {
    return '- -';
  }
  return list.map((item: any) => item.deptName).join(',');
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
    roleId: undefined,
    oldRoleId: undefined,
    deptIdList: undefined
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
  form.value.oldRoleId = row.roleId;
  Object.assign(form.value, row);
  dialog.visible = true;
  dialog.title = '修改';
};

/** 提交按钮 */
const submitForm = () => {
  userDeptFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      if (dialog.title === '修改') {
        await addOrUpdateUserRole(form.value);
      } else {
        await addOrUpdateUserRole(form.value);
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
  await delUserRole({ userId: row.userId, roleId: row.roleId });
  proxy?.$modal.msgSuccess('删除成功');
  await getList(curUser.value);
};

// 暴露变量
defineExpose({
  openDialog
});
</script>

<style lang="scss" scoped></style>
