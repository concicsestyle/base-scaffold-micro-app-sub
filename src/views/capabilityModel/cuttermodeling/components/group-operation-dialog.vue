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
                    <el-form-item v-if="states.groupCodeStatus" label="刀具类别编码" prop="toolTypeCode">
                        <el-input
                            v-model.trim="states.form.toolTypeCode"
                            disabled
                            clearable
                            placeholder="根据编码规则自动生成"
                        ></el-input>
                    </el-form-item>
                    <el-form-item
                        v-else
                        label="刀具类别编码"
                        prop="toolTypeCode"
                        :rules="e_rule('required', '刀具类别编码不能为空')"
                    >
                        <el-input
                            v-model.trim="states.form.toolTypeCode"
                            :disabled="states.updateType == 'edit'"
                            clearable
                            placeholder="请输入"
                        ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                        label="刀具类别名称"
                        prop="toolTypeName"
                        :rules="e_rule('required', '刀具类别名称')"
                    >
                        <el-input
                            maxlength="60"
                            :show-word-limit="false"
                            v-model.trim="states.form.toolTypeName"
                            placeholder="请输入"
                            clearable
                        ></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
          <el-row :gutter="32">
            <el-col :span="8">
              <el-form-item
                  label="上级刀具类别"
                  prop="parentId"
                  :rules="e_rule('required', '上级刀具类别不能为空')"
              >
                <el-tree-select
                    ref="deptRef"
                    v-model="states.form.parentId"
                    :data="props.treeData"
                    value-key="id"
                    :props="{ label: 'toolTypeName', children: 'children' }"
                    clearable
                    filterable
                    default-expand-all
                    check-strictly
                    :render-after-expand="false"
                >
                  <template #default="{ data }">
                    <span v-if="data.toolTypeCode"> {{ data.toolTypeCode }}({{ data.toolTypeName }})</span>
                    <span v-else>{{ data.toolTypeName }}</span>
                  </template>
                </el-tree-select>
              </el-form-item>
            </el-col>
          </el-row>
            <el-row >
                <el-col :span="16">
                    <el-form-item label="备注" prop="remark">
                        <el-input
                            v-model.trim="states.form.remark"
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
import { E_Msg } from '@/utils/message/index'
import { save,treeTool,update } from '@/api/basic/toolType-api'

// import CodeRuleInstanceApi from '@/usage/api/system/code-rules/code-rule-instance-api'
// import { E_Msg } from '@utils'

const props = defineProps({
  treeData: Array,
})
const emits = defineEmits(['succeed'])

const states = reactive({
    dialogVisible: false,
    title: '',
    form: {
        parentId:'',//新增选择父id
        toolTypeCode: '', // 工种组编码
        toolTypeName: '', // 工种组名称
        remark: '', // 备注
        id: '', //
    },
    groupCodeStatus: false, // 标识是否有工种组编码规则
    updateType: '', // 区分新增、修改
    saveLoading: false,
})

const formRef = ref()
// 新增数据
const startAddData = parentId => {
    states.form.parentId = parentId
    states.title = '刀具类别新增'
    states.updateType = 'add'
    states.dialogVisible = true
}
// 修改数据
const startEditData = editData => {
    states.title = '刀具类别修改'
    states.updateType = 'edit'
    states.dialogVisible = true
    nextTick(() => {
        states.form = {
            toolTypeName: editData.toolTypeName,
            toolTypeCode: editData.toolTypeCode,
            parentId:editData.parentId,
            remark: editData.remark,
            id: editData.id,
        }
    })
}

// 保存方法
const saveData = () => {
  formRef.value.validate(valid => {
    if (valid) {
      if (states.updateType == 'edit' && states.form.parentId == states.form.id) {
        E_Msg.confirm('提示', '上级刀具类别不能设置为当前编辑数据')
        return
      }
      const params: any = {
        ...states.form,
      }

      const method = states.updateType == 'edit' ? update : save
      if (method == 'update') {
        console.log("是update")
        // 修改时校验，父级是否选择了该数据的子级
        // 获取子级id集合
        const childrenIdList = getChildrenIdList(states.childrenData)
        if (childrenIdList.includes(states.form.parentId)) {
          E_Msg.confirm('提示', '上级类别不可选择子类别')
          return
        }
      }
      states.saveLoading = true
      console.log(params);
      console.log(method);
      method(params)
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
  })


    // formRef.value.validate(valid => {
    //     if (valid) {
    //         if(!states.saveLoading){
    //             const params: any = {
    //             ...states.form,
    //         }
    //         states.saveLoading = true
    //         const method = states.updateType == 'edit' ? update : save
    //         method(params)
    //             .then(() => {
            // E_Msg.newMessage('保存成功');
    //                 states.dialogVisible = false
    //                 formRef.value.resetFields()
    //                 emits('succeed')
    //                 states.saveLoading = false
    //             })
    //             .catch(err => {
            //
    //                 states.saveLoading = false
    //             })
    //         }
    //
    //     }
    // })
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
