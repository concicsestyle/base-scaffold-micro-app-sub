<!--
 * @Description: 
 * @Autor: 王瑶
 * @Date: 2025-07-02 14:15:01
 * @LastEditors: 王瑶
 * @LastEditTime: 2025-08-21 17:04:30
-->
<template>
    <el-dialog v-model="states.dialogVisible" title="位置码打印" :close-on-click-modal="false" draggable width="40%"
        :before-close="handleClose">

        <div class="qr-code-box" id="printBox">
            <div class="title">工厂位置码标识</div>
           <div style="width:120px;">
            
                <!-- <img class="qr-code" src="../../mes/dataPrinting/components/二维码.png" alt="二维码" /> -->
            <vueQr class="qr-code-img" id="payQR" v-if="states.form.plantCode" :text="states.form.plantCode" :size="120"
                :margin="5">
            </vueQr>
           </div>
            <div class="flex-row">
                <p class="mini-title">位置代码：</p>
                <p>{{ states.form.plantCode }}</p>
            </div>
            <div class="flex-row">
                <p class="mini-title">位置名称：</p>
                <p>{{ states.form.plantName }}</p>
            </div>
            <div class="flex-row">
                <p class="mini-title">负责人：</p>
                <p>{{ states.form.createName }}</p>
            </div>
        </div>
        <template v-if="states.updateType != 'read'" #footer>
            <el-button @click="handleClose">取&nbsp;消</el-button>
            <el-button type="primary" :loading="states.saveLoading"v-print="printCode">打&nbsp;印</el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
// import { e_rule } from '@/utils/require-rule/index'
import { reactive, ref, nextTick, watch, onMounted } from 'vue'
// 修改导入语句
import VueQr from 'vue-qr/src/packages/vue-qr.vue'
// import PlantLocationApi from '@/api/basic/plant-location-api'
// import CodeRuleInstanceApi from '@/api/system/code-rule-instance-api'
// import {ElMessage } from 'element-plus';
const emits = defineEmits(['success'])
const states = reactive({
    dialogVisible: false,
    qrCodeData: '123',
    form: {} as any,
    branchCompanyIdList:[]as any,
    plantCodeStatus: false, // 标识是否有单位编码规则
    saveLoading: false,
    updateType:'add',
    parentList:[]as any
})
const formRef = ref()


// 新增数据
const showOpenDialog = (row) => {
    states.dialogVisible = true
    states.form = JSON.parse(JSON.stringify(row))
}
const handleClose = () => {
    states.dialogVisible = false
}
const printCode = ref({
    id: '#printBox',
    popTitle: '',
    extraHead: `
        <meta http-equiv="Content-Language"content="zh-cn"/>
        <style>
            @page {
                size: landscape !important;
                margin: 0 !important;
                border: initial !important;
                border-radius: initial !important;
                width: initial !important;
                min-height: initial !important;
                box-shadow: initial !important;
                background: initial !important;
                page-break-after: always !important;
                font-size: 12px !important;
            }
            @media print {
                .work-order-page {
                    padding: 6mm 15mm;
                }
                footer {
                    display: none;
                    page-break-after: avoid;
                }
                .work-order-label {
                    white-space: nowrap;
                }
                .work-order-form-pane {
                    width: 100%;
                    display: flex;
                    flex-flow: row nowrap;
                    align-items: center;
                    justify-content: space-between;
                    margin-top: 8px;
                    font-size: 14px;
                }
                .work-order-item {
                    display: flex;
                    flex-flow: row nowrap;
                }
                .table-label{
                    background-color: #f0f0f0;
                }
                }
                            .logo-box {
                                    width: 140px;
                                    height: 60px;
                    position: absolute;
                                }
                                .form-container {
                    display: flex;
                    flex-direction: column;
                }

.form-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
}

.form-item {
    flex: 1;
    margin-right: 10px;
}

.form-item:last-child {
    margin-right: 0;
}

.form-label {
    font-weight: bold;
}

.form-value {
    margin-left: 5px;
}
        </style>
        `,
})
defineExpose({ showOpenDialog  })
</script>
<style scoped lang="scss" media="printBox">
.qr-code-box{
    display: flex;
    align-items: center;
    flex-direction: column;
    .title{
        font-size: 18px;
        font-weight: 700;
        padding: 20px 0;
    }
    .mini-title{
        width:80px;
        text-align-last: justify;
        // text-align: right;
    }
    
.qr-code {
  width: 100%;
  height: 100%;
}
}
</style>
