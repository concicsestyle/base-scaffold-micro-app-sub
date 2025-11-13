<template>
      <el-card class="bt-view__card--layout-full tree-card" :body-style="{ flex: '1' }">
        <template #header>厂房位置</template>
        <!-- <el-input
            maxlength="60"
            :show-word-limit="false"
            v-model.trim="states.plantName"
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
            <el-button type="primary" @click="startAdd">新&nbsp;增</el-button>
        </div> -->
        <el-scrollbar class="scrollbar">
            <el-tree
                ref="elTreeRef"
                :data="states.treeData"
                highlight-current
                node-key="id"
                :expand-on-click-node="false"
                :props="{ label: 'plantName', children: 'children' }"
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
                                    :content="data.plantCode ? `${data.plantCode}(${data.plantName})` : data.plantName"
                                    placement="top-start"
                                >
                                    <!-- <span v-if="data.plantCode">{{ data.plantCode }}({{ data.plantName }})</span> -->
                                    <span>{{ data.plantName }}</span>
                                </el-tooltip>
                        </span>
                        <!-- <div v-show="node.level == 2" class="ever-page-button-register__tree--btn">
                            <span  @click.stop="startEdit(data)"><EditPen></EditPen></span>
                            <span 
                                  @click.stop="deleteGroup(data)"
                            ><Delete></Delete
                            ></span>
                        </div> -->
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
import { E_Msg } from '@/utils/message/index'
import PlantLocationApi from '@/api/basic/plant-location-api'
import groupOperationDialog from './group-operation-dialog.vue'
const emits = defineEmits(['groupClick', 'groupChange'])

const elTreeRef = ref()
const groupOperationDialogRef = ref()

const states = reactive({
    plantName: '',
    treeData: [
        {
            plantName: '厂房位置',
            id: '',
            children: [],
        },
    ],
})
// 获取树
const init = () => {
    PlantLocationApi.allPlantLocation({}).then(res => {
        states.treeData[0].children = res.data
       
    })
}
init()
const onCurrentChange = data => {
    emits('groupClick', data.plantCode)
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
    // E_Msg.confirm('删除确认','删除后的数据无法恢复，请谨慎操作！').then(() => {
    //     deleteId({ id: data.id })
    //         .then(() => {
    //             E_Msg.success('删除成功')
    //             init()
    //             emits('groupClick', '')
    //         })
    //         .catch(err => {
    //             E_Msg.warn(err.msg || err)
    //         })
    // })
}
const search = () => {
    elTreeRef.value!.filter(states.plantName)
}
const filterNode = (value, data) => {
    if (!value || data.id == -1) return true
    return data.plantName.includes(value)
}


defineExpose({
    init,
})
</script>
<style scoped lang="scss">

</style>
