<template>
    <el-dialog
        v-model="states.dialogVisible"
        :title="states.title"
        :close-on-click-modal="false"
        draggable
        width="40%"
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
                <el-col :span="12">
                    <!-- <el-form-item v-if="states.plantCodeStatus" label="厂房位置编码" prop="plantCode">
                        <el-input
                            v-model.trim="states.form.plantCode"
                            disabled
                            clearable
                            placeholder="根据编码规则自动生成"
                        ></el-input>
                    </el-form-item>
                    <el-form-item
                        v-else
                        label="厂房位置编码"
                        prop="plantCode"
                        :rules="e_rule('required', '厂房位置编码不能为空')"
                    >
                        <el-input
                            maxlength="60"
                            :show-word-limit="false"
                            v-model.trim="states.form.plantCode"
                            :disabled="states.updateType == 'edit'"
                            clearable
                            :placeholder="states.updateType != 'read' ? '请输入' : ' '"
                        ></el-input>
                    </el-form-item> -->
                    <el-form-item  label="厂房位置编码" prop="plantCode">
                        <el-input
                            v-model.trim="states.form.plantCode"
                            disabled
                            clearable
                            :placeholder="'根据编码规则自动生成'"
                        ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                        label="厂房位置名称"
                        prop="plantName"
                        :rules="e_rule('required', '厂房位置名称不能为空')"
                    >
                        <el-input
                            maxlength="60"
                            :show-word-limit="false"
                            v-model.trim="states.form.plantName"
                            :placeholder="states.updateType != 'read' ? '请输入' : ' '"
                            clearable
                        ></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="32">
                <el-col :span="12">
                    <el-form-item label="上级位置" prop="parentId" :rules="e_rule('required', '上级位置不能为空')">
                        <el-tree-select
                            ref="deptRef"
                            v-model="states.form.parentId"
                            :data="states.parentList"
                            value-key="id"
                            filterable
                            :props="{ label: 'plantName', children: 'children' }"
                            clearable
                            default-expand-all
                            check-strictly
                            :render-after-expand="false"
                        >
                            <template #default="{ data }">
                                <span v-if="data.plantCode">{{ data.plantCode }}({{ data.plantName }})</span>
                                <span v-else>{{ data.plantName }}</span>
                            </template>
                        </el-tree-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                        label="所属组织"
                        prop="branchCompanyIdList"
                        :rules="e_rule('required', '所属组织不能为空')"
                    >
                        <el-tree-select
                            ref="branchCompanyRef"
                            v-model="states.form.branchCompanyIdList"
                            :data="states.branchCompanyIdList"
                            value-key="id"
                            :props="{ label: 'label', children: 'children', disabled: 'disabled' }"
                            clearable
                            filterable
                            collapse-tags
                            collapse-tags-tooltip
                            default-expand-all
                            check-strictly
                            @change="handleChange"
                            multiple
                            :render-after-expand="false"
                        ></el-tree-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="32">
                <el-col :span="12">
                    <el-form-item label="备注" prop="remark">
                        <el-input
                            v-model.trim="states.form.remark"
                            :placeholder="states.updateType != 'read' ? '请输入' : ' '"
                            type="textarea"
                            show-word-limit
                            maxlength="500"
                        ></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
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
import { reactive, ref, nextTick, watch, onMounted } from 'vue'
import PlantLocationApi from '@/api/basic/plant-location-api'
import CodeRuleInstanceApi from '@/api/system/code-rule-instance-api'
import { getUserProfile, newDeptTree } from '@/api/infra/admin/adminUser';
import { any } from 'vue-types';
const emits = defineEmits(['success'])
const branchCompanyRef=ref();
const states = reactive({
    dialogVisible: false,
    title: '',
    form: {
        plantCode: '', // 编码
        plantName: '', // 名称
        parentId: '', // 上级位置
        remark: '', // 备注
        id: '', //
        branchCompanyIdList:[], //所属组织
    },
    branchCompanyIdList:[]as any,
    plantCodeStatus: false, // 标识是否有单位编码规则
    saveLoading: false,
    updateType:'add',
    parentList:[]as any,
    branchCompany:[]//
})
const formRef = ref()

const handleChange=()=>{
    if (states.form.branchCompanyIdList.length > 0) {
        //当前选中数据
        let changeData = branchCompanyRef.value.getCurrentNode()
        let data = {
            branchCompanyId: changeData.id,
            branchCompanyName: changeData.label
        }
        let arr=[]//撤销保留数组
        if(states.branchCompany.length>0){
        states.branchCompany.forEach(one=>{
            //判断是否存在已选择数组中
            if(one.branchCompanyId==changeData.id){
                arr.push(data)
            }else{
                states.branchCompany.push(data)
            }
        })
        //如果存在撤销操作就覆盖原数组
        if(arr.length>0){
            states.branchCompany=arr
        }
        }else{
            states.branchCompany.push(data)
        }

    } else {
        states.branchCompany = []
    }
}

// 新增数据
const startAddData = (parentId) => {
    states.title = '厂房位置新增'
    states.updateType = 'add'
    states.dialogVisible = true
    states.form.parentId = parentId
    getParentTree()
    getUser()
}
// 修改数据
const startEditData = ( editData, type) => {
    console.log(editData)
    getParentTree()
    getUser()
    states.title = type == 'edit' ? '厂房位置修改' : '厂房位置查看'
    states.updateType = type
    states.dialogVisible = true
    nextTick(() => {
        states.form = {
            plantCode: editData.plantCode, // 编码
            plantName: editData.plantName, // 名称
            parentId: editData.parentId, // 上级位置
            remark: editData.remark, // 备注
            id: editData.id, //
            branchCompanyIdList: editData.branchCompanyIdList.map(Number)
            // branchCompanyIdList:editData.branchCompanyIdList?.length? editData.branchCompanyIdList.map(t => t.branchCompanyId):[],
        }
    })
   
}
   /**
 * 获取用户信息
 */
 const getUser = async () => {
  const resdept = await newDeptTree();
  states.branchCompanyIdList = resdept.data
};
// 根据厂房id获取到其子级的所有id
const getAllChildId = list => {
    let ids = []
    for (let i = 0; i < list.length; i++) {
        // 当前层级的id
        ids.push(list[i].id)
        if (Array.isArray(list[i].children) && list[i].children.length > 0) {
            // 下一层级的id
            ids = ids.concat(getAllChildId(list[i].children))
        }
    }
    return ids
}
// 根据id获取到其子级数据
const findNode = (tree, func) => {
    for (const node of tree) {
        if (func(node)) return node
        if (node.children) {
            const res = findNode(node.children, func)
            if (res) return res
        }
    }
    return null
}
// 保存方法
const saveData = () => {
    formRef.value.validate(valid => {
        if (valid) {
            if (states.updateType == 'edit') {
                if (states.form.parentId == states.form.id) {
                    E_Msg.newMessage('厂房上级位置不能设置为当前编辑数据','warning')
                    return
                }
                // 获取当前厂房的子级
                const findNodeList = findNode(states.parentList, node => {
                    return node.id === states.form.id
                })
                const ids = getAllChildId(findNodeList?.children)
                if (ids.includes(states.form.parentId)) {
                    E_Msg.newMessage('上级类别不可选择子类别','warning')
                    return
                }
            }
            states.form.branchCompanyIdList=states.branchCompany
            const params: any = {
                ...states.form,
            }
            states.saveLoading = true
            const method = states.updateType == 'edit' ? 'update' : 'save'
            PlantLocationApi[method](params)
                .then(() => {
                    ElMessage({ message: '操作成功', type: 'success' })
                    E_Msg.newMessage('操作成功')
                    handleClose()
                    emits('success')

                    states.saveLoading = false
                })
                .catch(() => {
                    states.saveLoading = false
                })
        }
    })
}
// 获取树
const getParentTree = () => {
    PlantLocationApi.allPlantLocation({}).then(res => {
        states.parentList = [
            {
                plantName: '厂房位置',
                id: '-1',
                children: res.data,
            },
        ]
    })
    // })
}

const handleClose = () => {
    formRef.value.resetFields()
    states.dialogVisible = false
}

defineExpose({ startAddData, startEditData })
</script>
<style scoped lang="scss">
</style>
