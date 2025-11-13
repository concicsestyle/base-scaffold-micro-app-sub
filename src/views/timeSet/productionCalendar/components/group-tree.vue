<template>
      <el-card class="bt-view__card--layout-full tree-card" :body-style="{ flex: '1' }">
        <template #header>工作日历</template>
        <el-input
            maxlength="60"
            :show-word-limit="false"
            v-model.trim="states.calendarName"
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
        <!-- <div class="buttons-div">
            <el-button type="primary" @click="startAdd">新&nbsp;增</el-button>
        </div> -->
        <el-scrollbar class="scrollbar">
            <el-tree
                ref="elTreeRef"
                :data="states.treeData"
                highlight-current
                node-key="id"
                :expand-on-click-node="false"
                :props="{ label: 'calendarName', children: 'children' }"
                default-expand-all
                class="tree-class standard-tree mt-2"
                :filter-node-method="filterNode"
                @current-change="onCurrentChange"
            >
                <template #default="{ node, data }">
                    <div class="ever-page-button-register__tree--item">
                        <span class="ever-page-button-register__tree--title">
                            <el-tooltip
                                class="box-item"
                                effect="dark"
                                :content="data.calendarName"
                                placement="top-start"
                            >
                                <span>

                                    <span class="default-text" v-if="data.isDefault=='1'">默</span>
                                    {{ data.calendarName }}
                                </span>
                            </el-tooltip>
                        </span>
                       
                    </div>
                </template>
            </el-tree>
        </el-scrollbar>
   
    </el-card>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, EditPen, Delete } from '@element-plus/icons-vue'
import { E_Msg } from '@/utils/message/index'
import CalendarApi from '@/api/basic/basic-calendar-api'
const emits = defineEmits(['groupClick', 'clearCanlendar', 'getCalendar'])

const elTreeRef = ref()

const states = reactive({
    calendarName: '',
    treeData: [
        {
            calendarName: '工作日历',
            id: '',
            children: [],
        },
    ],
})
// 获取树
const init = () => {
    CalendarApi.list({ calendarName: states.calendarName || undefined, temp: 1 }).then(res => {
        states.treeData[0].children = res.data
         // 每次更新同步一下右侧的下拉筛选
         emits('getCalendar', res.data)
    })
}
init()
const onCurrentChange = data => {
    emits('groupClick', data)
}

const search = () => {
    init()
    elTreeRef.value!.filter(states.calendarName)
}
const filterNode = (value, data) => {
    if (!value || data.id == -1) return true
    return data.calendarName.includes(value)
}
// 设置选中节点
const setCurrentKey = id => {
    //树节点id，用于选中节点
    if (id) {
        nextTick(() => {
            elTreeRef.value.setCurrentKey(id)
        })
    }
}
// 删除数据
const deleteCalendar = id => {
        E_Msg.confirm('确认要删除这条信息吗', `删除后的数据无法恢复，请谨慎操作！`).then(() => {
            CalendarApi.getDelete({ id: id })
            .then(() => {
                E_Msg.newMessage('删除成功')
                init()
                    emits('clearCanlendar')
            })
         
        })
}

defineExpose({ init, deleteCalendar, setCurrentKey })
</script>
<style scoped lang="scss">
.default-text {
    color: blue;
    padding: 2px;
    border: 1px solid blue;
    border-radius: 50%;
}
</style>
