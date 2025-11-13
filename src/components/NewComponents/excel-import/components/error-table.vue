<template>
    <div>
        <el-dialog v-model="states.dialogVisible" title="" :close-on-click-modal="false" draggable width="848px">
            <!-- <div class="top-title">
                <el-icon size="22px"><WarningFilled color="#FAAD14" /></el-icon>
                导入成功
                <span class="success-number">{{ states.successRow }}</span>
                条,导入失败
                <span class="error-number">{{ states.errorRow }}</span>
                条,请确认!
            </div> -->
            <el-table :data="states.errorList" border height="400" class="mt-2">
                <el-table-column type="index" label="序号" width="55"></el-table-column>
                <el-table-column label="导入数据" prop="row" width="150" show-overflow-tooltip></el-table-column>
                <el-table-column label="唯一性字段" width="180" prop="onlyKey" show-overflow-tooltip></el-table-column>
                <el-table-column label="失败原因" prop="errorMessage" show-overflow-tooltip></el-table-column>
            </el-table>
            <template #footer>
                <el-button @click="states.dialogVisible = false">确&nbsp;定</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
// import { WarningFilled } from '@element-plus/icons-vue'

const states = reactive({
    dialogVisible: false,
    errorList: [],
    successRow: 0,
    errorRow: 0,
})

const openErrorTable = errorList => {
    states.errorList = errorList.map(x => {
        x.row = String(x.row)
        if (x.row.indexOf('-') != -1) {
            const list = x.row.split('-')
            x.row = `第${list[0]}行-第${list[1]}行`
        } else {
            x.row = `第${x.row}行`
        }
        return x
    })
    states.dialogVisible = true
}

defineExpose({ openErrorTable })
</script>
<style lang="scss" scoped>
:deep(.el-dialog__header) {
    display: none !important;
}
.success-number {
    color: #6888da;
}
.error-number {
    color: #f05e5d;
}
.top-title {
    padding-bottom: 4px;
    .el-icon {
        position: relative;
        top: 5px;
    }
}
</style>
