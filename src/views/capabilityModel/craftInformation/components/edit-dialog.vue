<template>
    <el-dialog
        v-model="states.dialogVisible"
        :title="states.title"
        :close-on-click-modal="false"
        draggable
        width="60%"
        :before-close="handleClose"
    >
        <el-form
            ref="formRef"
            :model="states.form"
            label-width="80px"
            :disabled="states.updateType == 'read'"
            label-position="top"
            class="standard-form"
        >
            <el-row :gutter="32">
                <el-col :span="6">
                  
                    <el-form-item
                        label="工种编码"
                        prop="workTypeCode"
                    >
                             <el-input
                            v-model.trim="states.form.workTypeCode"
                            disabled
                            clearable
                            :placeholder="'根据编码规则自动生成'"
                        ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="工种名称" prop="workTypeName" :rules="e_rule('required', '工种名称不能为空')">
                        <el-input
                            maxlength="60"
                            :show-word-limit="false"
                            v-model.trim="states.form.workTypeName"
                            placeholder="请输入"
                            clearable
                        ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="工种组" prop="workTypeGroupId" :rules="e_rule('required', '工种组不能为空')">
                        <el-select v-model="states.form.workTypeGroupId" clearable placeholder="请选择" filterable>
                            <el-option
                                v-for="item in states.treeData"
                                :key="item.id"
                                :value="item.id"
                                :label="item.workTypeGroupName"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="难度系数" prop="difficultyNum">
                        <el-select
                            v-model="states.form.difficultyNum"
                            clearable
                            :placeholder="states.updateType != 'read' ? '请选择' : ' '"
                            filterable
                        >
                            <el-option
                                v-for="item in course_rating"
                                :key="item.value"
                                :value="item.value"
                                :label="item.label"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="32">
                <el-col :span="24">
                    <el-form-item label="备注" prop="description">
                        <el-input
                            v-model.trim="states.form.description"
                            :placeholder="states.updateType != 'read' ? '请输入' : ' '"
                            type="textarea"
                            show-word-limit
                            maxlength="500"
                        ></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <craftInfoTable
            v-if="states.dialogVisible"
            ref="CraftInfoTableRef"
            :updateType="states.updateType"
        ></craftInfoTable>
        <template v-if="states.updateType != 'read'" #footer>
            <el-button @click="handleClose">取&nbsp;消</el-button>
            <el-button type="primary" :loading="states.saveLoading" @click="saveData">保&nbsp;存</el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { e_rule } from '@/utils/require-rule/index'
import { E_Msg } from '@/utils/message/index'
import { getUserProfile } from '@/api/infra/admin/adminUser';
import workTypeGroupApi from '@/api/basic/work-type-group-api'
import WorkTypeDescApi from '@/api/basic/work-type-desc-api'
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { course_rating } = toRefs<any>(proxy?.useDict('course_rating'));
import { reactive, ref, nextTick, watch, onMounted } from 'vue'
import craftInfoTable from './craft-info-table.vue'
const emits = defineEmits(['success'])
const props = defineProps({
    groupOptions: Array,
})

const states = reactive({
    dialogVisible: false,
    title: '',
    form: {
        securityLevel: '', // 密级
        branchCompanyId:undefined, // 创建组织
        useBranchCompanyId: '', // 使用组织
        branchCompanyName: '', // 创建组织
        useBranchCompanyName: '', // 使用组织
        workTypeCode: '', // 编码
        workTypeName: '', // 名称
        workTypeGroupId: '', // 工种组id
        description: '', // 备注
        id: '', //
        difficultyNum: '', // 难度系数
    },
    codeStatus: false, // 标识是否有单位编码规则
    securityLevelStatus: false, // 标识公司是否启用密级
    updateType: '', // 区分新增、修改
    saveLoading: false,
    confidentialityLevelList:[], // 密级选项
    courseratingList: [], // 难度系数选项
    treeData: [], // 工种组选项
})
const formRef = ref()
const CraftInfoTableRef = ref()

onMounted(() => {
    // 只保留未停用的数据
    states.courseratingList =[]
})


// 新增数据
const startAddData = () => {
    states.title = '工种信息新增'
    states.updateType = 'add'
    states.form.securityLevel = '0'
    states.dialogVisible = true
    states.form.useBranchCompanyName = '全部组织'
    getUser()
    getTree()
   
}
const getUser = async () => {
  const res = await getUserProfile();
  states.form.branchCompanyName = res.data.user.deptName
  states.form.branchCompanyId = res.data.user.deptId
  
};
const getTree = ()=>{
    workTypeGroupApi.list({}).then(res => {
        states.treeData= res.data
    })
}
// 修改数据
const startEditData = ( editData,type) => {
    states.title = type == 'edit' ? '工种信息修改' : '工种信息查看'
    states.updateType = type
    states.dialogVisible = true
    getTree()
    nextTick(() => {
        CraftInfoTableRef.value.startEdit(editData)
        states.form = {
            securityLevel: editData.securityLevel, // 密级
            branchCompanyId: editData.branchCompanyId, // 创建组织
            useBranchCompanyId: editData.useBranchCompanyId, // 使用组织
            branchCompanyName: editData.branchCompanyName, // 创建组织
            useBranchCompanyName:'全部组织', // 使用组织
            workTypeCode: editData.workTypeCode, // 编码
            workTypeName: editData.workTypeName, // 名称
            workTypeGroupId: editData.workTypeGroupId, // 工种组id
            description: editData.description, // 备注
            id: editData.id, //
            difficultyNum: editData.difficultyNum, // 难度系数
        }
    })
   
}
// 保存方法
const saveData = () => {
    formRef.value.validate(valid => {
        CraftInfoTableRef.value.formValidate(valid, () => {
            if (valid) {
                const params: any = {
                    ...states.form,
                    qualificationList: CraftInfoTableRef.value.getFormData(),
                }
                states.saveLoading = true
                const method = states.updateType == 'edit' ? 'update' : 'save'
                WorkTypeDescApi[method](params)
                    .then(() => {
                        E_Msg.newMessage('操作成功');
                        emits('success')
                        handleClose()
                        states.saveLoading = false
                    })
                    .catch(() => {
                        states.saveLoading = false
                    })
            }
        })
    })
}



const handleClose = () => {
    formRef.value.resetFields()
    states.dialogVisible = false
}

defineExpose({ startAddData, startEditData })
</script>
<style scoped lang="scss">
</style>
