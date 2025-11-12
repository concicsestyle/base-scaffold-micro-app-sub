<!--
 * @Description: 
 * @Autor: 王瑶
 * @Date: 2025-04-03 16:46:46
 * @LastEditors: 王瑶
 * @LastEditTime: 2025-04-09 14:13:24
-->
=
<template>
    <div
        :class="['split-pane', props.isVertical ? 'vertical-pane' : 'level-pane']"
        :ref="`split${props.isVertical ? 'Vertical' : 'Level'}Ref`"
    >
        <div
            :class="[
                props.isVertical
                    ? 'left-pane'
                    : states.isFold
                    ? 'fold-t-h'
                    : props.isHalf
                    ? 'top-half'
                    : 'top-pane',
            ]"
            ref="topOrLeftRef"
        >
            <slot name="topOrleft"></slot>
        </div>
        <div
            :class="['split-line', props.isVertical ? 'vertical-line' : 'level-line']"
            ref="splitLineRef"
            @mousedown="onMouseDown($event)"
        >
            <div v-if="!props.isVertical" class="circle-icon" @click="handleFold">
                <el-icon><ArrowDown /></el-icon>
            </div>
        </div>
        <div
            :class="[
                props.isVertical
                    ? 'right-pane'
                    : states.isFold
                    ? 'fold-b-h'
                    : props.isHalf
                    ? 'top-half'
                    : 'bottom-pane',
            ]"
            ref="rightBottomRef"
        >
            <slot name="bottomOrRight"></slot>
        </div>
        
    </div>
</template>
<script lang="ts" setup>
import { ref, nextTick, reactive } from 'vue'
import { getProps, tableMouse } from './index'
import { ArrowDown } from '@element-plus/icons-vue'
const props = defineProps(getProps())
// 分割线
const splitLineRef = ref()
// 左侧
const topOrLeftRef = ref()
// 下侧
const rightBottomRef = ref()
const states = reactive({
    isFold: false,
})
// 鼠标拖动事件
const onMouseDown = e => {
    nextTick(() => {
        tableMouse(
            e,
            props.isVertical,
            topOrLeftRef.value,
            rightBottomRef.value,
            splitLineRef.value,
        )
    })
}
const handleFold = () => {
    states.isFold = !states.isFold
    console.log('states.isFold', states.isFold)
}
</script>
<style scoped lang="scss">
@use './index.scss';
</style>
