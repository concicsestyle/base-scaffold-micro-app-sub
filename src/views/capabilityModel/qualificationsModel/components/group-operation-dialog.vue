<template>
    <el-dialog
        v-model="states.dialogVisible"
        :title="states.title"
        :close-on-click-modal="false"
        draggable
        width="600px"
        :before-close="handleClose"
    >
        <el-form ref="formRef" :model="states.form" label-width="80px" label-position="top" class="standard-form">
            <el-row >
                <el-col :span="12">
                    <el-form-item v-if="states.groupCodeStatus" label="资质组编码" prop="qualificationsGroupCode">
                        <el-input
                            v-model.trim="states.form.qualificationsGroupCode"
                            disabled
                            clearable
                            placeholder="根据编码规则自动生成"
                        ></el-input>
                    </el-form-item>
                    <el-form-item
                        v-else
                        label="资质组编码"
                        prop="qualificationsGroupCode"
                        :rules="e_rule('required', '资质组编码不能为空')"
                    >
                        <el-input
                            v-model.trim="states.form.qualificationsGroupCode"
                            :disabled="states.updateType == 'edit'"
                            clearable
                            placeholder="请输入"
                        ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                        label="资质组名称"
                        prop="qualificationsGroupName"
                        :rules="e_rule('required', '资质组名称不能为空')"
                    >
                        <el-input
                            maxlength="60"
                            :show-word-limit="false"
                            v-model.trim="states.form.qualificationsGroupName"
                            placeholder="请输入"
                            clearable
                        ></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="32">
                <el-col :span="12">
                    <el-form-item
                        label="所属资质"
                        prop="qualificationsType"
                        :rules="e_rule('required', '所属资质不能为空')"
                    >
                        <el-select v-model="states.form.qualificationsType">
                            <el-option value="-1" label="人员资质"></el-option>
                            <el-option value="-2" label="组织资质"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <template #footer>
            <el-button  @click="handleClose">取&nbsp;消</el-button>
            <el-button type="primary" :loading="states.saveLoading" @click="saveData">保&nbsp;存</el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive ,nextTick} from 'vue'
import { e_rule } from '@/utils/require-rule/index'
import { E_Msg } from '@/utils/message/index'
// import CodeRuleInstanceApi from '@/usage/api/system/code-rules/code-rule-instance-api'
// import { E_Msg } from '@utils'
import qualificationsGroupApi from '@/api/basic/qualifications-group-api'

const emits = defineEmits(['succeed'])

const states = reactive({
    dialogVisible: false,
    title: '',
    form: {
        qualificationsGroupCode: '', // 资质组编码
        qualificationsGroupName: '', // 资质组名称
        qualificationsType: '', // 所属资质
        id: '', //
    },
    groupCodeStatus: false, // 标识是否有资质组编码规则
    updateType: '', // 区分新增、修改
    saveLoading: false,
})

const formRef = ref()
// 新增数据
const startAddData = () => {
    states.title = '资质组新增'
    states.updateType = 'add'
    states.dialogVisible = true
}
// 修改数据
const startEditData = editData => {
    states.title = '资质组修改'
    states.updateType = 'edit'
    states.dialogVisible = true
    nextTick(() => {
        states.form = {
            qualificationsGroupName: editData.qualificationsGroupName,
            qualificationsGroupCode: editData.qualificationsGroupCode,
            qualificationsType: editData.qualificationsType,
            id: editData.id,
        }
    })
}

// 保存方法
const saveData = () => {
    formRef.value.validate(valid => {
        if (valid) {
            if(!states.saveLoading){
                const params: any = {
                ...states.form,
            }
            states.saveLoading = true
            const method = states.updateType == 'edit' ? 'update' : 'save'
            qualificationsGroupApi[method](params)
                .then(() => {
            E_Msg.newMessage('保存成功');
                    states.dialogVisible = false
                    formRef.value.resetFields()
                    emits('succeed')
                    states.saveLoading = false
                })
                .catch(() => {
                    states.saveLoading = false
                })
            }
            
        }
    })
}



const handleClose = () => {
    states.dialogVisible = false
    formRef.value.resetFields()
}

defineExpose({ startAddData, startEditData })
</script>
<style scoped lang="scss">
.mid-title {
    font-size: 18px;
    font-weight: bold;
}

</style>
