<template>
    <el-card class="bt-card-view" :body-style="{ height: '90%'}" v-show="states.visible">
        <template #header>
            <span>{{ states.dialogTitle }}</span>
            <el-icon class="header-close" @click="close">
                <Close></Close>
            </el-icon>
        </template>
        <el-scrollbar class="scrollbar">
           
            <el-form
                ref="formRef"
                :model="states.formData"
                label-width="80px"
                label-position="top"
                class="ml-4 standard-form"
                :disabled="states.updateType == 'read'"
            >
                <el-row :gutter="32">
                    <!-- <el-col :span="4">
                        <el-form-item
                            label="创建组织"
                            prop="branchCompanyName"
                            > -->
                            <!-- :rules="e_rule('required', '使用组织不能为空')" -->
                        <!-- <el-input v-model="states.formData.branchCompanyName" disabled></el-input> -->
                            <!-- <el-tree-select
                                ref="deptRef"
                                v-model="states.formData.branchCompanyId"
                                :data="states.branchCompanyList"
                                value-key="id"
                                :props="{ label: 'name', children: 'children', disabled: 'disabled' }"
                                clearable
                                filterable
                                check-strictly
                                default-expand-all
                                :render-after-expand="false"
                                @change="changeBranchCompanyId"
                            ></el-tree-select> -->
                        <!-- </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item
                            label="使用组织"
                            prop="useBranchCompanyName"
                            > -->
                            <!-- :rules="e_rule('required', '使用组织不能为空')" -->
                        <!-- <el-input v-model="states.formData.useBranchCompanyName" disabled></el-input> -->
                            <!-- <el-tree-select
                                disabled
                                ref="deptRef"
                                v-model="states.formData.useBranchCompanyId"
                                :data="states.branchCompanyList"
                                value-key="id"
                                :props="{ label: 'name', children: 'children' }"
                                clearable
                                filterable
                                default-expand-all
                                check-strictly
                                :render-after-expand="false"
                                placeholder="根据创建组织自动带出"
                            ></el-tree-select> -->
                        <!-- </el-form-item>
                    </el-col> -->
                    <el-col :span="4">
                        <!-- <el-form-item v-if="states.codeStatus" label="工作日历编码" prop="calendarCode">
                            <el-input
                                v-model.trim="states.formData.calendarCode"
                                disabled
                                clearable
                                placeholder="根据编码规则自动生成"
                            ></el-input>
                        </el-form-item>
                        <el-form-item
                            v-else
                            label="工作日历编码"
                            prop="calendarCode"
                            :rules="e_rule('required', '工作日历编码不能为空')"
                        >
                            <el-input
                                v-model.trim="states.formData.calendarCode"
                                :disabled="states.updateType == 'edit'"
                                clearable
                                placeholder="请输入"
                            ></el-input>
                        </el-form-item> -->
                        <el-form-item  label="工作日历编码" prop="calendarCode">
                            <el-input
                                v-model.trim="states.formData.calendarCode"
                                disabled
                                clearable
                                :placeholder="'根据编码规则自动生成'"
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item
                            label="工作日历名称"
                            prop="calendarName"
                            :rules="e_rule('required', '工作日历名称不能为空')"
                        >
                            <el-input
                                v-model.trim="states.formData.calendarName"
                                clearable
                                placeholder="请输入"
                            ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="32">
                    <el-col :span="4">
                        <el-form-item label="国家地区" prop="region" :rules="e_rule('required', '国家地区不能为空')">
                            <el-select v-model="states.formData.region">
                                <el-option
                                v-for="item of country_region"
                                    :key="item.value"
                                    :value="item.value"
                                    :label="item.label"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item
                            label="起效日期"
                            prop="effectiveDate"
                            :rules="e_rule('required', '起效日期不能为空')"
                        >
                            <el-date-picker
                                v-model="states.formData.effectiveDate"
                                type="date"
                                value-format="YYYY-MM-DD"
                                placeholder="年/月/日"
                            ></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item
                            label="失效日期"
                            prop="expiringDate"
                            :rules="e_rule('required', '起效日期不能为空')"
                        >
                            <el-date-picker
                                v-model="states.formData.expiringDate"
                                type="date"
                                value-format="YYYY-MM-DD"
                                placeholder="年/月/日"
                            ></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item label="使用状态:">
                            <el-switch
                                v-model="states.formData.status"
                                class="ml-2"
                                active-value="1"
                                inactive-value="0"
                            ></el-switch>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="32">
                    <el-col :span="16">
                        <el-form-item label="备注" prop="remark">
                            <el-input
                                v-model.trim="states.formData.remark"
                                :disabled="states.updateType == 'read'"
                                type="textarea"
                                show-word-limit
                                :rows="2"
                                maxlength="500"
                                :placeholder="states.updateType != 'read' ? '请输入' : ' '"
                            ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <calendarSetTable ref="calendarSetTableRef" :updateType="states.updateType"></calendarSetTable>
            </el-form>
        </el-scrollbar>
        <template #footer v-if="states.updateType != 'read'">
                <div >
                <el-button :loading="states.buttonLoading" @click="close">取&nbsp;消</el-button>
                <el-button type="primary" :loading="states.buttonLoading" @click="saveCalendar">保&nbsp;存 </el-button>
            </div>
        </template>
    </el-card>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { e_rule } from '@/utils/require-rule/index'
   import { E_Msg } from '@/utils/message/index'
import codeRuleInstanceApi from '@/api/system/code-rule-instance-api'

import CompanyApi from '@/api/system/company-api'
import CalendarApi from '@/api/basic/basic-calendar-api'
// import { BtUseAppStore } from 'beeboat-ui/es/core/store'
// import { BtUserTokenInfo } from 'beeboat-ui/es/core'
import { Close } from '@element-plus/icons-vue'
import calendarSetTable from './calendar-set-table.vue'
import { format } from '@/utils/times/index'
import { getUserProfile } from '@/api/infra/admin/adminUser';
// const appStore = BtUseAppStore()
const emits = defineEmits(['success'])

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { country_region } = toRefs<any>(proxy?.useDict('country_region'));
// const props = defineProps({

// })
let states = reactive({
    //弹窗标题
    dialogTitle: '',
    //表单
    formData: {
        calendarCode: '', // 日历编码
        calendarName: '', // 名称
        branchCompanyId: undefined, // 创建组织
        useBranchCompanyId: undefined, // 使用组织
        branchCompanyName: undefined, // 创建组织
        useBranchCompanyName: undefined, // 使用组织
        workCenterIds: '', //生产中心id
        remark: '', //备注
        expiringDate: '2099-12-31', //失效日期
        effectiveDate: format(new Date(), 'yyyy-MM-dd'), //起效日期
        region: '', //国家地区
        status: 1, //使用状态
        id: undefined,
    },
    codeStatus: false, // 是否有编码规则
    //显示隐藏
    visible: false,
    //按钮load
    buttonLoading: false,
    updateType: '',
    //表格数据
    calendarSetTableList: [],
    //国家地区下拉  appStore.getDictByParentCode('InnerDictResign')
    resignList:[],
    //创建组织下拉
    branchCompanyList: [],
})
const formRef = ref()
const calendarSetTableRef = ref()
//起效日期发生改变根据集团的创建日期判断，起效日期不能早于集团的创建日期。
// watch(
//     () => states.formData.effectiveDate,
//     (newval, oldval) => {
//         if (new Date(BtUserTokenInfo.getCompany().gmtCreate) > new Date(newval)) {
//             E_Msg.warn('起效日期不能早于集团的创建日期')
//             states.formData.effectiveDate = oldval
//         }
//     },
// )
//失效时间不能小于生效日期
watch(
    () => states.formData.expiringDate,
    (newval, oldval) => {
        if (new Date(states.formData.expiringDate) < new Date(states.formData.effectiveDate)) {
            E_Msg.warn('失效日期不能小于起效日期')
            states.formData.expiringDate = oldval
        }
    },
)
//新增
const startAdd = () => {
    states.updateType = 'add'
    states.visible = true
    states.formData.id = undefined
    nextTick(() => {
        states.formData.region = country_region.value[0]?.value // 国家地区
    })
    states.dialogTitle = '工作日历新增'
    getUser()
}
//修改
const startEdit = row => {
    states.updateType = 'edit'
    states.visible = true
    states.dialogTitle = '工作日历修改'
    states.formData = JSON.parse(JSON.stringify(row))
    calendarSetTableRef.value.setEditData(row)
}
   /**
 * 获取用户信息
 */
 const getUser = async () => {
  const res = await getUserProfile();
  states.formData.branchCompanyName = res.data.user.deptName
  states.formData.branchCompanyId = res.data.user.deptId
  states.formData.useBranchCompanyName = res.data.user.deptName
  states.formData.useBranchCompanyId = res.data.user.deptId
  
};
// 保存方法
const saveCalendar = () => {
    formRef.value.validate(valid => {
        calendarSetTableRef.value.formValidate(valid, () => {
            const params: any = {
                ...states.formData,
                settingList: calendarSetTableRef.value.getFormData(),
            }
            states.buttonLoading = true
            const method = states.updateType == 'edit' ? 'update' : 'save'
            CalendarApi[method](params)
                .then(() => {
                    E_Msg.newMessage('保存成功');
                    close()
                    emits('success')
                    states.buttonLoading = false
                })
                .catch(() => {
                    states.buttonLoading = false
                })
        })
    })
}

// 获取是否有编码规则
// const getCode = async () => {
//     codeRuleInstanceApi.listPage({
//         pageNumber: 1,
//         pageSize: 1000,
//         temp: 2,
//         ruleStatus: 1,
//     }).then(res => {
//         states.codeStatus = Boolean(res.data.records.find(x => x.code == 'CalendarCode'))
//     })
// }
// getCode()
// 递归所有组织，禁用不可选的
const filterDept = list => {
    return list.map(x => {
        if (x.authority == 1) {
            x.disabled = false
        } else {
            x.disabled = true
        }
        x.children = filterDept(x.children)
        return x
    })
}
//获取组织列表LIST
// const getOrgList = () => {
//     CompanyApi.listOrgTree({
//         // companyId: BtUserTokenInfo.getCompany().companyId,
//         includeChildrenData: 'true',
//         includeUserData: 'false',
//         isDept: '0',
//         t: new Date().getTime(),
//         authorityParam: { type: 3 },
//         //过滤掉已经停用的部门
//         needCloseDept: 0,
//     }).then((res: any) => {
//         if (res.code == 0) {
//             states.branchCompanyList = filterDept(res.data)
//         }
//     })
// }
// getOrgList()
const changeBranchCompanyId = e => {
    states.formData.useBranchCompanyId = e
}
//关闭弹窗
const close = () => {
    formRef.value.resetFields()
    states.visible = false
    calendarSetTableRef.value.clearTable()
}
defineExpose({ startAdd, startEdit })
</script>
<style scoped lang="scss">
.bt-view {
    position: absolute;
    top: 0px;
    left: 0;
    z-index: 20 !important;
    width: 100%;
}
::v-deep  .el-card__body{
    height: 86% !important;
}
:deep(.el-collapse-item__arrow) {
    display: none;
}

.collapse-style {
    height: calc(100% - 240px);
    overflow-y: auto;
    overflow-x: hidden;
}

.header-close {
    float: right;
    cursor: pointer;
    width: 48px !important;
    height: 48px !important;
    position: absolute !important;
    top: 0;
    right: 0;
}

.bt-view__table--nospace {
    height: 100%;
}

:deep(.el-form) {
    height: 100%;
    width: 99%;
}
.standard-form{
    padding-top: 20px;
}
</style>
