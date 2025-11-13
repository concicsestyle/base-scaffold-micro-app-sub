<template>
    <el-dialog
        v-model="states.dialogVisible"
        :title="states.title"
        :close-on-click-modal="false"
        draggable
        width="578px"
        :before-close="handleClose"
    >
        <el-form ref="formRef" :model="states.form" label-width="80px" label-position="top">
            <el-form-item v-if="states.codeStatus" :label="props.title+'编码'" prop="typeCode">
                <el-input
                    v-model.trim="states.form.typeCode"
                    disabled
                    clearable
                    placeholder="根据编码规则自动生成"
                ></el-input>
            </el-form-item>
            <el-form-item
                v-else
                :label="props.title+'编码'"
                prop="typeCode"
                :rules="e_rule('required', `${props.title}编码不能为空`)"
            >
                <el-input
                    v-model.trim="states.form.typeCode"
                    maxlength="60"
                    :show-word-limit="false"
                    :disabled="states.updateType == 'edit'"
                    clearable
                    placeholder="请输入"
                ></el-input>
            </el-form-item>
            <el-form-item
                :label="props.title+'名称'"
                prop="typeName"
                :rules="e_rule('required', `${props.title}名称不能为空`)"
            >
                <el-input
                    maxlength="60"
                    :show-word-limit="false"
                    v-model.trim="states.form.typeName"
                    placeholder="请输入"
                    clearable
                ></el-input>
            </el-form-item>
            <el-form-item :label="'上级'+props.title" prop="parentId">
                <el-tree-select
                    ref="deptRef"
                    v-model="states.form.parentId"
                    :data="props.treeData"
                    value-key="id"
                    :props="{ label: 'typeName', children: 'children' }"
                    clearable
                    filterable
                    default-expand-all
                    check-strictly
                    :render-after-expand="false"
                >
                    <template #default="{ data }">
                        <span v-if="data.typeCode"> {{ data.typeCode }}({{ data.typeName }})</span>
                        <span v-else>{{ data.typeName }}</span>
                    </template>
                </el-tree-select>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="handleClose">取&nbsp;消</el-button>
            <el-button type="primary"
                       :loading="states.saveLoading"
                       @click="saveData"
            >保&nbsp;存</el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { e_rule } from '@/utils/require-rule/index'
import { E_Msg } from '@/utils/message/index'
import { reactive, ref, nextTick } from 'vue'
import EqpTypeApi from '@/api/basic/eqp-type-api'
// import CodeRuleInstanceApi from '@/usage/api/system/code-rules/code-rule-instance-api'

const emits = defineEmits(['succeed'])
const props = defineProps({
    treeData: Array,
    title:{
        type: String,
        default:'设备类别',
    },
})

const states = reactive({
    dialogVisible: false,
    title: '',
    form: {
        equipmentType: '',
        parentId: '', // 单位组编码
        id: '', //
        typeCode: '',
        typeName: '',
    },
    codeStatus: true, // 标识是否有编码规则
    updateType: '', // 区分新增、修改
    saveLoading: false,
})

const formRef = ref()
// 新增数据
const startAddData = data => {
    states.form.parentId = data.id
    states.form.equipmentType = data.equipmentType
    states.title = `${props.title}新增`
    states.updateType = 'add'
    states.dialogVisible = true
}
// 修改数据
const startEditData = editData => {
    states.title =  `${props.title}修改`
    states.updateType = 'edit'
    states.dialogVisible = true
    nextTick(() => {
        states.form = {
            equipmentType:editData.equipmentType,
            parentId: editData.parentId, // 单位组编码
            id: editData.id, //
            typeCode: editData.typeCode,
            typeName: editData.typeName,
        }
    })
}

// 保存方法
const saveData = () => {
    formRef.value.validate(valid => {
        if (valid) {
            if (states.updateType == 'edit' && states.form.parentId == states.form.id) {
                E_Msg.newMessage('上级设备类别不能设置为当前编辑数据','warning')
                return
            }
            const params: any = {
                ...states.form,
            }
            if(!states.saveLoading){
                states.saveLoading = true
                const method = states.updateType == 'edit' ? 'update' : 'save'
                EqpTypeApi[method](params)
                    .then(() => {
                        E_Msg.newMessage('保存成功')
                        states.dialogVisible = false
                        formRef.value.resetFields()
                        emits('succeed')

                        states.saveLoading = false
                    })
                    .catch(err => {
                      
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
