<!--
 * @Description:
 * @Author: 张春蕾
 * @Date: 2023-04-11 18:35:25
 * @LastEditors: 张春蕾
 * @LastEditTime: 2023-10-17 10:58:06
-->
<template>
    <div
        v-if="dayjs(props.mask.planStartTime).diff(props.planEndTime,'day')<0"
        class="overColor"
        :style="{
            width: width + 'px',
            height: height + 'px',
            top: top + 'px',
            left: left + 'px',
            'line-height': height + 'px',
        }"
    >
        <div style="position: absolute;color:red;opacity:0.6"
             :style="{
                 top: topText + 'px',width: width + 'px',
             }">{{ props.mask.label }}</div>
    </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import dayjs from 'dayjs'
const props = defineProps({
    mask: {
        type: Object,
    },
    planStartTime: {
        type: String,
    },
    planEndTime: {
        type: String,
    },
    pieceWidth: {
        type: Number,
    },
})
let width = computed(() => {
    let days = undefined
    if (dayjs(props.mask.planEndTime).diff(props.planEndTime, 'day') < 0) {
        days = dayjs(props.mask.planEndTime).diff(props.mask.planStartTime, 'day')
    } else {
        days =  dayjs(props.planEndTime).diff(props.mask.planStartTime, 'day')
    }
    return (days + 1) * props.pieceWidth - 1
})
let height = computed(() => {
    let rowNum = props.mask.rowIndex[props.mask.rowIndex.length - 1] - props.mask.rowIndex[0]
    return (rowNum + 1) * 40
})

let left = computed(() => {
    let days = dayjs(props.mask.planStartTime).diff(props.planStartTime, 'day')
    return days * props.pieceWidth
})
let top = computed(() => {
    // if (props.mask.rowIndex.length == 1) {
    //     return props.mask.rowIndex[0] * 40-16
    // } else {
        // props.mask.rowIndex.forEach((e,index) => {
        //     return index*10+40
        // })
        return props.mask.rowIndex[0] * 40
    // }
})
let topText = computed(() => {
    if (props.mask.rowIndex.length == 1) {
        return props.mask.rowIndex.length*16
    }else if (props.mask.rowIndex.length == 2) {
        return props.mask.rowIndex.length
    } else {
        return props.mask.rowIndex.length*12
    }
    // }
})
</script>
<style lang="scss" scoped>
.overColor{
    position: absolute;
    background-color: rgba(235,199,204, 0.3);
    // opacity: 0.3;
    pointer-events: none;
    margin-right: 4px;
    font-size: 20px;
    text-align: center;
}
</style>
