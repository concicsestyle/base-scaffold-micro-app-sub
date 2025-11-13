<!--
 * @Description: 
 * @Autor: 王瑶
 * @Date: 2025-07-02 14:15:01
 * @LastEditors: 王瑶
 * @LastEditTime: 2025-07-02 16:26:06
-->
<template>
    <el-dialog v-model="states.dialogVisible" title="位置码打印" :close-on-click-modal="false" draggable width="40%"
        :before-close="handleClose">

        <div class="qr-code-box">
            <div class="title">工厂位置码标识</div>
           <div style="width:120px;">
            <!-- <vue-qr class="qr-code-img" id="payQR" v-if="states.qrCodeData" :text="states.qrCodeData" :size="120"
                :margin="5">
            </vue-qr> -->
           </div>
            <div class="flex-row">
                <p class="mini-title">位置代码：</p>
                <p>JG00101</p>
            </div>
            <div class="flex-row">
                <p class="mini-title">位置名称：</p>
                <p>JG00101</p>
            </div>
            <div class="flex-row">
                <p class="mini-title">负责人：</p>
                <p>李某某</p>
            </div>
        </div>
        <template v-if="states.updateType != 'read'" #footer>
            <el-button @click="handleClose">取&nbsp;消</el-button>
            <el-button type="primary" :loading="states.saveLoading" @click="saveData">打&nbsp;印</el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
// import { e_rule } from '@/utils/require-rule/index'
import { reactive, ref, nextTick, watch, onMounted } from 'vue'
// import vueQr from 'vue-qr/src/packages/vue-qr.vue'
// import PlantLocationApi from '@/api/basic/plant-location-api'
// import CodeRuleInstanceApi from '@/api/system/code-rule-instance-api'
// import {ElMessage } from 'element-plus';
const emits = defineEmits(['success'])
const states = reactive({
    dialogVisible: false,
    qrCodeData: '123',
    form: {
        plantCode: '', // 编码
        plantName: '', // 名称
        parentId: '', // 上级位置
        remark: '', // 备注
        id: '', //
        branchCompanyIdList: []as any, //所属组织
    },
    branchCompanyIdList:[]as any,
    plantCodeStatus: false, // 标识是否有单位编码规则
    saveLoading: false,
    updateType:'add',
    parentList:[]as any
})
const formRef = ref()


// 新增数据
const showOpenDialog = () => {
    states.dialogVisible = true
}
const handleClose = () => {
    states.dialogVisible = false
}

defineExpose({ showOpenDialog  })
</script>
<style scoped lang="scss">
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
}
</style>
