<template>
      <el-card class="bt-view__card--layout-full tree-card" :body-style="{ flex: '1' }">
        <template #header>刀具类别</template>
        <el-input
            maxlength="60"
            :show-word-limit="false"
            v-model.trim="states.toolTypeName"
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
<!--        <div class="buttons-div">-->
<!--            <el-button type="primary" @click="init">新&nbsp;增</el-button>-->
<!--        </div>-->
        <el-scrollbar class="scrollbar">
            <el-tree
                ref="elTreeRef"
                :data="states.treeData"
                highlight-current
                node-key="id"
                :expand-on-click-node="false"
                :props="{ label: 'toolTypeName', children: 'children' }"
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
                                    data.toolTypeCode
                                        ? `${data.toolTypeCode}(${data.toolTypeName})`
                                        : data.toolTypeName
                                "
                                placement="top-start"
                            >
                               <span >{{ data.toolTypeName }}</span>
<!--                                <span v-if="!data.id">{{ data.toolTypeName }}</span>-->
<!--                                <span v-else>-->
<!--                                    <span>{{ data.toolTypeCode }}</span>-->
<!--                                    <span>({{ data.toolTypeName }})</span>-->
<!--                                </span>-->
                            </el-tooltip>
                        </span>

                      <div class="ever-page-button-register__tree--btn">
                        <!-- 新增按钮：在层级1 和 其他层级都显示 -->
                        <span v-if="node.level === 1 || node.level > 1" @click.stop="startAdd(data)">
        <el-icon><Plus/></el-icon>
    </span>

                        <!-- 编辑按钮：只在层级>1（非第一层）时显示 -->
                        <span v-if="node.level > 1" @click.stop="startEdit(data)">
        <el-icon><EditPen/></el-icon>
    </span>

                        <!-- 删除按钮：只在层级>1（非第一层）时显示 -->
                        <span v-if="node.level > 1" @click.stop="deleteGroup(data)">
        <el-icon><Delete/></el-icon>
    </span>
                      </div>
                    </div>
                </template>
            </el-tree>
        </el-scrollbar>
        <!-- 左侧新增/修改弹窗 -->
        <groupOperationDialog  ref="groupOperationDialogRef" :treeData="states.treeData"  @succeed="init"></groupOperationDialog>
    </el-card>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, EditPen, Delete } from '@element-plus/icons-vue'
import { E_Msg } from '@/utils/message/index'
// import {deleteId,list } from '@/api/basic/work-type-group-api'
import { save,treeTool ,deleteId} from '@/api/basic/toolType-api'
import groupOperationDialog from './group-operation-dialog.vue'
const emits = defineEmits(['groupClick', 'groupChange'])

const elTreeRef = ref()
const groupOperationDialogRef = ref()

const states = reactive({
  toolTypeName: '',
    treeData: [
        {
          toolTypeCode: '', // 确保有所有必要字段
          toolTypeName: '刀具类别',
            id: '-1',
            children: [],
        },
    ],
})
// 获取树
const init = () => {
  treeTool({ toolTypeName: states.toolTypeName || undefined, temp: 2 }).then(res => {
        states.treeData[0].children = res.data
    })
  console.log("回调父组件刷新数据")
  // groupOperationDialogRef.value.startAddData();
}
init()
const onCurrentChange = data => {
    emits('groupClick', data.id)
}

const startAdd = (data) => {
    groupOperationDialogRef.value.startAddData(data.id);
}

// 左侧树编辑
const startEdit = data => {
    groupOperationDialogRef.value.startEditData(data)
}
// 删除数据
const deleteGroup = data => {
    E_Msg.confirm('确认要删除所选数据吗？', `删除后的数据无法恢复，请谨慎操作！`).then(() => {
        deleteId({ id: data.id })
            .then(() => {
                E_Msg.newMessage('删除成功');
                init()
                emits('groupClick', '')
            })
    })
}
const search = () => {
    elTreeRef.value!.filter(states.toolTypeName)
}
const filterNode = (value, data) => {
    if (!value || data.id == -1) return true
    return data.toolTypeName.includes(value)
}


defineExpose({
    init,
})
</script>
<style scoped lang="scss">

</style>
