<template>
    <div class="bt-gantt-diagram">
        <div class="bt-gantt-diagram-header" ref="diagramHeader">
            <div v-if="props.viewType == 'Month'" class="date-row">
                <template v-for="year in state.dateList" :key="year.id">
                    <div
                        class="year"
                        :style="{ width: year.yearLength + 'px' }"
                        :title="year.label"
                    >
                        {{ year.label }}
                    </div>
                </template>
                <!--滚动条补偿占位符-->
                <div :style="{ width: state.scrollerWidth + 'px' }"></div>
            </div>
            <div v-if="props.viewType !== 'Month'" class="date-row">
                <template v-for="year in state.dateList" :key="year.id + '_month'">
                    <div
                        class="year"
                        :style="{ width: month.monthLenght + 'px' }"
                        v-for="month in year.month"
                        :title="year.label + '/' + format(month.id, 'M月')"
                        :key="month.id"
                    >
                        {{ year.label + '/' + format(month.id, 'M月') }}
                    </div>
                </template>
                <!--滚动条补偿占位符-->
                <div :style="{ width: state.scrollerWidth + 'px' }"></div>
            </div>
            <div v-if="props.viewType == 'Month'" class="date-row">
                <template v-for="year in state.dateList" :key="year.id + '_month'">
                    <div
                        class="month"
                        :style="{ width: month.monthLenght + 'px' }"
                        v-for="month in year.month"
                        :key="month.id"
                        :title="format(month.id, 'M月')"
                    >
                        {{ format(month.id, 'M月') }}
                    </div>
                </template>
                <!-- 滚动条补偿占位符 -->
                <div :style="{ width: state.scrollerWidth + 'px' }"></div>
            </div>
            <div class="date-row" v-if="props.viewType == 'Day'">
                <template v-for="year in state.dateList" :key="year.id + '_date'">
                    <div
                        class="date"
                        :style="{ width: state.pieceWidth + 'px' }"
                        v-for="date in year.date"
                        :key="date.id"
                        :title="format(date.id, 'DD')"
                    >
                        {{ format(date.id, 'DD') }}
                    </div>
                </template>
                <!--滚动条补偿占位符-->
                <div :style="{ width: state.scrollerWidth + 'px' }"></div>
            </div>
            <div class="date-row" v-if="props.viewType == 'Week'">
                <template v-for="year in state.dateList" :key="year.id + '_week'">
                    <div
                        class="date"
                        :style="{ width: week.weekLenght + 'px' }"
                        v-for="week in year.week"
                        :title="week.id"
                        :key="week.id"
                    >
                        W{{ week.id }}
                    </div>
                </template>
                <!--滚动条补偿占位符-->
                <div :style="{ width: state.scrollerWidth + 'px' }"></div>
            </div>
        </div>
        <div class="bt-gantt-diagram-container">
            <div class="bt-gantt-diagram-content" ref="diagramContent" @scroll="onDiagramScroll">
                <div
                    class="bt-gantt-diagram-row"
                    :style="{ width: state.diagramWidth + 'px' }"
                    v-for="data in props.dataList.length == 0 ? state.fakeDataList : props.dataList"
                    :key="data.id"
                ></div>
                <DiagramItem
                    v-for="(data, index) in props.dataList"
                    :key="data.id + '_layer'"
                    :data="data"
                    :ref="data.id + '_layer'"
                    :rowIndex="index"
                    :pieceWidth="state.pieceWidth"
                    :planStartTime="props.planStartTime"
                    :planEndTime="props.planEndTime"
                    @mousedown="onMouseDown($event, data)"
                    @draged="onDraged($event)"
                ></DiagramItem>
                <div v-if="state.refersh">
                    <DiagramItemOverlay
                        v-for="mask in state.maskList"
                        :planStartTime="props.planStartTime"
                        :planEndTime="props.planEndTime"
                        :mask="mask"
                        :pieceWidth="state.pieceWidth"
                        :key="mask.id"
                    ></DiagramItemOverlay>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, watch, getCurrentInstance, nextTick } from 'vue'
import dayjs from 'dayjs'
import { initDate, handleGroupsData } from './hooks'
import DiagramItem from './diagram-item.vue'
import DiagramItemOverlay from './diagram-item-overlay.vue'
import weekOfYear from 'dayjs/plugin/weekOfYear'

dayjs.extend(weekOfYear)
const emits = defineEmits(['onScrollH', 'syncLoad', 'getDiagramWidth'])
const instance = getCurrentInstance()
const diagramHeader = ref()
const diagramContent = ref()

const state = reactive({
    refersh: true,
    dateList: [],
    maskList: [],
    maxload: [],
    pieceWidth: 40,
    diagramWidth: 0,
    scrollerWidth: 0,
    verticalScroll: false,
    moving: false,
    moveData: null,
    x: 0,
    y: 0,
    prePosition: {
        x: 0,
        y: 0,
    },
    fakeDataList: [],
    dataList: [],
    nowPosition: 0,
})

const props = defineProps({
    planStartTime: {
        type: String,
    },
    planEndTime: {
        type: String,
    },
    viewType: {
        type: String,
    },
    dataList: {
        type: Array,
    },
    pageType: {
        type: String,
    },
    tableData: {
        type: Array,
    },
})
// state.dateList = initDate(props.planStartTime, props.planEndTime)
// 获取遮罩层数据
// state.maskList = []
watch(
    () => props.planEndTime,
    v => {
        if (v) {
            state.dateList = initDate(props.planStartTime, props.planEndTime)
        }
    },
    { immediate: true },
)
watch(
    [() => props.pageType, () => props.dataList, () => props.viewType],
    () => {
        if (!props.dataList.length) {
            for (let i = 0; i < props.tableData?.length; i++) {
                state.fakeDataList.push({
                    id: String(i),
                })
            }
        }
        if (props.dataList.length !== 0) {
            state.dataList = computeTime(props.dataList)
        }
        if (props.dataList.length && props.pageType !== 'project') {
            state.maskList = []
            nextTick(() => {
                // 获取遮罩层数据
                state.maskList = handleGroupsData(props.dataList, props.pageType)
            })
        } else {
            state.maskList = []
        }
        if (props.viewType == 'Day') {
            state.pieceWidth = 40
        }
        if (props.viewType == 'Month') {
            state.pieceWidth = 10
        }
        if (props.viewType == 'Week') {
            state.pieceWidth = 20
        }
        let width = 0
        console.log('wwwwwwwwwwww', state.dateList)
        state.dateList.forEach(item => {
            item.monthLenght = 0
            item.weekLenght = 0
            item.month.forEach(e => {
                e.monthLenght = 0
            })
            item.week.forEach(e => {
                e.weekLenght = 0
            })
            // if (item.date.length* state.pieceWidth < 1048) {
            //     item.yearLength = 1048
            //     if (props.viewType !== 'Month') {
            //         let useLenght = 0
            //         item.month.forEach(e => {
            //             useLenght =  e.date.length+useLenght
            //         })
            //         item.month.forEach(e => {
            //             e.monthLenght =  (e.date.length/useLenght)*1048
            //         })
            //     } else {
            //         item.month.forEach(e => {
            //             e.monthLenght = 1048 / item.month.length
            //         })
            //     }
            //     let weekUseLenght = 0
            //     item.week.forEach(e => {
            //         weekUseLenght =  e.date.length+weekUseLenght
            //     })
            //     item.week.forEach(e => {
            //         e.weekLenght =  (e.date.length/weekUseLenght)*1048
            //     })
            // }else {
            item.yearLength = item.date.length * state.pieceWidth
            item.month.forEach(e => {
                e.monthLenght = e.date.length * state.pieceWidth
            })
            item.week.forEach(e => {
                e.weekLenght = e.date.length * state.pieceWidth
            })

            // }
            width += item.date.length * state.pieceWidth
        })
        state.diagramWidth = width
        emits('getDiagramWidth', width)
        if (diagramContent?.value?.scrollLeft) {
            diagramContent.value.scrollLeft = 0
        }
    },
    { immediate: true },
)
const computeTime = dataList => {
    dataList.forEach(e => {
        if (dayjs(e.planStartTime).isAfter(dayjs(props.planEndTime))) {
            e.feakPlanStartTime = props.planEndTime
            e.feakPlanEndTime = props.planEndTime
            e.isHidden = 1
        } else if (dayjs(e.planEndTime).isAfter(dayjs(props.planEndTime))) {
            e.feakPlanStartTime = e.planStartTime
            e.feakPlanEndTime = dayjs(props.planEndTime).format('YYYY-MM-DD')
            e.isDel = 1
        } else {
            e.feakPlanStartTime = e.planStartTime
            e.feakPlanEndTime = e.planEndTime
            e.isHidden = 0
            e.isDel = 0
        }
    })
    return dataList
}
const onDiagramScroll = () => {
    state.verticalScroll = diagramHeader.value.scrollLeft = diagramContent.value.scrollLeft
    if (state.verticalScroll) {
        state.scrollerWidth =
            10 + diagramContent.value.offsetWidth - diagramContent.value.clientWidth
    } else {
        state.scrollerWidth = 10
    }
    emits('onScrollH', diagramContent.value.scrollTop)
}
const updateOffset = offsetTop => {
    diagramContent.value.scrollTop = offsetTop
}
const format = (date, formatter) => {
    return dayjs(date).format(formatter)
}
defineExpose({
    updateOffset,
})

onMounted(() => {
    document.documentElement.addEventListener('mousemove', onMouseMove)
    document.documentElement.addEventListener('mouseup', onMouseUp)
    document.documentElement.addEventListener('mouseleave', onMouseUp)
})
const onMouseDown = (event, data) => {
    // 配置禁止拖拽
    if (data.dataSource == 'first_plan') {
        state.moving = false
        return
    }
    if ([1, 3].includes(Number(data.billStatus))) {
        state.moving = true
        state.moveData = data
        state.prePosition.x = event.pageX
        state.prePosition.y = event.pageY
    }
}
const onMouseMove = event => {
    if (!state.moving) {
        return
    }
    instance.refs[`${state.moveData.id}_layer`][0].updatePosition(
        event.pageX - state.prePosition.x,
        0,
        state.moveData,
    )
    state.prePosition.x = event.pageX
    state.nowPosition = event.pageX - state.prePosition.x
}
const onMouseUp = _event => {
    state.moving = false
    if (state.moveData) {
        instance.refs[`${state.moveData.id}_layer`][0]?.moveEnd()
    }
}

const onDraged = _event => {
    state.maskList = []
    state.refersh = false
    // 反向更新数据道dataList中
    props.dataList.forEach(item => {
        if (item.id == _event.id) {
            item.planStartTime = _event.planStartTime
            item.planEndTime = _event.planEndTime
            instance.refs[`${state.moveData.id}_layer`][0].updatePosition(
                state.nowPosition,
                0,
                item,
            )
        }
    })
    state.dataList = computeTime(props.dataList)
    nextTick(() => {
        if (props.pageType !== 'project') {
            // 获取遮罩层数据
            state.maskList = handleGroupsData(props.dataList, props.pageType)
        } else {
            state.maskList = []
        }
    })
    // 抛出事件，拖拽后同步表格的最大负荷数据
    emits('syncLoad', props.dataList)
    state.refersh = true
}
</script>
