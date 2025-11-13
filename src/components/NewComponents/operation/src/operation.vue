<!--
 * :Author: yuquanli
 * :Date: 2022-12-22 12:04:36
 * :LastEditors: yuquanli
 * :LastEditTime: 2022-12-27 17:04:56
 * :FilePath: \digital-factory-3-basic-web\src\usage\components\resume\src\resume.vue
 * :Description:
-->
<template>
    <div>
        <el-dialog
            v-model="states.dialogVisible"
            title="履历"
            :close-on-click-modal="false"
            draggable
            width="1200px"
            :before-close="handleClose"
        >
            <BtTable
                class="showTable h80p"
                ref="showTableRef"
                :pagination="true"
                :initLoading="false"
                tableHeight="360px"
                :requestApi="loadDataApi"
                :columns="columnList"
                :enableContinuous="true"
            ></BtTable>
        </el-dialog>
    </div>
</template>
<script lang="ts">
export default {
    name: 'operationHistory',
}
</script>
<script setup lang="ts">
import { nextTick, reactive, ref } from 'vue'
//履历接口
// import { SystemResumeApi } from '@/base/consts/api/system'
const states = reactive({
    dialogVisible: false,
    operationData: [],
    //履历id
    businessId: '',
})
//添加履历关闭事件
const emits = defineEmits(['close'])
const showTableRef = ref()

//表格列
const columnList = ref([
    {
        label: '序号',
        prop: 'index',
        type: 'index',
        width: '60px',
    },
    {
        label: '操作时间',
        prop: 'gmtCreate',
    },
    {
        label: '操作类型',
        prop: 'type',
    },
    {
        label: '用户账户',
        prop: 'userCode',
    },
    {
        label: '用户名称',
        prop: 'userName',
    },
    {
        label: '操作详情',
        prop: 'remark',
    },
])
const loadDataApi = async param => {
    // return SystemResumeApi.listPage({
    //     ...param,
    //     businessId: states.businessId,
    // })
  return [];
}
//获取操作履历  传入APIclass 参数
const open = (businessId: string) => {
    states.dialogVisible = true
    if (businessId) {
        nextTick(() => {
            states.businessId = businessId
            showTableRef.value.pageable.pageNumber = 1
            showTableRef.value.refresh()
        })
    }
}
//关闭履历弹窗
const handleClose = () => {
    states.operationData = []
    states.dialogVisible = false
    emits('close')
}
defineExpose({ open, handleClose })
</script>

<style scoped>
.mes-content {
    margin: 0 0 10px 10px;
}
.operation-dialog-height {
    height: 500px;
}
:deep(.el-dialog__body) {
    height: 500px;
}
</style>
