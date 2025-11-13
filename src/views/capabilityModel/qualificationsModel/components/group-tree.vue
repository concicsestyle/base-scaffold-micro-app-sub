<template>
      <el-card class="bt-view__card--layout-full tree-card" :body-style="{ flex: '1' }">
        <template #header>资质组</template>
        <el-input
            maxlength="60"
            :show-word-limit="false"
            v-model.trim="states.qualificationsGroupName"
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
            <el-button v-hasPermi="['job:quatree:add']" type="primary" @click="startAdd">新&nbsp;增</el-button>
        </div>
        <el-scrollbar class="scrollbar">
            <el-tree
                ref="elTreeRef"
                :data="states.treeData"
                highlight-current
                node-key="id"
                :expand-on-click-node="false"
                :props="{ label: 'qualificationsGroupName', children: 'children' }"
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
                                    data.qualificationsGroupName
                                "
                                placement="top-start"
                            >
                            <span>{{ data.qualificationsGroupName }}</span>
                            <!-- <span v-if="data.id == -1 || data.id == -2">{{ data.qualificationsGroupName }}</span>
                                <span v-else>{{
                                    `${data.qualificationsGroupCode}(${data.qualificationsGroupName})`
                                }}</span> -->
                            </el-tooltip>
                        </span>
                        <div class="ever-page-button-register__tree--btn">
                            <span v-hasPermi="['job:quatree:edit']"  v-if="node.level == 2"  @click.stop="startEdit(data)"><EditPen></EditPen></span>
                            <span
                                v-hasPermi="['job:quatree:del']" 
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
        <groupOperationDialog ref="groupOperationDialogRef"  :treeData="states.treeData" @succeed="init"></groupOperationDialog>
    </el-card>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, EditPen, Delete } from '@element-plus/icons-vue'
import { E_Msg } from '@/utils/message/index'
import qualificationsGroupApi from '@/api/basic/qualifications-group-api'
import groupOperationDialog from './group-operation-dialog.vue'
const emits = defineEmits(['groupClick', 'groupChange'])

const elTreeRef = ref()
const groupOperationDialogRef = ref()

const states = reactive({
    qualificationsGroupName: '',
    parentId: '',
    treeData: [
    {
            qualificationsGroupName: '人员资质',
            id: '-1',
            children: [],
        },
        {
            qualificationsGroupName: '组织资质',
            id: '-2',
            children: [],
        },
    ],
})
// 获取树
const init = () => {
    qualificationsGroupApi.list({ qualificationsGroupName: states.qualificationsGroupName || undefined, key: 1 }).then(
        res => {
            states.treeData[0].children = res.data.filter(e => e.qualificationsType == '-1') //人员资质
            states.treeData[1].children = res.data.filter(e => e.qualificationsType == '-2') //组织资质
        },
    )
}
init()
const onCurrentChange = data => {
    if (data.id == -1 || data.qualificationsType == -1) {
        states.parentId = '-1'
    } else {
        states.parentId = '-2'
    }
    emits('groupClick', data.id)
}

const startAdd = () => {
    groupOperationDialogRef.value.startAddData(states.parentId)
}

// 左侧树编辑
const startEdit = data => {
    groupOperationDialogRef.value.startEditData(data)
}
// 删除数据
const deleteGroup = data => {
    E_Msg.confirm('确认要删除这条信息吗', `删除后的数据无法恢复，请谨慎操作！`).then(() => {
            qualificationsGroupApi.deleteId({ id: data.id })
            .then(() => {
                    E_Msg.newMessage('删除成功');
                init()
                emits('groupClick', '')
            })
        })
}
const search = () => {
    elTreeRef.value!.filter(states.qualificationsGroupName)
}
const filterNode = (value, data) => {
    if (!value || data.id == -1) return true
    return data.qualificationsGroupName.includes(value)
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
