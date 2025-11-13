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
            <el-row :gutter="32">
                <el-col :span="12">
                    <el-form-item v-if="states.codeStatus" label="班次类别编码" prop="rotationTypeCode">
                        <el-input
                            v-model.trim="states.form.rotationTypeCode"
                            disabled
                            clearable
                            placeholder="根据编码规则自动生成"
                        ></el-input>
                    </el-form-item>
                    <el-form-item
                        v-else
                        label="班次类别编码"
                        prop="rotationTypeCode"
                        :rules="e_rule('required', '班次类别编码不能为空')"
                    >
                        <el-input
                            v-model.trim="states.form.rotationTypeCode"
                            :disabled="states.updateType == 'edit'"
                            clearable
                            placeholder="请输入"
                        ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                        label="班次类别名称"
                        prop="rotationTypeName"
                        :rules="e_rule('required', '班次类别名称不能为空')"
                    >
                        <el-input
                            maxlength="60"
                            :show-word-limit="false"
                            v-model.trim="states.form.rotationTypeName"
                            placeholder="请输入"
                            clearable
                        ></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="32">
                <el-col :span="12">
                    <el-form-item label="备注" prop="remark">
                        <el-input
                            v-model.trim="states.form.remark"
                            :rows="2"
                            type="textarea"
                            maxlength="500"
                            show-word-limit
                            clearable
                            placeholder="请输入"
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
import { E_Msg } from '@/utils/message/index'
import RotationTypeApi from '@/api/basic/rotation-type-api'
// import CodeRuleInstanceApi from '@/usage/api/system/code-rules/code-rule-instance-api'
// import { E_Msg } from '@utils'


const emits = defineEmits(['succeed'])

const states = reactive({
    dialogVisible: false,
    title: '班次类别新增',
    form: {
        rotationTypeCode: '', // 班次类别编码
        rotationTypeName: '', // 班次类别名称
        remark: '', // 所属资质
        parentId: '', //
        id:''
    },
    codeStatus: false, // 标识是否有班次类别编码规则
    updateType: '', // 区分新增、修改
    saveLoading: false,
})

const formRef = ref()
// 新增数据
const startAddData = (id) => {
    states.form.parentId = id
    states.title = '班次类别新增'
    states.updateType = 'add'
    states.dialogVisible = true
}
// 修改数据
const startEditData = data => {
    states.title = '班次类别修改'
    states.updateType = 'edit'
    states.dialogVisible = true
    nextTick(() => {
        states.form.id = data.id
        states.form.parentId = data.parentId
        states.form.rotationTypeCode = data.rotationTypeCode
        states.form.rotationTypeName = data.rotationTypeName
        states.form.remark = data.remark
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
            RotationTypeApi[method](params)
                .then(() => {
                    E_Msg.newMessage('保存成功','success');
                    states.dialogVisible = false
                    formRef.value.resetFields()
                    emits('succeed')
                    states.saveLoading = false
                })
                .catch( () => {
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
// 获取是否有编码规则
// const getCode = async () => {
//     CodeRuleInstanceApi.listPage({
//         pageNumber: 1,
//         pageSize: 1000,
//         code: 'WorkCenterTypeCode',
//         ruleStatus: 1,
//     }).then(res => {
//         states.codeStatus = Boolean(res.data.records.find(x => x.code == 'WorkCenterTypeCode'))
//     })
// }
defineExpose({ startAddData, startEditData })
</script>
<style scoped lang="scss">
.mid-title {
    font-size: 18px;
    font-weight: bold;
}

</style>
