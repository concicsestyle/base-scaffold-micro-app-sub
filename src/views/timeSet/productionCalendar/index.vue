<!--
 * @Description: 
 * @Autor: 王瑶
 * @Date: 2025-06-03 20:18:23
 * @LastEditors: 王瑶
 * @LastEditTime: 2025-09-03 18:16:48
-->
<template>
    <div class="bt-page-no-p">
        <el-row >
            <el-col :lg="4" :xs="24">
                <groupTree ref="calendarTypeInfoRef" 
                    @groupClick="groupClick"   
                    @clearCanlendar="clearCanlendar"
                    @getCalendar="setCalendar"></groupTree>
            </el-col>
            <el-col :lg="20" :xs="24">
                <infoTable ref="calendarRef"  
                    @refreshCalendar="refreshCalendar"
                    @deleteCalendar="deleteCalendar"
                    @setCurrentKey="setCurrentKey"></infoTable>
            </el-col>
        </el-row>
    </div>
</template>
<script lang="ts" setup>
import groupTree from './components/group-tree.vue'
import infoTable from './components/info-table.vue'
import { ref } from 'vue'
const calendarTypeInfoRef  = ref()
const calendarRef  = ref()

// 左侧日历点击
const groupClick = data => {
    calendarRef.value.groupClick(data)
}
// 右侧刷新
const refreshCalendar = () => {
    calendarTypeInfoRef.value.init()
}
// 设置选中节点
const setCurrentKey = id => {
    // 选中节点
    calendarTypeInfoRef.value.setCurrentKey(id)
}
// 删除日历
const deleteCalendar = id => {
    calendarTypeInfoRef.value.deleteCalendar(id)
    // refreshCalendar()
}
//清空日历
const clearCanlendar = () => {
    calendarRef.value.clear()
    refreshCalendar()
}
// 设置右侧默认日历
const setCalendar = list => {
    calendarRef.value.setDefaultCalendar(list)
}
</script>

<style lang="scss" scoped>

</style>