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
                    <el-form-item v-if="states.groupCodeStatus" label="工种组编码" prop="workTypeGroupCode">
                        <el-input
                            v-model.trim="states.form.workTypeGroupCode"
                            disabled
                            clearable
                            placeholder="根据编码规则自动生成"
                        ></el-input>
                    </el-form-item>
                    <el-form-item
                        v-else
                        label="工种组编码"
                        prop="workTypeGroupCode"
                        :rules="e_rule('required', '工种组编码不能为空')"
                    >
                        <el-input
                            v-model.trim="states.form.workTypeGroupCode"
                            :disabled="states.updateType == 'edit'"
                            clearable
                            placeholder="请输入"
                        ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                        label="工种组名称"
                        prop="workTypeGroupName"
                        :rules="e_rule('required', '工种组名称不能为空')"
                    >
                        <el-input
                            maxlength="60"
                            :show-word-limit="false"
                            v-model.trim="states.form.workTypeGroupName"
                            placeholder="请输入"
                            clearable
                        ></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row >
                <el-col :span="22">
                    <el-form-item label="备注" prop="description">
                        <el-input
                            v-model.trim="states.form.description"
                            placeholder="请输入"
                            type="textarea"
                            show-word-limit
                            maxlength="60"
                        ></el-input>
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
// import { E_Msg } from '@/utils/message/index'
import {ElMessage } from 'element-plus';
// import { save,update } from '@/api/basic/work-type-group-api'
// import CodeRuleInstanceApi from '@/usage/api/system/code-rules/code-rule-instance-api'
// import { E_Msg } from '@utils'


const emits = defineEmits(['succeed'])

const states = reactive({
    dialogVisible: false,
    title: '',
    form: {
        workTypeGroupCode: '', // 工种组编码
        workTypeGroupName: '', // 工种组名称
        description: '', // 备注
        id: '', //
    },
    groupCodeStatus: false, // 标识是否有工种组编码规则
    updateType: '', // 区分新增、修改
    saveLoading: false,
})

const formRef = ref()
// 新增数据
const startAddData = () => {
    states.title = '工种组新增'
    states.updateType = 'add'
    states.dialogVisible = true
}
// 修改数据
const startEditData = editData => {
    states.title = '工种组修改'
    states.updateType = 'edit'
    states.dialogVisible = true
    nextTick(() => {
        states.form = {
            workTypeGroupName: editData.workTypeGroupName,
            workTypeGroupCode: editData.workTypeGroupCode,
            description: editData.description,
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
            // const method = states.updateType == 'edit' ? update : save
            // method(params)
            //     .then(() => {
            //         ElMessage({ message: '操作成功', type: 'success' })
            //         states.dialogVisible = false
            //         formRef.value.resetFields()
            //         emits('succeed')
            //         states.saveLoading = false
            //     })
            //     .catch(err => {
            //         ElMessage({ message: err.msg||err, type: 'error' })
            //         states.saveLoading = false
            //     })
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
