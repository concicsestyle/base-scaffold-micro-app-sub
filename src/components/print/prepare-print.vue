<template>
    <el-dialog
        title="打印"
        v-model="states.visible"
        :close-on-click-modal="false"
        draggable
        width="1160px"
        append-to-body
        @close="closeDialog"
    >
        <div style="height: 550px; overflow-y: auto">
            <div id="printBox" class="work-order-page" v-loading="states.loading">
                <h1
                    style="
                        font-size: 24px;
                        text-align: center;
                        font-weight: bold;
                        letter-spacing: 10px;
                    "
                >
                    施工票
                </h1>
                <div class="work-order-form-pane" style="margin-top: 0; margin-bottom: 10px;font-size: 14px;">
                    <div>
                        <span>计划开始时间：</span>
                        <span>{{ states.formData.planStartTime }}</span>
                    </div>
                    <div>
                        <span>计划结束时间：</span>
                        <span>{{ states.formData.planEndTime }}</span>
                    </div>
                </div>
                <table
                    style="text-align: center; border-collapse: collapse; width: 100%"
                    border="1"
                >
                    <tr style="letter-spacing: 2px; height: 26px">
                        <td width="12.5%">生产令号</td>
                        <td colspan="3">{{ states.formData.productionOrderNo }}</td>
                        <td width="12.5%">票号</td>
                        <td colspan="3">{{ states.formData.ticketNumber }}</td>
                    </tr>
                    <tr style="letter-spacing: 2px; height: 26px">
                        <td width="12.5%">入库单元号</td>
                        <td colspan="3">{{ states.formData.inboundUnitNo }}</td>
                        <td width="12.5%">零件名称</td>
                        <td colspan="3">{{ states.formData.partName }}</td>
                    </tr>
                    <tr style="letter-spacing: 2px; height: 26px">
                        <td width="12.5%">订货代号</td>
                        <td colspan="3">{{ states.formData.orderNo }}</td>
                        <td width="12.5%">件数</td>
                        <td colspan="3">{{ states.formData.count }}</td>
                    </tr>
                    <tr style="letter-spacing: 2px; height: 26px">
                        <td width="12.5%">图号</td>
                        <td colspan="3">{{ states.formData.drawingNo }}</td>
                        <td width="12.5%">总重</td>
                        <td colspan="3">{{ states.formData.totalGrossWeight }}</td>
                    </tr>
                    <tr style="letter-spacing: 2px; height: 26px">
                        <td width="12.5%">序号</td>
                        <td width="12.5%">工序</td>
                        <td width="12.5%">定额工时</td>
                        <td width="12.5%">操作者</td>
                        <td width="12.5%">实动工时</td>
                        <td width="12.5%">时间</td>
                        <td width="12.5%">实动工时</td>
                        <td width="12.5%">时间</td>
                    </tr>
                    <tr v-for="(item, index) in states.formData.printConstructionTicketSpecVos" :key="index" style="letter-spacing: 2px; height: 26px">
                        <td>{{ item.sort }}</td>
                        <td>{{ item.processName }}</td>
                        <td>{{ item.ratedWorkHours }}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr style="letter-spacing: 2px; height: 26px">
                        <td colspan="2">路线（产品明细表）</td>
                        <td colspan="6">{{ states.formData.materialName }}</td>
                    </tr>
                    <tr style="letter-spacing: 2px; height: 26px">
                        <td>计划工时</td>
                        <td>实动总工室</td>
                        <td colspan="4">定额修改工时</td>
                        <td colspan="2">修改人印</td>
                    </tr>
                    <tr style="letter-spacing: 2px; height: 26px">
                        <td></td>
                        <td></td>
                        <td colspan="2" style="text-align: left;padding:0 5px;">增：</td>
                        <td colspan="2" style="text-align: left;padding:0 5px;">减：</td>
                        <td colspan="2"></td>
                    </tr>
                    <tr style="letter-spacing: 2px; height: 26px">
                        <td>检查日期</td>
                        <td>检查数量</td>
                        <td>合格数量</td>
                        <td colspan="2">自检</td>
                        <td colspan="2">互检</td>
                        <td>专检</td>
                    </tr>
                    <tr style="letter-spacing: 2px; height: 26px">
                        <td></td>
                        <td></td>
                        <td></td>
                        <td colspan="2"></td>
                        <td colspan="2"></td>
                        <td></td>
                    </tr>
                </table>
            </div>
        </div>
        <template #footer>
            <el-button @click="closeDialog" :loading="states.saveLoading">
                取&nbsp;消
            </el-button>
            <el-button type="primary" :loading="states.saveLoading" v-print="printCode">
                打&nbsp;印
            </el-button>
        </template>
    </el-dialog>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue'
import dayjs from 'dayjs'
import WorkMaterialCuttingPlanApi from '@/api/ppm/workMaterialCuttingPlan'
import ProcessTasksApi from '@/api/mes/processTasks'
import { E_Msg } from '@/utils/message/index'
const STATES = {
    visible: false, // 弹窗是否显示
    loading: false, //表格加载loading
    saveLoading: false, //按钮load
    formData: {} as any,
    bookingDetailList: [{}],
}

const states = reactive(Object.assign({}, STATES))

//页面打开
const print = (row,type) => {
    states.visible = true
    states.loading = true
    if(type === 'mes'){
        ProcessTasksApi.taskGeneralPrint(row.id).then(res => { 
            if(res.code === 200){
                states.formData = res.data
            }
        }).catch(err=>{
            E_Msg.newMessage(err.msg||err,'error')
        }).finally(()=>{
            states.loading = false
        })
    }else{
        WorkMaterialCuttingPlanApi.printConstructionTicket(row.id).then(res => { 
        if(res.code === 200){
            states.formData = res.data
        }
    }).catch(err=>{
            E_Msg.newMessage(err.msg||err,'error')
        })
        .finally(()=>{
        states.loading = false
    })
    }

}
//关闭弹窗
const closeDialog = () => {
    Object.assign(states, {}, STATES)
}
const handleTime = (time, type) => {
    if (time) {
        if (type === 'year') {
            return dayjs(time).format('YYYY')
        } else if (type === 'month') {
            return dayjs(time).month()
        } else if (type === 'day') {
            return dayjs(time).day()
        }
    } else {
        return ''
    }
}
// 打印
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

defineExpose({ print })
</script>
<style lang="scss" media="printBox" scoped>
.work-order-page {
    width: 24.1cm !important;
    height: 14cm !important;
    margin: 0 auto;
    font-size: 12px;
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
    font-size: 14px;
    margin-top: 8px;
}
.work-order-item {
    display: flex;
    flex-flow: row nowrap;
}
.table-label {
    background-color: #f0f0f0;
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
