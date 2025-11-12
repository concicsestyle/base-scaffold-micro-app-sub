<template>
    <el-dialog v-model="states.dialogVisible" :title="states.title" :close-on-click-modal="false" draggable width="80%"
        :before-close="handleClose">
        <el-form ref="formRef" :model="states.formData" label-width="80px" label-position="top"
            class="ml-4 standard-form" :disabled="states.updateType == 'read'" >
            <el-row :gutter="20">
                <el-col :span="6">
                    <el-form-item label="班制编码" prop="shiftSystemCode">
                        <el-input v-model.trim="states.formData.shiftSystemCode" disabled clearable
                            :placeholder="'根据编码规则自动生成'"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="班制名称" prop="shiftSystemName" :rules="e_rule('required', '班制名称不能为空')">
                        <el-input v-model.trim="states.formData.shiftSystemName" clearable placeholder="请输入"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="工作时长(小时)" prop="workHour" :rules="e_rule('required', '工作时长不能为空')">
                        <el-input v-model.trim="states.formData.workHour" clearable placeholder="" disabled></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="16">
                    <el-form-item label="备注" prop="remark">
                        <el-input v-model.trim="states.formData.remark"
                            :placeholder="states.updateType != 'read' ? '请输入' : ' '" type="textarea" show-word-limit
                            :rows="2" maxlength="500"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <shiftSystemSetTable ref="shiftSystemSetTableRef" :updateType="states.updateType" @getHours="getHours">
            </shiftSystemSetTable>
        </el-form>
        <template v-if="states.updateType != 'read'" #footer>
            <el-button @click="handleClose">取&nbsp;消</el-button>
            <el-button type="primary" :loading="states.saveLoading" @click="saveData">保&nbsp;存</el-button>
        </template>
    </el-dialog>

</template>

<script setup lang="ts">
   import { e_rule } from '@/utils/require-rule/index'
   import { E_Msg } from '@/utils/message/index'
   import { reactive, ref, nextTick } from 'vue'
   import shiftSystemSetTable from './shift-system-set-table.vue'
   import { getUserProfile } from '@/api/infra/admin/adminUser';
   import ShiftSystemApi from '@/api/basic/shift-system-api'
   const shiftSystemSetTableRef = ref()
   const emits = defineEmits(['success'])
   const states = reactive({
       dialogVisible: false,
       title: '',
       formData: {} as any,
       updateType:'add',
       codeStatus:false,
       saveLoading:false
   })
   const formRef = ref()

   // 新增数据
   const startAddData = () => {
       nextTick(()=>{
        states.updateType = 'add'
        states.dialogVisible = true
        states.title = '班制新增'
        states.formData = {}
        getUser()
        })
   
      
   }
   
   // 修改数据
   const startEditData = ( editData,type) => {
      nextTick(()=>{
        states.title = type == 'edit' ? '班制修改' : '班制查看'
       states.updateType = type
       states.dialogVisible = true
       states.formData = JSON.parse(JSON.stringify(editData))
        shiftSystemSetTableRef.value.startEdit(editData)
        
      })
      
   }
/**
 * 获取用户信息
 */
const getUser = async () => {
  const res = await getUserProfile();
  states.formData.branchCompanyName = res.data.user.deptName
  states.formData.branchCompanyId = res.data.user.deptId
};
   //获取工作时长
const getHours = e => {
    states.formData.workHour = e
}

   // 保存方法
   const saveData = () => {
    if (!shiftSystemSetTableRef.value.getFormData() || shiftSystemSetTableRef.value.getFormData().length == 0) {
        E_Msg.warn('班次信息不能为空')
        return
    }
    let list = []
    shiftSystemSetTableRef.value.getFormData().forEach(e => {
        list.push({
            basicRotationDescId: e.basicRotationDescId ? e.basicRotationDescId : e.id,
            id: e.isAdd ? undefined : e.id,
            isAdd: e.isAdd,
        })
    })
    formRef.value.validate(valid => {
        shiftSystemSetTableRef.value.formValidate(valid, () => {
            const params: any = {
                ...states.formData,
                rotationIdList: list,
            }
            states.saveLoading = true
            const method = states.updateType == 'edit' ? 'update' : 'save'
            ShiftSystemApi[method](params)
                .then(() => {
                    E_Msg.newMessage('保存成功');
                    handleClose()
                    emits('success')
                    states.saveLoading = false
                })
                .catch(() => {
                    states.saveLoading = false
                })
        })
    })
   }
   const handleClose = () => {
    formRef.value.resetFields()
    states.dialogVisible = false
    shiftSystemSetTableRef.value.clearTable()
   }

   defineExpose({ startAddData, startEditData })
   </script>
<style scoped lang="scss">
</style>