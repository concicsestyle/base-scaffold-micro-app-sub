<template>
    <div style="display: flex; flex-direction: column; width: 100%; height: 100%">
        <div style="position: relative; width: 100%">
            <el-button @click="onTypeClick('day')">年</el-button>
            <el-button @click="onTypeClick('month')">月</el-button>
            <el-button @click="onTypeClick('week')">周</el-button>
        </div>
        <div style="position: relative; flex: 1; width: 100%">
            <div style="position: absolute; width: 100%; height: 100%; overflow: auto">
                <div class="bt-gantt1">
                    <GanttTable
                        :dataList="state.dataList"
                        :columnList="state.columnList"
                        style="width: 400px"
                        ref="tableRef"
                        @onScrollH="onTableScrollH"
                    ></GanttTable>
                    <GanttDiagram
                        :viewType="state.viewType"
                        :dataList="state.dataList"
                        :planStartTime="state.planStartTime"
                        :planEndTime="state.planEndTime"
                        ref="diagramRef"
                        @onScrollH="onDiagramScrollH"
                    ></GanttDiagram>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import GanttTable from './components/table.vue'
import GanttDiagram from './components/diagram.vue'
import { config, getData } from './components/index'

const tableRef = ref()
const diagramRef = ref()
const state = reactive({
    planStartTime: null,
    planEndTime: null,
    dataList: [],
    columnList: [],
    viewType: 'day',
})

const onTableScrollH = scrollTop => {
    diagramRef.value.updateOffset(scrollTop)
}
const onDiagramScrollH = scrollTop => {
    tableRef.value.updateOffset(scrollTop)
}

const onTypeClick = type => {
    state.viewType = type
}
state.columnList = config.column
const demoData = getData()
state.dataList = demoData.datas
state.planStartTime = demoData.planStartTime
state.planEndTime = demoData.planEndTime
</script>
<style lang="scss">
@use 'index.scss';
</style>
