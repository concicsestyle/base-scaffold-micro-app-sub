<template>
    <div class="bt-gantt-table1">
        <ul class="bt-gantt-table-header1" ref="tableHeader">
            <li
                class="bt-gantt-table-column1"
                :style="{ width: column.width }"
                v-for="column in props.columnList"
                :key="column.prop"
            >
                {{ column.label }}
            </li>
            <!-- <li
                class="bt-gantt-table-column"
                :style="{ width: state.scrollerWidth + 'px', border: 'none' }"
            ></li> -->
        </ul>
        <div class="bt-gantt-table-container1" v-if="!state.loading || !loading">
            <div class="bt-gantt-table-content1" ref="tableContent" @scroll="onTableScroll">

                <ul
                    class="bt-gantt-table-row1"
                    v-for="(data, index) in props.dataList"
                    :key="data.id"
                    @click.stop="onClick($event, data)"
                >

                    <li
                        class="bt-gantt-table-column1"
                        v-for="column in props.columnList"
                        :class="{ 'hight-style':data.isClick&&column.merge==false&&column.prop !== 'no','cell-click': column.prop == 'workCenterCode','txtProject-warn': (Number(data.loadProportion)*100 > 100 && column.prop == 'loadProportionStr')||(Number(data.totalLoadProportion)*100 > 100 && column.prop == 'totalLoadProportionStr'),'txt-warn': Number(data.max) > 100 && column.prop == 'maxload' }"
                        :style="{
                            width: column.width,
                            height: column.merge ? data.height + 'px' : null,
                            background: column.merge ? '#fff' : null,
                            'z-index': data.height ? 99 : 1,
                        }"
                        :key="column.prop"
                        @click="onCellClick($event, { column, data })"
                    >
                        <el-tooltip
                            class="box-item"
                            effect="dark"
                            :content="column.prop == 'no' ? index + 1 : (data[column.prop] || '-')"
                            placement="bottom"
                        >
                            <div style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
                                {{ column.prop == 'no' ? index + 1 : (data[column.prop] || '-') }}
                            </div>
                        </el-tooltip>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted,watch,nextTick } from 'vue'
import { groupByCenter, handleMaxload } from './hooks'

const loading = ref(false)
const emits = defineEmits(['onScrollH', 'click', 'cellClick'])
const props = defineProps({
    dateList: {
        type: Array,
    },
    dataList: {
        type: Array,
    },
    columnList: {
        type: Array,
    },
    diagramData: {
        type: Array,
    },
    pageType: {
        type: String,
    },
    tablaLoading: {
        type: Number,
    },
})

const tableHeader = ref()
const tableContent = ref()

const state = reactive({
    tableVerticalScroll: false,
    // scrollerWidth: 0,
    diagramWidth: 0,
    tableData: [],
    loading: false,
})
watch(
    [
        () => props.diagramData,
        () => props.dataList,
        () => props.pageType,
    ],
    () => {
        let groupByCenterData = {}
        let maxloadList = []
        if (props.dataList&&props.tablaLoading==1) {
            groupByCenterData = groupByCenter(props.dataList, props.pageType)
            maxloadList = handleMaxload(props.diagramData, props.pageType)
        }
        if (props.diagramData&&props.tablaLoading==1) {
            // 处理行合并
            state.loading = true
            if (props.pageType !== 'project') {
                loading.value = true
                nextTick(() => {
                    for (const key in groupByCenterData) {
                        let _index = props.dataList.findIndex(item => item.workCenterId == key)
                        props.dataList[_index]['height'] = groupByCenterData[key].length * 40
                        // props.dataList[_index]['maxload'] = `${(props.dataList[_index].workCenterGroupTotalLoadProportion*100).toFixed(2)}%`
                        // props.dataList[_index]['max'] = (props.dataList[_index].workCenterGroupTotalLoadProportion*100).toFixed(2)
                        // 处理最大负荷占比
                        // 获取超负荷的最大占比
                        /* const a = maxload.filter(item => item.workCenterId == key)
                        // 当前工作中心不存在超负荷的数据
                        // TODO
                        let max = 0
                        for (const i in groupByCenterData[key]) {
                            max = groupByCenterData[key][i].loadProportion + max
                        }
                        a.length != 0 ? props.dataList[_index]['maxload'] = `${a[0]?.maxload}% ` : props.dataList[_index]['maxload'] = `${max * 100}%`
                        a.length != 0 ? props.dataList[_index]['max'] = a[0]?.maxload : props.dataList[_index]['max'] = max * 100 */
                    }
                    /* 2023 -09 - 18迭代  一个工作中心对应多个项目节点:
                    1.如果节点无重合时间，那么总负荷最大占比取多节点最大的占比即可:
                    2.如果节点有重合时间，那么总负荷最大占比取重合时间段内的负荷相加，
                    多个重合时间，每个重合的部分取任意一天相加；得出多个重合时间  取对大的那个 */
                    for (const i of props.dataList) {
                        let _max = maxloadList.find(item => item.workCenterId == i.workCenterId)
                        i['maxload'] =  _max?.maxload?`${Number(_max.maxload).toFixed(2)}%`:i.loadProportionStr
                        i['max'] = _max?.maxload?`${Number(_max.maxload).toFixed(2)}`:i.loadProportion
                    }
                    setTimeout(() => {
                        loading.value = false
                    }, 10)
                })
            } else {
                loading.value = true
                for (const key in groupByCenterData) {
                    let _index = props.dataList.findIndex(item => item.projectName == key)
                    props.dataList[_index]['height'] = groupByCenterData[key].length * 40
                    props.dataList[_index]['workCenterGroupTotalLoadProportion'] = (props.dataList[_index].workCenterGroupTotalLoadProportion*100).toFixed(2)
                    // 处理最大负荷占比
                    // 获取超负荷的最大占比
                    /* const a = maxload.filter(item => item.projectId == key)
                    props.dataList[_index]['maxload'] = a[0]?.maxload
                    // 当前工作中心不存在超负荷的数据
                    let max = 0
                    for (const i in groupByCenterData[key]) {
                        max = groupByCenterData[key][i].loadProportion + max
                        a.length != 0 ? props.dataList[_index]['max'] = a[0]?.maxload : props.dataList[_index]['max'] = max * 100 */
                }
                setTimeout(() => {
                    loading.value = false
                }, 10)
            }
            state.loading = false
        }
    },
    {
        immediate: true,
        deep: true,
    },
)

// 处理数据用于合并
const onTableScroll = () => {
    //表格滚动条滚动
    tableHeader.value.scrollLeft = tableContent.value.scrollLeft
    emits('onScrollH', tableContent.value.scrollTop)
}
onMounted(() => {
    //计算是否需要做滚动条宽度补偿
    state.tableVerticalScroll = tableContent.value.scrollHeight > tableContent.value.clientHeight
    // if (state.tableVerticalScroll) {
    //     state.scrollerWidth = tableContent.value.offsetWidth - tableContent.value.clientWidth
    // } else {
    //     state.scrollerWidth = 0
    // }
})
const updateOffset = offsetTop => {
    tableContent.value.scrollTop = offsetTop
}
const onClick = ($event, data) => {
    props.dataList.map(v => {
        if (v.id == data.id) {
            v.isClick = true
        } else {
            v.isClick = false
        }
    })
    emits('click', data)
}
const onCellClick = ($event, obj) => {
    if (obj.column.prop == 'workCenterCode') {
        emits('cellClick', obj.data)
    }
}
defineExpose({
    updateOffset,
})
</script>
