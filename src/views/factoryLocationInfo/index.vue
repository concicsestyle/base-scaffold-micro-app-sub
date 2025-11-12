<!--
 * @Description: 厂房位置信息
 * @Autor: 王瑶
 * @Date: 2025-06-03 20:18:23
 * @LastEditors: 王瑶
 * @LastEditTime: 2025-09-11 18:17:32
-->
<template>
    <!-- <el-row style="height: 100%;">
        <el-col :span="24"> -->
            <div class="bt-page flex-row">
                <div class="tree-width">
                    <groupTree ref="groupTreeRef" @groupClick="groupClick"></groupTree>
                </div>
                <div class="right-content">
                    <infoTable ref="infoTableRef"></infoTable>
                </div>
            </div>
        <!-- </el-col>
    </el-row> -->
</template>
<script lang="ts" setup>
import groupTree from './components/group-tree.vue'
import infoTable from './components/info-table.vue'
import { ref } from 'vue'
const groupTreeRef  = ref()
const infoTableRef  = ref()
// 左侧树点击
const groupClick = id => {
    infoTableRef.value.groupClick(id)
}
const initTree= () => {
    groupTreeRef.value.init()
}
</script>

<style lang="scss" scoped>

</style>