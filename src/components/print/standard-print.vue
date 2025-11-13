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
                    备料票
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
                        <td width="12%">生产令号</td>
                        <td colspan="2">{{ states.formData.productionOrderNo }}</td>
                        <td width="11%">票号</td>
                        <td colspan="2">{{ states.formData.ticketNumber }}</td>
                        <td width="11%">类型</td>
                        <td colspan="2">单发件</td>
                    </tr>
                    <tr style="letter-spacing: 2px; height: 26px">
                        <td width="12%">入库单元号</td>
                        <td colspan="2">{{ states.formData.inboundUnitNo }}</td>
                        <td width="11%">零件名称</td>
                        <td colspan="2">{{ states.formData.partName }}</td>
                        <td width="11%">序号</td>
                        <td colspan="2">{{ states.formData.sort }}</td>
                    </tr>
                    <tr style="letter-spacing: 2px; height: 26px">
                        <td width="12%">订货代号</td>
                        <td colspan="2">{{ states.formData.orderNo }}</td>
                        <td width="11%">件数</td>
                        <td colspan="2">{{ states.formData.count }}</td>
                        <td width="11%">发往单位</td>
                        <td colspan="2">后处理</td>
                    </tr>
                    <tr style="letter-spacing: 2px; height: 26px">
                        <td width="12%">图号</td>
                        <td colspan="2">{{ states.formData.drawingNo }}</td>
                        <td width="11%">总重（kg）</td>
                        <td colspan="2">{{ states.formData.totalGrossWeight }}</td>
                        <td width="11%">毛重（kg）</td>
                        <td colspan="2">{{ states.formData.grossWeight }}</td>
                    </tr>
                    <tr style="letter-spacing: 2px; height: 26px">
                        <td width="12%">下料尺寸</td>
                        <td colspan="4">长{{ states.formData.length }}\宽{{ states.formData.width }}\厚度{{ states.formData.thickness }}</td>
                        <td width="11%">材质</td>
                        <td colspan="3">{{ states.formData.materialSpecification }}</td>
                    </tr>
                    <tr style="letter-spacing: 2px; height: 26px">
                        <td width="12%">完整工序</td>
                        <td colspan="8">{{ states.formData.completeProcess }}</td>
                    </tr>
                    <tr style="letter-spacing: 2px; height: 26px">
                        <td width="12%">序号</td>
                        <td width="11%">工序</td>
                        <td width="11%">定额工时</td>
                        <td width="11%">实动工时</td>
                        <td width="11%">操作者</td>
                        <td width="11%">日/月</td>
                        <td width="11%">互检</td>
                        <td width="11%">检验员印</td>
                        <td width="11%">完工日期</td>
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
                        <td></td>
                    </tr>
                    <tr style="letter-spacing: 2px; height: 26px">
                        <td width="11%">批量件首检尺寸</td>
                        <td colspan="2"></td>
                        <td width="11%">操作者</td>
                        <td colspan="2"></td>
                        <td width="11%">日/月</td>
                        <td colspan="2"></td>
                    </tr>
                     <tr style="letter-spacing: 2px; height: 26px">
                        <td width="12%">钢板入库编号</td>
                        <td colspan="8"></td>
                    </tr>
                    <tr style="letter-spacing: 2px; height: 26px">
                        <td width="12%">零件代码</td>
                        <td colspan="4"></td>
                        <td width="11%">程序员</td>
                        <td colspan="3"></td>
                    </tr>
                    <tr style="letter-spacing: 2px; height: 26px">
                        <td width="12%"></td>
                        <td width="11%">编制</td>
                        <td width="11%">折图</td>
                        <td width="11%">计调员</td>
                        <td width="11%">统计员</td>
                        <td width="11%">是否附页</td>
                        <td colspan="3">备注</td>
                    </tr>
                    <tr style="letter-spacing: 2px; height: 26px">
                        <td width="12%">责任人</td>
                        <td width="11%"></td>
                        <td width="11%"></td>
                        <td width="11%"></td>
                        <td width="11%"></td>
                        <td width="11%"></td>
                        <td colspan="3" rowspan="2"></td>
                    </tr>
                    <tr style="letter-spacing: 2px; height: 26px">
                        <td width="12%">日期</td>
                        <td width="11%"></td>
                        <td width="11%"></td>
                        <td width="11%"></td>
                        <td width="11%"></td>
                        <td width="11%"></td>
                        
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
        ProcessTasksApi.printConstructionTicket(row.id).then(res => { 
            if(res.code === 200){
                states.formData = res.data
            }
        }).catch(err=>{
            E_Msg.newMessage(err.msg||err,'error')
        }).finally(()=>{
            states.loading = false
        })
    }else{
        WorkMaterialCuttingPlanApi.MaterialCuttingPrint(row.id).then(res => { 
            if(res.code === 200){
                states.formData = res.data
            }
        }).catch(err=>{
            E_Msg.newMessage(err.msg||err,'error')
        }).finally(()=>{
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
