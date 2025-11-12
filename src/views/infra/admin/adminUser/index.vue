<template>
  <div class="p-2">
    <el-row :gutter="20">
      <!-- 部门树 -->
      <el-col :lg="5" :xs="24">
        <el-card shadow="hover" style="height: 800px">
          <el-input style="margin-top: 10px" v-model="deptName" placeholder="请输入部门名称" prefix-icon="Search" clearable />
          <el-tree
            ref="deptTreeRef"
            class="mt-2"
            node-key="id"
            :data="deptOptions"
            :props="{ label: 'label', children: 'children' }"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            highlight-current
            :default-expanded-keys="defaultExpandedKeys"
            @node-click="handleNodeClick"
          >
            <template #default="{ data }">
              <div class="flex items-center justify-center gap-2" style="font-size: 14px">
                <div class="flex items-center flex-1 max-w-[250px] overflow-hidden">
                  <el-icon
                    @click="chooseCurDept($event, data)"
                    :size="12"
                    :class="chooseCurDeptId === data.id ? 'choose-cur-dept' : ''"
                    style="margin-right: 5px"
                  ><OfficeBuilding
                  /></el-icon>
                  <el-tooltip effect="dark" :content="data?.detail?.deptName" placement="top-start">
                    <span class="whitespace-nowrap overflow-hidden text-ellipsis">
                      {{ data?.detail?.deptName }}
                    </span>
                  </el-tooltip>
                </div>
              </div>
            </template>
          </el-tree>
        </el-card>
      </el-col>
      <el-col :lg="19" :xs="24">
        <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
          <div v-show="showSearch" class="mb-[10px]">
            <el-card shadow="hover">
              <el-collapse v-model="activeNames" :expand-icon-position="'left'">
                <el-collapse-item name="defaultSearch" :icon="CaretRight">
                  <template #title="{ isActive }">
                    <div :class="['title-wrapper', { 'is-active': isActive }]">搜索条件</div>
                  </template>
                  <el-form ref="queryFormRef" :model="queryParams" :inline="true">
                    <!--                    <el-form-item label="工号" prop="staffCode" label-width="40px">-->
                    <!--                      <el-input v-model="queryParams.staffCode" placeholder="请输入工号" clearable style="width: 150px" @keyup.enter="handleQuery" />-->
                    <!--                    </el-form-item>-->
                    <el-form-item label="手机号码" prop="phone">
                      <el-input v-model="queryParams.phone" placeholder="请输入手机号码" clearable style="width: 150px" @keyup.enter="handleQuery" />
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                      <el-input v-model="queryParams.email" placeholder="请输入邮箱" clearable style="width: 150px" @keyup.enter="handleQuery" />
                    </el-form-item>
                    <el-form-item label="状态" prop="status">
                      <el-select v-model="queryParams.status" placeholder="用户状态" clearable style="width: 150px">
                        <el-option v-for="dict in normal_disable" :key="dict.value" :label="dict.label" :value="dict.value" />
                      </el-select>
                    </el-form-item>
                    <el-form-item>
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
                <el-button v-has-permi="['adminAdmin:user:add']" type="primary" plain icon="Plus" @click="handleAdd()">新增</el-button>
              </el-col>
              <el-col :span="1.5" v-if="checkRole(['superAdmin', 'admin'])">
                <el-button type="warning" plain icon="Refresh" @click="syncBasePlatformInfo()">数据同步</el-button>
              </el-col>
              <!--              <el-col :span="1.5">-->
              <!--                <el-button v-has-permi="['adminAdmin:user:edit']" type="success" plain :disabled="single" icon="Edit" @click="handleUpdate()">-->
              <!--                  修改-->
              <!--                </el-button>-->
              <!--              </el-col>-->
              <!--              <el-col :span="1.5">-->
              <!--                <el-button v-has-permi="['adminAdmin:user:remove']" type="danger" plain :disabled="multiple" icon="Delete" @click="handleDelete()">-->
              <!--                  删除-->
              <!--                </el-button>-->
              <!--              </el-col>-->
              <el-col :span="1.5">
                <el-dropdown class="mt-[1px]">
                  <el-button plain type="info">
                    更多
                    <el-icon class="el-icon--right"><arrow-down /></el-icon
                    ></el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item icon="Download" @click="importTemplate">下载模板</el-dropdown-item>
                      <!-- 注意 由于el-dropdown-item标签是延迟加载的 所以v-has-permi自定义标签不生效 需要使用v-if调用方法执行 -->
                      <el-dropdown-item v-if="checkPermi(['adminAdmin:user:import'])" icon="Top" @click="handleImport">导入数据</el-dropdown-item>
                      <el-dropdown-item v-if="checkPermi(['adminAdmin:user:export'])" icon="Download" @click="handleExport"
                      >导出数据</el-dropdown-item
                      >
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </el-col>
              <right-toolbar v-model:showSearch="showSearch" :columns="columns" :search="true" @query-table="getList"></right-toolbar>
            </el-row>
          </template>

          <el-table
            v-loading="loading"
            :data="userList"
            @selection-change="handleSelectionChange"
            @sort-change="handleSortChange"
            border
            height="600"
          >
            <!--            <el-table-column type="selection" width="50" align="center" />-->
            <el-table-column v-if="columns[0].visible" key="userId" label="用户id" align="center" prop="userId" width="100" />
            <el-table-column v-if="columns[1].visible" key="userName" label="用户名" align="center" prop="userName" :show-overflow-tooltip="true" />
            <el-table-column
              v-if="columns[2].visible"
              key="nickName"
              label="姓名/昵称"
              align="center"
              prop="nickName"
              :show-overflow-tooltip="true"
              sortable="custom"
              :sort-orders="['descending', 'ascending']"
            >
              <template #header>
                <el-tag style="margin-right: 5px" v-show="queryParams.nickName" @close="closeColumnSearch($event, '姓名/昵称', 'nickName')" closable>
                  {{ queryParams.nickName }}
                </el-tag>
                <el-icon v-show="!queryParams.nickName" class="caret-wrapper" @click="showColumnSearch($event, '姓名/昵称', 'nickName')"
                ><Search
                /></el-icon>
                <span>姓名/昵称</span>
              </template>
              <template #default="scope">
                <span>{{ scope.row.nickName }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="columns[3].visible" key="deptName" label="部门" align="center" prop="deptName" width="200">
              <template #default="scope">
                <el-popover trigger="click" width="600">
                  <template #reference>
                    <el-link type="primary" :underline="false" style="font-size: 12px">{{ formatUserDeptName(scope.row) }}</el-link>
                  </template>
                  <div>
                    <el-table :data="scope.row.userDeptList" width="600" border>
                      <el-table-column label="部门id" prop="deptId" align="center" width="100" />
                      <el-table-column label="部门名称" prop="dept.deptName" align="center" width="300">
                        <template #default="item">
                          <el-link type="primary" :underline="false" style="font-size: 12px">{{ item.row.dept.deptName }}</el-link>
                        </template>
                      </el-table-column>
                      <el-table-column label="排序" prop="sort" align="center" width="50" />
                      <el-table-column label="全职/兼职" prop="fullTimeFlag" align="center" width="150">
                        <template #default="item">
                          <el-tag :type="item.row.fullTimeFlag === 1 ? 'success' : 'info'">{{
                              item.row.fullTimeFlag === 1 ? '全职' : '兼职'
                            }}</el-tag>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column
              v-if="columns[4].visible"
              key="staffCode"
              label="工号"
              align="center"
              prop="staffCode"
              sortable="custom"
              :sort-orders="['descending', 'ascending']"
            >
              <template #header>
                <el-tag style="margin-right: 5px" v-show="queryParams.staffCode" @close="closeColumnSearch($event, '工号', 'staffCode')" closable>
                  {{ queryParams.staffCode }}
                </el-tag>
                <el-icon v-show="!queryParams.staffCode" class="caret-wrapper" @click="showColumnSearch($event, '工号', 'staffCode')"
                ><Search
                /></el-icon>
                <span>工号</span>
              </template>
              <template #default="scope">
                <span>{{ scope.row.staffCode }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="columns[5].visible" key="phone" label="手机号码" align="center" prop="phone">
              <!--              <template #header>-->
              <!--                <el-tag style="margin-right: 5px" v-show="queryParams.phone" @close="closeColumnSearch($event, '手机号码', 'phone')" closable>-->
              <!--                  {{ queryParams.phone }}-->
              <!--                </el-tag>-->
              <!--                <el-icon v-show="!queryParams.phone" class="caret-wrapper" @click="showColumnSearch($event, '手机号码', 'phone')"><Search /></el-icon>-->
              <!--                <span>手机号码</span>-->
              <!--              </template>-->
              <template #default="scope">
                <span>{{ desensitize(scope.row.phone, { type: 'phone' }) }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="columns[6].visible" key="email" label="邮箱" align="center" prop="email">
              <template #default="scope">
                <span v-if="scope.row.email">{{ desensitize(scope.row.email, { type: 'email' }) }}</span>
                <span v-else>- -</span>
              </template>
            </el-table-column>
            <el-table-column v-if="columns[7].visible" key="status" v-hasPermi="['adminAdmin:user:edit']" label="状态" align="center">
              <template #default="scope">
                <el-switch v-model="scope.row.status" active-value="0" inactive-value="1" @change="handleStatusChange(scope.row)"></el-switch>
              </template>
            </el-table-column>
            <el-table-column v-if="columns[8].visible" key="loginTime" label="最近登录时间" align="center" width="140">
              <template #default="scope">
                <span v-if="scope.row.loginTime">{{ scope.row.loginTime }}</span>
                <span v-else>- -</span>
              </template>
            </el-table-column>

            <!--            <el-table-column v-if="columns[8].visible" label="创建时间" align="center" prop="createTime" width="200">-->
            <!--              <template #default="scope">-->
            <!--                <span>{{ scope.row.createTime }}</span>-->
            <!--              </template>-->
            <!--            </el-table-column>-->

            <el-table-column
              v-hasPermi="['adminAdmin:user:edit']"
              label="操作"
              fixed="right"
              align="center"
              width="180"
              class-name="small-padding fixed-width"
            >
              <template #default="scope">
                <el-tooltip v-if="scope.row.userId !== 1" content="修改" placement="top">
                  <el-button v-hasPermi="['adminAdmin:user:edit']" link type="primary" icon="Edit" @click="handleUpdate(scope.row)"></el-button>
                </el-tooltip>
                <el-tooltip v-if="scope.row.userId !== 1" content="删除" placement="top">
                  <el-button v-hasPermi="['adminAdmin:user:remove']" link type="primary" icon="Delete" @click="handleDelete(scope.row)"></el-button>
                </el-tooltip>

                <el-tooltip v-if="scope.row.userId !== 1" content="重置密码" placement="top">
                  <el-button v-hasPermi="['adminAdmin:user:resetPwd']" link type="primary" icon="Key" @click="handleResetPwd(scope.row)"></el-button>
                </el-tooltip>

                <el-tooltip v-if="checkRole(['superAdmin', 'admin']) && scope.row.userId !== 1" content="同步基础平台用户信息" placement="top">
                  <el-button link type="primary" icon="Refresh" @click="syncBasePlatformUserInfo(scope.row)"></el-button>
                </el-tooltip>

                <el-tooltip v-if="scope.row.userId !== 1" content="分配角色" placement="top">
                  <el-button link type="primary" icon="UserFilled" @click="handleAssignRole(scope.row)"></el-button>
                </el-tooltip>

                <el-tooltip v-if="scope.row.userId !== 1" content="分配部门" placement="top">
                  <el-button link type="primary" icon="Histogram" @click="handleAssignDept(scope.row)"></el-button>
                </el-tooltip>

                <!--                <el-tooltip v-if="scope.row.userId !== 1" content="分配角色" placement="top">-->
                <!--                  <el-button-->
                <!--                    v-hasPermi="['adminAdmin:user:edit']"-->
                <!--                    link-->
                <!--                    type="primary"-->
                <!--                    icon="CircleCheck"-->
                <!--                    @click="handleAuthRole(scope.row)"-->
                <!--                  ></el-button>-->
                <!--                </el-tooltip>-->
              </template>
            </el-table-column>
          </el-table>

          <pagination v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" :total="total" @pagination="getList" />
        </el-card>
      </el-col>
    </el-row>

    <!-- 添加或修改用户配置对话框 -->
    <el-dialog
      ref="formDialogRef"
      v-model="dialog.visible"
      :title="dialog.title"
      width="800px"
      center
      draggable
      overflow
      append-to-body
      @close="closeDialog"
      :fullscreen="isFullscreen"
    >
      <template #header>
        <div class="dialog-header">
          <span class="dialog-title">{{ dialog.title }}</span>
          <el-button @click="isFullscreen = !isFullscreen">{{ isFullscreen ? '退出全屏' : '全屏' }}</el-button>
        </div>
      </template>
      <el-form ref="userFormRef" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item v-if="form.userId == undefined" label="用户名称" prop="userName">
              <el-input v-model="form.userName" placeholder="请输入用户名称" maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.userId == undefined" label="用户密码" prop="password">
              <el-input v-model="form.password" placeholder="请输入用户密码" type="password" maxlength="20" show-password />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户昵称" prop="nickName">
              <el-input v-model="form.nickName" placeholder="请输入用户昵称" maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户性别">
              <el-select v-model="form.sex" placeholder="请选择">
                <el-option v-for="dict in user_sex" :key="dict.value" :label="dict.label" :value="parseInt(dict.value)"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="工号" prop="staffCode">
              <el-input v-model="form.staffCode" placeholder="请输入工号" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="集团工号" prop="groupStaffCode">
              <el-input v-model="form.groupStaffCode" placeholder="请输入集团工号" maxlength="50" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入手机号码" maxlength="11" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item v-if="form.userId == undefined" label="部门" prop="deptId">
              <el-tree-select
                v-model="form.deptId"
                :data="enabledDeptOptions"
                :props="{ value: 'id', label: 'label', children: 'children' } as any"
                value-key="id"
                placeholder="请选择部门（仅初始化时生效）"
                check-strictly
                @change="handleDeptChange"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.userId == undefined" label="角色" prop="roleIds">
              <el-select v-model="form.roleIds" filterable multiple placeholder="请选择角色（仅初始化时生效）">
                <el-option
                  v-for="item in roleOptions"
                  :key="item.roleId"
                  :label="item.roleName"
                  :value="item.roleId"
                  :disabled="item.status == '1'"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio v-for="dict in normal_disable" :key="dict.value" :value="dict.value">{{ dict.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <!--        <el-row>-->
        <!--          <el-col :span="12">-->
        <!--            <el-form-item label="岗位">-->
        <!--              <el-select v-model="form.postIds" multiple placeholder="请选择">-->
        <!--                <el-option-->
        <!--                  v-for="item in postOptions"-->
        <!--                  :key="item.postId"-->
        <!--                  :label="item.postName"-->
        <!--                  :value="item.postId"-->
        <!--                  :disabled="item.status == '1'"-->
        <!--                ></el-option>-->
        <!--              </el-select>-->
        <!--            </el-form-item>-->
        <!--          </el-col>-->
        <!--          <el-col :span="12">-->
        <!--            <el-form-item label="角色" prop="roleIds">-->
        <!--              <el-select v-model="form.roleIds" filterable multiple placeholder="请选择">-->
        <!--                <el-option-->
        <!--                  v-for="item in roleOptions"-->
        <!--                  :key="item.roleId"-->
        <!--                  :label="item.roleName"-->
        <!--                  :value="item.roleId"-->
        <!--                  :disabled="item.status == '1'"-->
        <!--                ></el-option>-->
        <!--              </el-select>-->
        <!--            </el-form-item>-->
        <!--          </el-col>-->
        <!--        </el-row>-->
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancel()">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 用户导入对话框 -->
    <el-dialog v-model="upload.open" :title="upload.title" width="400px" center draggable overflow append-to-body>
      <el-upload
        ref="uploadRef"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <el-icon class="el-icon--upload">
          <i-ep-upload-filled />
        </el-icon>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <template #tip>
          <div class="text-center el-upload__tip">
            <div class="el-upload__tip"><el-checkbox v-model="upload.updateSupport" />是否更新已经存在的用户数据</div>
            <span>仅允许导入xls、xlsx格式文件。</span>
            <el-link type="primary" :underline="false" style="font-size: 12px; vertical-align: baseline" @click="importTemplate">下载模板</el-link>
          </div>
        </template>
      </el-upload>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitFileForm">确 定</el-button>
          <el-button @click="upload.open = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>
    <assign-role ref="assignRoleRef" />
    <assign-dept ref="assignDeptRef" />
  </div>
</template>

<script setup name="AdminUser" lang="ts">
import api from '@/api/infra/admin/adminUser';
import { syncAllOrgRelationInfo, syncUserDetailInfoByUserId } from '@/api/infra/platform/basePlatform';
import { UserForm, UserQuery, UserVO } from '@/api/infra/admin/adminUser/types';
import { DeptTreeVO, DeptVO } from '@/api/infra/admin/adminDept/types';
import { RoleVO } from '@/api/infra/admin/adminRole/types';
import { PostQuery, PostVO } from '@/api/infra/admin/adminPost/types';
import { treeselect } from '@/api/infra/admin/adminDept';
import { globalBaseUrl, globalHeaders } from '@/utils/request';
import { to } from 'await-to-js';
import { optionselect } from '@/api/infra/admin/adminPost';
import { hasPermi } from '@/directive/permission';
import { checkPermi, checkRole } from '@/utils/permission';
import AssignRole from './components/assignRole.vue';
import AssignDept from './components/assignDept.vue';
import { Action } from 'element-plus';
import { desensitize } from '@/utils/desensitize';

const activeNames = ref(['defaultSearch']);
const isFullscreen = ref(false);
import { CaretRight, Delete } from '@element-plus/icons-vue';

const router = useRouter();
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const assignRoleRef = ref<InstanceType<typeof AssignRole>>();
const assignDeptRef = ref<InstanceType<typeof AssignDept>>();
const { normal_disable, user_sex } = toRefs<any>(proxy?.useDict('normal_disable', 'user_sex'));
const userList = ref<UserVO[]>();
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<number | string>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const dateRange = ref<[DateModelType, DateModelType]>(['', '']);
const deptName = ref('');
const deptOptions = ref<DeptTreeVO[]>([]);
const enabledDeptOptions = ref<DeptTreeVO[]>([]);
const initPassword = ref<string>('');
const postOptions = ref<PostVO[]>([]);
const roleOptions = ref<RoleVO[]>([]);
const defaultExpandedKeys = ref<any[]>([]);
const chooseCurDeptId = ref(undefined);
const curDeptId = ref<any>();
/*** 用户导入参数 */
const upload = reactive<ImportOption>({
  // 是否显示弹出层（用户导入）
  open: false,
  // 弹出层标题（用户导入）
  title: '',
  // 是否禁用上传
  isUploading: false,
  // 是否更新已经存在的用户数据
  updateSupport: 0,
  // 设置上传的请求头部
  headers: globalHeaders(),
  // 上传的地址
  url: globalBaseUrl() + 'infra/admin/admin/user/importData'
});
// 列显隐信息
const columns = ref<FieldOption[]>([
  { key: 0, label: `用户编号`, visible: true, children: [] },
  { key: 1, label: `用户名称`, visible: false, children: [] },
  { key: 2, label: `用户昵称`, visible: true, children: [] },
  { key: 3, label: `部门`, visible: true, children: [] },
  { key: 4, label: `工号`, visible: true, children: [] },
  { key: 5, label: `手机号码`, visible: true, children: [] },
  { key: 6, label: `邮箱`, visible: true, children: [] },
  { key: 7, label: `状态`, visible: true, children: [] },
  { key: 8, label: `最近登录时间`, visible: true, children: [] }
]);

const deptTreeRef = ref<ElTreeInstance>();
const queryFormRef = ref<ElFormInstance>();
const userFormRef = ref<ElFormInstance>();
const uploadRef = ref<ElUploadInstance>();
const formDialogRef = ref<ElDialogInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: UserForm = {
  userId: undefined,
  deptId: undefined,
  userName: '',
  nickName: undefined,
  password: '',
  phone: undefined,
  email: undefined,
  sex: undefined,
  status: '0',
  remark: '',
  postIds: [],
  roleIds: [],
  dealRoleRelationFlag: 0,
  staffCode: undefined,
  groupStaffCode: undefined
};

const initData: PageData<UserForm, UserQuery> = {
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    userName: '',
    nickName: '',
    phone: '',
    email: '',
    status: '',
    deptId: '',
    roleId: '',
    staffCode: '',
    groupStaffCode: '',
    containSubDeptFlag: 0
  },
  rules: {
    userName: [
      { required: true, message: '用户名称不能为空', trigger: 'blur' },
      {
        min: 2,
        max: 20,
        message: '用户名称长度必须介于 2 和 20 之间',
        trigger: 'blur'
      }
    ],
    nickName: [{ required: true, message: '用户昵称不能为空', trigger: 'blur' }],
    password: [
      { required: true, message: '用户密码不能为空', trigger: 'blur' },
      {
        min: 5,
        max: 20,
        message: '用户密码长度必须介于 5 和 20 之间',
        trigger: 'blur'
      },
      { pattern: /^[^<>"'|\\]+$/, message: '不能包含非法字符：< > " \' \\ |', trigger: 'blur' }
    ],
    email: [
      {
        type: 'email',
        message: '请输入正确的邮箱地址',
        trigger: ['blur', 'change']
      }
    ],
    phone: [
      {
        pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
        message: '请输入正确的手机号码',
        trigger: 'blur'
      }
    ]
    // roleIds: [{ required: true, message: '用户角色不能为空', trigger: 'blur' }]
  }
};
const data = reactive<PageData<UserForm, UserQuery>>(initData);

const { queryParams, form, rules } = toRefs<PageData<UserForm, UserQuery>>(data);

/** 通过条件过滤节点  */
const filterNode = (value: string, data: any) => {
  if (!value) return true;
  return data.label.indexOf(value) !== -1;
};
/** 根据名称筛选部门树 */
watchEffect(
  () => {
    deptTreeRef.value?.filter(deptName.value);
  },
  {
    flush: 'post' // watchEffect会在DOM挂载或者更新之前就会触发，此属性控制在DOM元素更新后运行
  }
);

/** 查询用户列表 */
const getList = async () => {
  loading.value = true;
  const res = await api.listUser(proxy?.addDateRange(queryParams.value, dateRange.value));
  loading.value = false;
  userList.value = res.rows;
  total.value = res.total;
};

/** 查询部门下拉树结构 */
const getDeptTree = async () => {
  const res = await api.deptTreeSelect();
  deptOptions.value = res.data;
  // 设置默认展开的部门
  deptOptions.value?.forEach((item) => {
    defaultExpandedKeys.value.push(item.id);
  });
  enabledDeptOptions.value = filterDisabledDept(res.data);
};

/** 过滤禁用的部门 */
const filterDisabledDept = (deptList: DeptTreeVO[]) => {
  return deptList.filter((dept) => {
    if (dept.disabled) {
      return false;
    }
    if (dept.children && dept.children.length) {
      dept.children = filterDisabledDept(dept.children);
    }
    return true;
  });
};

/** 节点单击事件 */
const handleNodeClick = (data: DeptVO) => {
  // 判断当前节点是否被选中
  if (curDeptId.value === data.id) {
    // 取消选中
    deptTreeRef.value.setCurrentKey(null);
    curDeptId.value = undefined;
    chooseCurDeptId.value = undefined;
    queryParams.value.deptId = undefined;
    queryParams.value.containSubDeptFlag = 1;
    handleQuery();
  } else {
    curDeptId.value = data.id;
    chooseCurDeptId.value = undefined;
    queryParams.value.deptId = data.id;
    queryParams.value.containSubDeptFlag = 1;
    handleQuery();
  }
};

const chooseCurDept = (e: any, data: DeptTreeVO) => {
  e.stopPropagation();
  console.log(data.id);
  deptTreeRef.value.setCurrentKey(data.id);
  curDeptId.value = data.id;
  queryParams.value.deptId = data.id;
  if (chooseCurDeptId.value) {
    if (chooseCurDeptId.value === data.id) {
      chooseCurDeptId.value = undefined;
      queryParams.value.containSubDeptFlag = 1;
    } else {
      chooseCurDeptId.value = data.id;
      queryParams.value.containSubDeptFlag = 0;
    }
  } else {
    chooseCurDeptId.value = data.id;
    queryParams.value.containSubDeptFlag = 0;
  }
  handleQuery();
};

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  // 清空高级搜索
  queryParams.value.conditionsStr = undefined;
  getList();
};
/** 重置按钮操作 */
const resetQuery = () => {
  dateRange.value = ['', ''];
  queryFormRef.value?.resetFields();
  queryParams.value.pageNum = 1;
  queryParams.value.deptId = undefined;
  deptTreeRef.value?.setCurrentKey(undefined);
  handleQuery();
};

/** 删除按钮操作 */
const handleDelete = async (row?: UserVO) => {
  const userIds = row?.userId || ids.value;
  const [err] = await to(proxy?.$modal.confirm('是否确认删除用户编号为"' + userIds + '"的数据项？') as any);
  if (!err) {
    await api.delUser(userIds);
    await getList();
    proxy?.$modal.msgSuccess('删除成功');
  }
};

/** 用户状态修改  */
const handleStatusChange = async (row: UserVO) => {
  const text = row.status === '0' ? '启用' : '停用';
  try {
    await proxy?.$modal.confirm('确认要"' + text + '""' + row.userName + '"用户吗?');
    await api.changeUserStatus(row.userId, row.status);
    proxy?.$modal.msgSuccess(text + '成功');
  } catch (err) {
    row.status = row.status === '0' ? '1' : '0';
  }
};
/** 跳转角色分配 */
const handleAuthRole = (row: UserVO) => {
  const currentRoutePath = router.currentRoute.value.path;
  if (currentRoutePath.indexOf('xxx') > -1) {
    const userId = row.userId;
    router.push({ path: '/admin/adminUserAuth/adminRole/' + userId, query: { source: undefined } });
  } else {
    const userId = row.userId;
    router.push('/admin/adminUserAuth/adminRole/' + userId);
  }
};

/** 重置密码按钮操作 */
const handleResetPwd = async (row: UserVO) => {
  const [err, res] = await to(
    ElMessageBox.prompt('请输入"' + row.nickName + '"的新密码', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      closeOnClickModal: false,
      inputPattern: /^.{5,20}$/,
      inputErrorMessage: '用户密码长度必须介于 5 和 20 之间',
      inputValidator: (value) => {
        if (/<|>|"|'|\||\\/.test(value)) {
          return '不能包含非法字符：< > " \' \\ |';
        }
      }
    })
  );
  if (!err && res) {
    await api.resetUserPwd(row.userId, res.value);
    proxy?.$modal.msgSuccess('修改成功，新密码是：' + res.value);
  }
};

/** 选择条数  */
const handleSelectionChange = (selection: UserVO[]) => {
  ids.value = selection.map((item) => item.userId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 导入按钮操作 */
const handleImport = () => {
  upload.title = '用户导入';
  upload.open = true;
};
/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    'infra/admin/admin/user/export',
    {
      ...queryParams.value
    },
    `用户_${new Date().getTime()}.xlsx`
  );
};
/** 下载模板操作 */
const importTemplate = () => {
  proxy?.download('infra/admin/admin/user/importTemplate', {}, `用户导入模板_${new Date().getTime()}.xlsx`);
};

/**文件上传中处理 */
const handleFileUploadProgress = () => {
  upload.isUploading = true;
};
/** 文件上传成功处理 */
const handleFileSuccess = (response: any, file: UploadFile) => {
  upload.open = false;
  upload.isUploading = false;
  uploadRef.value?.handleRemove(file);
  ElMessageBox.alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + '</div>', '导入结果', {
    dangerouslyUseHTMLString: true
  });
  getList();
};

/** 提交上传文件 */
function submitFileForm() {
  uploadRef.value?.submit();
}

/** 重置操作表单 */
const reset = () => {
  form.value = { ...initFormData };
  userFormRef.value?.resetFields();
};
/** 取消按钮 */
const cancel = () => {
  dialog.visible = false;
  reset();
};

/** 新增按钮操作 */
const handleAdd = async () => {
  reset();
  const { data } = await api.getUser();
  dialog.visible = true;
  dialog.title = '新增用户';
  postOptions.value = data.posts;
  roleOptions.value = data.roles;
  form.value.password = initPassword.value.toString();
};

/** 修改按钮操作 */
const handleUpdate = async (row?: UserForm) => {
  reset();
  const userId = row?.userId || ids.value[0];
  const { data } = await api.getUser(userId);
  dialog.visible = true;
  dialog.title = '修改用户';
  Object.assign(form.value, data.user);
  postOptions.value = data.posts;
  roleOptions.value = data.roles;
  form.value.postIds = data.postIds;
  form.value.roleIds = data.roleIds;
  form.value.password = '';
};

/** 提交按钮 */
const submitForm = () => {
  userFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      if (form.value.userId) {
        await api.updateUser(form.value);
      } else {
        if (form.value.roleIds && form.value.roleIds.length > 0) {
          form.value.dealRoleRelationFlag = 1;
        }
        await api.addUser(form.value);
      }
      proxy?.$modal.msgSuccess('操作成功');
      dialog.visible = false;
      await getList();
    }
  });
};

/**
 * 关闭用户弹窗
 */
const closeDialog = () => {
  dialog.visible = false;
  resetForm();
};

/**
 * 重置表单
 */
const resetForm = () => {
  userFormRef.value?.resetFields();
  userFormRef.value?.clearValidate();

  form.value.id = undefined;
  form.value.status = '1';
};

/** 排序触发事件 */
const handleSortChange = (column: any) => {
  queryParams.value.orderByColumn = column.prop;
  queryParams.value.isAsc = column.order;
  getList();
};

// 表格列搜索方法
const showColumnSearch = (e: any, cnName: string, enField: string) => {
  e.stopPropagation();
  ElMessageBox.prompt(`请输入“${cnName}”进行搜索`, '', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    center: true
  })
    .then(({ value }) => {
      if (value) {
        (queryParams.value as any)[enField] = value;
      } else {
        (queryParams.value as any)[enField] = '';
      }
      handleQuery();
    })
    .catch(() => {});
};

// 关闭表格列搜索方法
const closeColumnSearch = (e: any, cnName: string, enField: string) => {
  e.stopPropagation();
  (queryParams.value as any)[enField] = '';
  handleQuery();
};

onMounted(() => {
  getDeptTree(); // 初始化部门数据
  getList(); // 初始化列表数据
  proxy?.getAdminConfigKey('admin.user.initPassword').then((response) => {
    initPassword.value = response.data;
  });
});

async function handleDeptChange(value: number | string) {
  const response = await optionselect(value);
  postOptions.value = response.data;
  form.value.postIds = [];
}

/**
 * 分配角色
 */
const handleAssignRole = (row: UserVO) => {
  assignRoleRef.value?.openDialog(row);
};

/**
 * 分配部门
 */
const handleAssignDept = (row: UserVO) => {
  assignDeptRef.value?.openDialog(row);
};

/**
 *获取用户部门名称
 */
const formatUserDeptName = (row: UserVO) => {
  if (!row?.userDeptList || !row.userDeptList.length) {
    return '- -';
  } else {
    return row.userDeptList.map((item: any) => item.dept.deptName).join(', ');
  }
};

/**
 * 同步用户信息
 */
const syncBasePlatformUserInfo = async (row: UserVO) => {
  await proxy?.$modal.confirm('同步会清除用户信息，是否继续同步？');
  proxy?.$modal.loading('正在同步用户信息，请稍候...');
  await syncUserDetailInfoByUserId({ userId: row.userId, clearFlag: 1 });
  setTimeout(() => {}, 10000);
  // await getList();
  proxy?.$modal.closeLoading();
  window.location.reload();
};

/**
 * 同步全部信息
 */
const syncBasePlatformInfo = async () => {
  ElMessageBox.confirm('全量同步会清除当前环境组织架构信息，是否继续同步？', '请选择同步方式', {
    cancelButtonText: '全量同步（清除本地数据）',
    confirmButtonText: '增量同步',
    distinguishCancelAndClose: true,
    type: 'warning',
    center: true
  })
    .then((v) => {
      proxy?.$modal.loading('正在增量同步，请稍候...');
      syncAllOrgRelationInfo({ clearFlag: 0 });
      setTimeout(() => {
        proxy?.$modal.closeLoading();
        window.location.reload();
      }, 30000);
    })
    .catch((action: Action) => {
      if (action === 'cancel') {
        proxy?.$modal.loading('正在全量同步，请稍候...');
        syncAllOrgRelationInfo({ clearFlag: 1 });
        setTimeout(() => {
          proxy?.$modal.closeLoading();
          window.location.reload();
        }, 30000);
      }
    });
};

import AdvancedSearch, { type SearchCondition, type SearchField } from '@/components/AdvancedSearch/index.vue';
import { jsonToHexUpperCase } from '@/utils/common';

// 定义搜索字段配置 - 通过props传递给高级搜索组件
const searchFields: SearchField[] = [
  {
    label: '用户id',
    value: 'userId',
    type: 'text',
    operators: ['eq', 'ne', 'gt', 'lt', 'gte', 'lte', 'like', 'notLike'],
    placeholder: '请输入用户id'
  },
  {
    label: '姓名/昵称',
    value: 'nickName',
    type: 'text',
    operators: ['eq', 'like'],
    placeholder: '请输入姓名/昵称'
  },
  {
    label: '工号',
    value: 'staffCode',
    type: 'text',
    operators: ['eq', 'like'],
    placeholder: '请输入工号'
  },
  {
    label: '手机号',
    value: 'phone',
    type: 'text',
    operators: ['eq', 'like'],
    placeholder: '请输入手机号'
  },
  {
    label: '邮箱',
    value: 'email',
    type: 'text',
    operators: ['eq', 'like'],
    placeholder: '请输入邮箱'
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
  },
  {
    label: '创建时间',
    value: 'createTime',
    type: 'datetime',
    operators: ['gt', 'lt', 'gte', 'lte'],
    placeholder: '请选择创建时间'
  },
  {
    label: '最近登录时间',
    value: 'loginTime',
    type: 'datetime',
    operators: ['gt', 'lt', 'gte', 'lte'],
    placeholder: '请选择最近登录时间'
  }
];

// 处理高级搜索
const handleAdvancedSearch = async (params: { conditions: SearchCondition[] }) => {
  try {
    // 清空已有搜索条件
    dateRange.value = ['', ''];
    queryFormRef.value?.resetFields();
    queryParams.value.pageNum = 1;
    queryParams.value.deptId = undefined;
    deptTreeRef.value?.setCurrentKey(undefined);
    // 赋值
    console.log('高级搜索 params', params);
    queryParams.value.conditionsStr = jsonToHexUpperCase(JSON.stringify(params.conditions));
    await getList();
  } catch (error) {
    ElMessage.error('搜索失败: ' + (error instanceof Error ? error.message : String(error)));
  }
};
</script>

<style lang="scss" scoped>
.el-card__body {
  padding: 2px !important;
}
.choose-cur-dept {
  color: #2c7ecf;
}
</style>
