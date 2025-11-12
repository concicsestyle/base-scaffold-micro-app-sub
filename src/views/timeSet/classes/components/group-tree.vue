<template>
      <el-card class="bt-view__card--layout-full tree-card" :body-style="{ flex: '1' }">
        <template #header>班次类别</template>
        <el-input
            maxlength="60"
            :show-word-limit="false"
            v-model.trim="states.rotationTypeName"
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
            <el-button type="primary" @click="startAdd" v-hasPermi="['classes:tree:add']">新&nbsp;增</el-button>
        </div>
        <el-scrollbar class="scrollbar">
            <el-tree
                ref="elTreeRef"
                :data="states.treeData"
                highlight-current
                node-key="id"
                :expand-on-click-node="false"
                :props="{ label: 'rotationTypeName', children: 'children' }"
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
                                    data.rotationTypeCode
                                        ? `${data.rotationTypeCode}(${data.rotationTypeName})`
                                        : data.rotationTypeName
                                "
                                placement="top-start"
                            >
                            <!-- v-if="data.id == -1" -->
                                <span >{{ data.rotationTypeName }}</span>
                                <!-- <span v-else>
                                    <span>{{ data.rotationTypeCode }}</span>
                                    <span>({{ data.rotationTypeName }})</span>
                                </span> -->
                            </el-tooltip>
                        </span>
                        <div v-show="node.level == 2" class="ever-page-button-register__tree--btn">
                            <span v-hasPermi="['classes:tree:add']" @click.stop="add(data)" ><Plus /></span>
                            <span v-hasPermi="['classes:tree:edit']"  @click.stop="startEdit(data)"><EditPen></EditPen></span>
                            <span  v-hasPermi="['classes:tree:del']"
                                  @click.stop="deleteGroup(data)"
                            ><Delete></Delete
                            ></span>
                        </div>
                    </div>
                </template>
            </el-tree>
        </el-scrollbar>
        <!-- 左侧新增/修改弹窗 -->
        <groupOperationDialog ref="groupOperationDialogRef"  :treeData="states.treeData" @succeed="init"></groupOperationDialog>
    </el-card>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, EditPen, Delete } from '@element-plus/icons-vue'
import { E_Msg } from '@/utils/message/index'
import RotationTypeApi from '@/api/basic/rotation-type-api'

import groupOperationDialog from './group-operation-dialog.vue'
const emits = defineEmits(['groupClick', 'groupChange'])

const elTreeRef = ref()
const groupOperationDialogRef = ref()

const states = reactive({
    rotationTypeName: '',
    parentId: '',
    treeData: [  {
            rotationTypeName: '班次类别',
            id: '-1',
            children: [],
        },],
})
// 获取树
const init = () => {
    RotationTypeApi.listPage({
        pageNumber: 1,
        pageSize: 999,
    }).then(res => {
        states.treeData[0].children = res.data
    })
}
init()
const onCurrentChange = data => {
    emits('groupClick', data.id)
}

const startAdd = () => {
    groupOperationDialogRef.value.startAddData(states.parentId)
}

// 左侧树新增
const add = data => {
    groupOperationDialogRef.value.startAddData(data.id)
}

// 左侧树编辑
const startEdit = data => {
    groupOperationDialogRef.value.startEditData(data)
}
// 删除数据
const deleteGroup = data => {
    E_Msg.confirm( '删除后的数据无法恢复，请谨慎操作！','确认要删除这条信息吗').then(() => {
            RotationTypeApi.deleteId({ id: data.id })
            .then(() => {
                E_Msg.newMessage('删除成功')
                init()
                emits('groupClick', '')
            })
        })
}
const search = () => {
    elTreeRef.value!.filter(states.rotationTypeName)
}
const filterNode = (value, data) => {
    if (!value || data.id == -1) return true
    return data.rotationTypeName.includes(value) || data.rotationTypeCode.includes(value)
}

defineExpose({
    init,
})
</script>
<style scoped lang="scss">
.tree-class {
    padding-bottom: 10px;
}

.buttons-div {
    padding: 10px 0;
}
.bt-view__card--layout-full {
    width: 100%;
    height: 100%;
    background-color: #fff;
}
::v-deep .el-card__body{
    height: calc(100% - 40px) !important;
}
.ever-page-button-register__tree--item {
    width: 100%;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 8px;

    .ever-page-button-register__tree--btn {
        display: none;
        font-size: 16px;
        line-height: 16px;
        // color: $bt-color;

        span {
            display: inline-block !important;
            width: 16px;
            height: 16px;
            margin-left: 8px;
        }
    }

    &:hover .ever-page-button-register__tree--btn {
        display: inline-block !important;
        width: max-content;
        position: relative;
        right: 20px;
    }

    .ever-page-button-register__tree--title {
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        padding-right: 10px;
    }
}
</style>
