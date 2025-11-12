<template>

    <div
        class="bt-gantt-progressbar"
        :class="{
            normal: ![1,3].includes(Number(data.billStatus)),
            warning: [1,3].includes(Number(data.billStatus)),
            'drag-disabled':data.dataSource =='first_plan'|| ![1,3].includes(Number(data.billStatus)),
            hidden: data.isHidden==1
        }"
        :style="{ width: state.width + 'px', top: state.y + 'px', left: state.x + 'px' }"
    >
        <div class="bt-gantt-resize-left" @mousedown="onLeftDown" @mouseup="onLeftUp"></div>
        <div v-if="data.isDel!==1" class="bt-gantt-resize-right" @mousedown="onRightDown" @mouseup="onRightUp"></div>
        <!-- 悬浮提示 -->
        <el-tooltip
            class="box-item"
            effect="dark"
            placement="right"
            :content="'WBS编码:'+props.data.wbsCode+ '负荷占比:'+props.data.loadProportionStr+  props.data.planStartTime+' ~ '+props.data.planEndTime"
        >
            <div style="width: 100%; height: 100%; overflow: hidden; line-height: 24px">
                WBS编码 {{ props.data.wbsCode || '' }} {{ props.data.planStartTime }}-{{
                    props.data.planEndTime
                }}
                负荷占比 {{ props.data.loadProportionStr }}
            </div>

        </el-tooltip>
    </div>
</template>
<script setup lang="ts">
import { reactive, watch } from 'vue'
import dayjs from 'dayjs'
// 消息提示
const emits = defineEmits(['draged'])

//属性
const props = defineProps({
    planStartTime: {
        type: String,
    },
    planEndTime: {
        type: String,
    },
    /**
     * 数据
     */
    data: {
        type: Object,
    },
    //所在行
    rowIndex: {
        type: Number,
    },
    /**
     * 片宽度
     */
    pieceWidth: {
        type: Number,
    },
})
//状态值
const state = reactive({
    mode: 'move',
    x: 0,
    y: 0,
    width: 0,
    toolTxt: '',
    realX: 0,
    realWidth:0,
})

/**
 * 更新块位置大小
 */
const update = () => {
    //重新计算宽度
    let offsetDay = undefined
    const dayCount = dayjs(props.data.feakPlanEndTime).diff(props.data.feakPlanStartTime, 'day')+1
    offsetDay = dayjs(props.data.feakPlanStartTime).diff(props.planStartTime, 'day')
    let realOffsetDay = undefined
    const realDayCount = dayjs(props.data.planEndTime).diff(props.data.planStartTime, 'day')+1
    realOffsetDay = dayjs(props.data.planStartTime).diff(props.planStartTime, 'day')
    state.realWidth = realDayCount * (props.pieceWidth || 0)
    state.realX = realOffsetDay * props.pieceWidth
    state.width = dayCount * (props.pieceWidth || 0)
    state.x = offsetDay * props.pieceWidth
    state.y = props.rowIndex * 40 + 8
}

/**
 * 更新位置
 * @param x 横向
 * @param y 纵向
 */
const updatePosition = (x: number, y: number, data) => {
    const isHidden = dayjs(data.planEndTime).diff(props.planEndTime, 'day')
    let dayLength=undefined
    if (!(isHidden < 0)) {
        dayLength = dayjs(dayjs(props.planEndTime).add(1,'day')).diff(data.planStartTime, 'day')
    } else {
        dayLength = dayjs(data.planEndTime).add(1,'day').diff(data.planStartTime, 'day')
    }
    if (state.mode == 'right') {
        state.realWidth += x
        state.width += x
    } else if (state.mode == 'left') {
        state.realX += x
        state.x += x
        state.realWidth -= x
        state.width -= x
    } else {
        state.realX += x
        state.x += x
        state.y += y
        state.width = dayLength * (props.pieceWidth || 0)
    }

}

/**
 * 移动结束优化位置
 */
const moveEnd = () => {
    const planStartTime = dayjs(props.planStartTime).add(state.realX / props.pieceWidth, 'day')
    const planEndTime = planStartTime.add(state.realWidth / props.pieceWidth, 'day').add(-1, 'day')
    state.realWidth = Math.trunc(state.realWidth / props.pieceWidth) * props.pieceWidth
    state.width = Math.trunc(state.width / props.pieceWidth) * props.pieceWidth
    if (!(dayjs(planEndTime).diff(props.data.deliveryDate, 'day') < 0)) {
        state.x = dayjs(props.data.deliveryDate).diff(props.planStartTime, 'day') * props.pieceWidth
        state.realX = dayjs(props.data.deliveryDate).diff(props.planStartTime, 'day') * props.pieceWidth
        ElMessage({ message: '该节点实际调整要在项目计划时间范围内，不能超过【结束时间】！', type: 'error' })
    } else {
        state.x = Math.trunc(state.x / props.pieceWidth) * props.pieceWidth
        state.realX = Math.trunc(state.realX / props.pieceWidth) * props.pieceWidth
    }
    calcDate()
}

/**
 * 计算日期
 */
const calcDate = () => {
    const planStartTime = dayjs(props.planStartTime).add(state.realX / props.pieceWidth, 'day')
    const planEndTime = planStartTime.add(state.realWidth / props.pieceWidth, 'day').add(-1, 'day')
    let newstartDate = ''
    let newendDate = ''
    newstartDate = planStartTime.format('YYYY-MM-DD')
    newendDate = planEndTime.format('YYYY-MM-DD')
    if (props.data.planStartTime != newstartDate || props.data.planEndTime != newendDate) {
            props.data.planStartTime = newstartDate
            props.data.planEndTime = newendDate
        // TODO
        emits('draged', props.data)
    }
}
const onLeftDown = () => {
    state.mode = 'left'
}

const onRightDown = () => {
    state.mode = 'right'
}

const onLeftUp = () => {
    state.mode = 'move'
}

const onRightUp = () => {
    state.mode = 'move'
}

watch(
    () => props.data,
    () => {
        update()
    },
    { immediate: true },
)
watch(
    () => props.pieceWidth,
    () => {
        update()
    },
    { immediate: true },
)
defineExpose({
    updatePosition,
    moveEnd,
    x: state.x,
    y: state.y,
})
</script>
