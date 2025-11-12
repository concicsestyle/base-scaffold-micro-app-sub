<template>
      <el-card class="bt-view__card--layout-full tree-card" :body-style="{ flex: '1' }">
        <template #header>工种组</template>
        <el-input
            maxlength="60"
            :show-word-limit="false"
            v-model.trim="states.workTypeGroupName"
            placeholder="请输入"
            clearable
            @clear="search"
            class="search-content"
            @keyup.enter="search"
        >
            <template #suffix>
                <el-icon style="cursor: pointer" color="#A5B3CF" @click="search">
                    <Search></Search>
                </el-icon>
            </template>
        </el-input>
        <div class="buttons-div">
            <el-button v-hasPermi="['job:tree:add']" type="primary" @click="startAdd">新&nbsp;增</el-button>
        </div>
        <el-scrollbar class="scrollbar">
            <el-tree
                ref="elTreeRef"
                :data="states.treeData"
                highlight-current
                node-key="id"
                :expand-on-click-node="false"
                :props="{ label: 'workTypeGroupName', children: 'children' }"
                default-expand-all
                class="tree-class standard-tree"
                :filter-node-method="filterNode"
                @current-change="onCurrentChange"
            >
                <template #default="{ node, data }">
                    <div class="ever-page-button-register__tree--item">
                        <span class="ever-page-button-register__tree--title">
                            <el-tooltip
                                class="box-item"
                                effect="dark"
                                :content="
                                    data.workTypeGroupCode
                                        ? `${data.workTypeGroupCode}(${data.workTypeGroupName})`
                                        : data.workTypeGroupName
                                "
                                placement="top-start"
                            >
                                <span >{{ data.workTypeGroupName }}</span>
                                <!-- <span v-else>
                                    <span>{{ data.workTypeGroupCode }}</span>
                                    <span>({{ data.workTypeGroupName }})</span>
                                </span> -->
                            </el-tooltip>
                        </span>
                        <div  class="ever-page-button-register__tree--btn">
                            <span v-hasPermi="['job:tree:edit']"  v-if="node.level == 2"  @click.stop="startEdit(data)"><EditPen></EditPen></span>
                            <span 
                                v-hasPermi="['job:tree:del']" 
                                v-if="node.level == 2" 
                                @click.stop="deleteGroup(data)"
                            ><Delete></Delete
                            ></span>
                        </div>
                    </div>
                </template>
            </el-tree>
        </el-scrollbar>
        <!-- 左侧新增/修改弹窗 -->
        <groupOperationDialog ref="groupOperationDialogRef" @succeed="init"></groupOperationDialog>
    </el-card>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, EditPen, Delete } from '@element-plus/icons-vue'
import { E_Msg } from '@/utils/message/index'
import workTypeGroupApi from '@/api/basic/work-type-group-api'
import groupOperationDialog from './group-operation-dialog.vue'
const emits = defineEmits(['groupClick', 'groupChange'])

const elTreeRef = ref()
const groupOperationDialogRef = ref()

const states = reactive({
    workTypeGroupName: '',
    treeData: [
        {
            workTypeGroupName: '工种组',
            id: '',
            children: [],
        },
    ],
})
// 获取树
const init = () => {
    workTypeGroupApi.list({ workTypeGroupName: states.workTypeGroupName || undefined, key: 1 }).then(res => {
        states.treeData[0].children = res.data
    })
}
init()
const onCurrentChange = data => {
    emits('groupClick', data.id)
}

const startAdd = () => {
    groupOperationDialogRef.value.startAddData()
}

// 左侧树编辑
const startEdit = data => {
    groupOperationDialogRef.value.startEditData(data)
}
// 删除数据
const deleteGroup = data => {
        E_Msg.confirm('确认要删除这条信息吗', `删除后的数据无法恢复，请谨慎操作！`).then(() => {
             workTypeGroupApi.deleteId({ id: data.id })
            .then(() => {
                E_Msg.newMessage('删除成功');
                init()
                emits('groupClick', '')
            })
         
        })
}
const search = () => {
    elTreeRef.value!.filter(states.workTypeGroupName)
}
const filterNode = (value, data) => {
    if (!value || data.id == -1) return true
    return data.workTypeGroupName.includes(value)
}


defineExpose({
    init,
})
</script>
<style scoped lang="scss">

</style>
