<template>
    <el-dialog v-model="states.dialogVisible" :title="states.title" :close-on-click-modal="false" draggable width="60%"
        :before-close="handleClose">
        <el-form ref="formRef" :model="states.form" label-width="80px" :disabled="states.updateType == 'read'"
            label-position="top" class="standard-form">
            <el-row :gutter="32">
                <el-col :span="8">
                    <el-form-item label="资质编码" prop="qualificationsCode" >
                        <el-input
                            style="width: 100%;"
                            v-model.trim="states.form.qualificationsCode"
                            disabled
                            clearable
                            :placeholder="'根据编码规则自动生成'"
                        ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="资质名称" prop="qualificationsName" :rules="e_rule('required', '资质名称不能为空')">
                        <el-tooltip :disabled="states.isQualificationsNameCheckd != 1" content="已经被业务使用,不能修改,请确认!"
                            placement="bottom" effect="light">
                            <el-input maxlength="60" :show-word-limit="false"
                            style="width: 100%;"
                                v-model.trim="states.form.qualificationsName"
                                :placeholder="states.updateType != 'read' ? '请输入' : ' '" clearable
                                :disabled="states.updateType == 'edit' && states.isQualificationsNameCheckd == 1"></el-input>
                        </el-tooltip>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="资质组" prop="qualificationsGroupId" :rules="e_rule('required', '工种组不能为空')">
                        <el-tree-select ref="deptRef" v-model="states.form.qualificationsGroupId"
                            style="width: 100%;"
                            :data="states.treeData" value-key="id" :props="{
                                label: 'qualificationsGroupName',
                                children: 'children',
                            }" clearable filterable check-strictly default-expand-all
                            :default-expanded-keys="['-1', '-2']" :render-after-expand="false"
                            :placeholder="states.updateType != 'read' ? '请选择' : ' '"></el-tree-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="32">
                <el-col :span="24">
                    <el-form-item label="备注" prop="remark">
                        <el-input v-model.trim="states.form.remark"
                            style="width: 100%;"
                            :placeholder="states.updateType != 'read' ? '请输入' : ' '" type="textarea" show-word-limit
                            maxlength="500"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <craftInfoTable v-if="states.dialogVisible" ref="CraftInfoTableRef" :updateType="states.updateType">
        </craftInfoTable>
        <template v-if="states.updateType != 'read'" #footer>
            <el-button @click="handleClose">取&nbsp;消</el-button>
            <el-button type="primary" :loading="states.saveLoading" @click="saveData">保&nbsp;存</el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { e_rule } from '@/utils/require-rule/index'
import { reactive, ref, nextTick, watch, onMounted } from 'vue'
import qualificationsGroupApi from '@/api/basic/qualifications-group-api'
import { getUserProfile } from '@/api/infra/admin/adminUser';
import craftInfoTable from './craft-info-table.vue'
import  qualificationsDescApi from '@/api/basic/qualifications-desc-api'
import { E_Msg } from '@/utils/message';
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
        qualificationsCode: '', // 编码
        qualificationsName: '', // 名称
        qualificationsGroupId: '', // 工种组id
        remark: '', // 备注
        id: '', //
        difficultyNum: '', // 难度系数
    } as any,
    qualificationsCode: false, // 标识是否有单位编码规则
    securityLevelStatus: false, // 标识公司是否启用密级
    updateType: '', // 区分新增、修改
    saveLoading: false,
    confidentialityLevelList:[], // 密级选项
    courseratingList: [], // 难度系数选项
    treeData: [        {
            qualificationsGroupName: '人员资质',
            id: '-1',
            children: [],
            disabled: false,
        },
        {
            qualificationsGroupName: '组织资质',
            id: '-2',
            children: [],
            disabled: false,
        },], // 工种组选项
     //校验资质名称后面业务是否被占用
     isQualificationsNameCheckd: 0,
})
const formRef = ref()
const CraftInfoTableRef = ref()

onMounted(() => {
    // 只保留未停用的数据
    states.courseratingList =[]
})


// 新增数据
const startAddData = (parentId) => {
    states.title = '资质信息新增'
    states.updateType = 'add'
    states.form.securityLevel = '0'
    states.dialogVisible = true
    states.form.useBranchCompanyName = '全部组织'
    getTree()
    getUser() 
    if (parentId) {
        states.form.qualificationsGroupId = parentId
    } else {
        states.form.qualificationsGroupId = ''
    }
   
}
/**
 * 获取用户信息
 */
const getUser = async () => {
  const res = await getUserProfile();
  states.form.branchCompanyName = res.data.user.deptName
  states.form.branchCompanyId = res.data.user.deptId
};
// 修改数据
const startEditData = ( editData,type) => {
    states.title = type == 'edit' ? '资质信息修改' : '资质信息查看'
    states.updateType = type
    states.dialogVisible = true
    let qualificationsDetailList = editData.qualificationsDetailList
    let detailIdList = qualificationsDetailList.map(x => x.id) || []
    getTree()
    //校验资质名称后面业务是否被占用
    qualificationsDescApi.isCheckForQualificationsNameAndLevel({ id: editData.id, detailIdList: detailIdList })
        .then(res => {
            states.isQualificationsNameCheckd = res.data.isCheckd
            //将ischeck赋值进子表
            editData?.qualificationsDetailList.forEach(e => {
                let params = res.data.qualificationsDetailList.find(t => t.id == e.id)
                if (params) {
                    e.isCheckd = params.isCheckd
                    e.useStatus = e.useStatus?.toString()
                }
            })
            CraftInfoTableRef.value.startEdit(editData)
            states.form = {
                securityLevel: editData.securityLevel, // 密级
                branchCompanyId: editData.branchCompanyId, // 创建组织
                useBranchCompanyId: editData.useBranchCompanyId, // 使用组织
                branchCompanyName: editData.branchCompanyName, // 创建组织
                useBranchCompanyName: '全部组织',
                qualificationsCode: editData.qualificationsCode, // 编码
                qualificationsName: editData.qualificationsName, // 名称
                qualificationsGroupId: editData.qualificationsGroupId, // 类别
                remark: editData.remark, // 备注
                id: editData.id, //
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
                    qualificationsDetailList: CraftInfoTableRef.value.getFormData(),
                }
                states.saveLoading = true
                const method = states.updateType == 'edit' ? 'update' : 'save'
                qualificationsDescApi[method](params)
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
const getTree = () => {
    qualificationsGroupApi.list({ }).then(
        res => {
            states.treeData[0].children = res.data.filter(e => e.qualificationsType == '-1') //人员资质
            states.treeData[1].children = res.data.filter(e => e.qualificationsType == '-2') //组织资质
        },
    )
}


const handleClose = () => {
    states.isQualificationsNameCheckd = 0
    formRef.value.resetFields()
    states.dialogVisible = false
}

defineExpose({ startAddData, startEditData })
</script>
<style scoped lang="scss">
.unit-convert-box {
    display: flex;
    .unit-convert-box_input_column {
        width: 150px;
        padding: 0 10px;
    }
    .unit-convert-box_star_column {
        width: 20px;
        padding: 0 10px;
    }
}
</style>
