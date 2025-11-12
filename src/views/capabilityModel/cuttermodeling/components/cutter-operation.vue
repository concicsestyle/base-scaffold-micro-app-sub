<template>
    <el-card class="bt-view" :body-style="{ height: '95%' }" v-show="states.visible">
        <template #header>
            <span>{{ states.dialogTitle }}</span>
            <el-icon class="header-close" @click="close">
                <Close></Close>
            </el-icon>
        </template>
        <div v-if="states.updateType != 'read'" class="operation-footer">
            <el-button  :loading="states.buttonLoading" @click="close">取&nbsp;消</el-button>
            <el-button type="primary" :loading="states.buttonLoading" @click="checkSave">保&nbsp;存 </el-button>
        </div>
        <div class="bt-view__table--nospace">
            <el-form
                ref="formRef"
                :model="states.formData"
                label-width="80px"
                label-position="top"
                class="ml-4 standard-form"
                :disabled="states.updateType == 'read'"
            >
                <el-row :gutter="32">
                    <el-col :span="16" :offset="0">
                        <el-row :gutter="32">
                          <el-col :span="6">
                            <el-form-item
                                label="刀具编码"
                                prop="toolCode"
                                :rules="e_rule('required', '刀具编码称不能为空')"
                            >
                              <el-input
                                  v-model.trim="states.formData.toolCode"
                                  clearable
                                  maxlength="60"
                                  :show-word-limit="false"
                                  :placeholder="states.updateType == 'read' ? ' ' : '请选择'"
                                  readonly
                                  :suffix-icon="Pointer"
                                  :disabled="states.updateType != 'add'"
                                  @click.stop="startChooseMaterial"
                              >
                              </el-input>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <el-form-item
                                label="刀具名称"
                                prop="toolName"
                                :rules="e_rule('required', '刀具名称不能为空')"
                            >
                              <el-input
                                  maxlength="60"
                                  :show-word-limit="false"
                                  v-model.trim="states.formData.toolName"
                                  clearable
                                  disabled
                                  :placeholder="states.updateType != 'read' ? ' ' : ' '"
                              ></el-input>
                            </el-form-item>
                          </el-col>
                            <el-col :span="6">
                                <el-form-item
                                    label="创建组织"
                                    prop="branchCompanyName"
                                    :rules="e_rule('required', '创建组织不能为空')"
                                >
                                    <el-input
                                        v-model.trim="states.formData.branchCompanyName"
                                        disabled
                                        clearable
                                        :placeholder="states.updateType != 'read' ? '请输入' : ' '"
                                    ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item
                                    label="使用组织"
                                    prop="useBranchCompanyName"
                                    :rules="e_rule('required', '使用组织不能为空')"
                                >
                                    <el-input
                                        v-model.trim="states.formData.useBranchCompanyName"
                                        disabled
                                        clearable
                                        :placeholder="states.updateType != 'read' ? '请输入' : ' '"
                                    ></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
<!--                        <el-row :gutter="32">-->

<!--                        </el-row>-->
                    </el-col>
                    <div class="logo-component">
                        <el-form-item label="" prop="logo">
                            <modelingLogoUpload
                                :logo="states.formData.logo"
                                :updateType="states.updateType"
                                @uploadMethod="uploadMethod"
                            ></modelingLogoUpload>
                        </el-form-item>
                    </div>
                </el-row>
                <el-tabs v-model="states.activeName" class="demo-tabs" @tab-click="clickTabsScrollTo">
                    <el-tab-pane
                        :label="item.name"
                        :name="item.key"
                        v-for="item in states.tabActiveList"
                        :key="item.key"
                    ></el-tab-pane>
                </el-tabs>
                <el-scrollbar ref="scrollbarRef" class="collapse-style">
                    <el-collapse id="material-collapse" v-model="states.tabActive">
                        <el-collapse-item name="basic" id="basic">
                            <template #title>
                                <el-icon class="header-icon">
                                    <CaretBottom v-if="isTabsAcitve('basic')"></CaretBottom>
                                    <CaretRight v-else></CaretRight>
                                </el-icon>
                                <span class="title-item">基本</span>
                            </template>
                            <cutterBase
                                ref="cutterBaseRef"
                                :updateType="states.updateType"
                                :unitsList="states.unitsList"
                                :baseUnitsList="states.baseUnitsList"
                                :visible="states.visible"
                                :assigned="states.assigned"
                            ></cutterBase>
                        </el-collapse-item>
                        <el-collapse-item name="stock" id="stock">
                            <template #title>
                                <el-icon class="header-icon">
                                    <CaretBottom v-if="isTabsAcitve('stock')"></CaretBottom>
                                    <CaretRight v-else></CaretRight>
                                </el-icon>
                                <span class="title-item">库存</span>
                            </template>
                            <cutterStock
                                ref="cutterStockRef"
                                :updateType="states.updateType"
                                :unitsList="states.unitsList"
                            ></cutterStock>
                        </el-collapse-item>
                        <el-collapse-item name="purchase" id="purchase">
                            <template #title>
                                <el-icon class="header-icon">
                                    <CaretBottom v-if="isTabsAcitve('purchase')"></CaretBottom>
                                    <CaretRight v-else></CaretRight>
                                </el-icon>
                                <span class="title-item">采购</span>
                            </template>
                            <cutterPurchase
                                ref="cutterPurchaseRef"
                                :updateType="states.updateType"
                                :unitsList="states.unitsList"
                            ></cutterPurchase>
                        </el-collapse-item>
                        <el-collapse-item name="unit" id="unit">
                            <template #title>
                                <el-icon class="header-icon">
                                    <CaretBottom v-if="isTabsAcitve('unit')"></CaretBottom>
                                    <CaretRight v-else></CaretRight>
                                </el-icon>
                                <span class="title-item">单位换算</span>
                            </template>
                            <cutterUnits
                                ref="cutterUnitsRef"
                                :updateType="states.updateType"
                                :unitsList="states.unitsList"
                                :baseUnitsList="states.baseUnitsList"
                            ></cutterUnits>
                        </el-collapse-item>
                        <el-collapse-item name="file" id="file">
                            <template #title>
                                <el-icon class="header-icon">
                                    <CaretBottom v-if="isTabsAcitve('file')"></CaretBottom>
                                    <CaretRight v-else></CaretRight>
                                </el-icon>
                                <span class="title-item">附件</span>
                            </template>
                            <!-- 上传组件 -->
                            <everUploadTable
                                v-if="states.visible"
                                ref="everUploadTableRef"
                                v-model:buttonLoading="states.buttonLoading"
                                :disabled="states.updateType == 'read'"
                            ></everUploadTable>
                        </el-collapse-item>
                    </el-collapse>
                </el-scrollbar>
            </el-form>
        </div>
    </el-card>
    <materialChooseDialog ref="materialChooseDialogRef" @success="finishChooseMaterial"></materialChooseDialog>
</template>

<script setup lang="ts">
import { reactive, ref, nextTick } from 'vue'
// import 'beeboat-ui/theme/src/bt-table-screen-item.scss'
import { e_rule } from '@/utils/require-rule/index'
import { Close, CaretRight, CaretBottom, Pointer } from '@element-plus/icons-vue'
// import { UnitDescApi, ToolDescApi, MaterialDescApi } from '@/base/consts/api/basic'
import cutterBase from './cutter-base.vue'
// import cutterStock from './cutter-stock.vue'
// import cutterPurchase from './cutter-purchase.vue'
// import cutterUnits from './cutter-units.vue'
import everUploadTable from '@/components/NewComponents/ever-upload-table/index.vue'
import modelingLogoUpload from '@/components/NewComponents/modeling-logo-upload/index.vue'
// import { BtUseAppStore } from 'beeboat-ui/es/core/store'
// import { BtUserTokenInfo } from 'beeboat-ui/es/core'
import {saveAdd,update} from '@/api/basic/tool-desc-api'
import { E_Msg } from '@/utils/message'
// import materialChooseDialog from './material-choose-dialog/index.vue'

// const appStore = BtUseAppStore()
const emits = defineEmits(['success'])

let states = reactive({
    //弹窗标题
    dialogTitle: '',
    //表单
    formData: {
        securityLevel: '0', // 密级
        toolCode: '', // 编码
        toolName: '', // 名称
        branchCompanyId: '',//BtUserTokenInfo.getCompany().id, // 创建组织
        useBranchCompanyId: '',//BtUserTokenInfo.getCompany().id, // 使用组织
        branchCompanyName: '',//BtUserTokenInfo.getCompany().name, // 创建组织
        useBranchCompanyName: '',//BtUserTokenInfo.getCompany().name, // 使用组织
        id: '',
        logo: '', // 图片id
    },
    codeStatus: false, // 是否有编码规则
    //显示隐藏
    visible: false,
    confidentialityLevelList: [],//appStore.getDictByParentCode('INNER_DICT_ConfidentialityLevel'), // 密级选项
    activeName: 'basic',
    tabActive: ['basic', 'stock', 'purchase', 'unit', 'file'],
    tabActiveList: [
        { key: 'basic', name: '基本' },
        { key: 'stock', name: '库存' },
        { key: 'purchase', name: '采购' },
        { key: 'unit', name: '单位换算' },
        { key: 'file', name: '附件' },
    ],
    unitsList: [], // 单位数据
    baseUnitsList: [], // 基准单位
    buttonLoading: false,
    updateType: '',
    assigned: false,
})

const formRef = ref()
const cutterBaseRef = ref()
const cutterStockRef = ref()
const cutterPurchaseRef = ref()
const cutterUnitsRef = ref()
const everUploadTableRef = ref()
const scrollbarRef = ref()
const materialChooseDialogRef = ref()

//新增
const startAdd = (parentId, strategy) => {
    states.assigned = false
    states.updateType = 'add'
    states.visible = true
    states.dialogTitle = '刀具新增'
    // 共享型显示为全部组织
    // states.formData.useBranchCompanyName = strategy == 'share' ? '全部组织' : BtUserTokenInfo.getCompany().name
    nextTick(() => {
        if (parentId && parentId != -1) {
            cutterBaseRef.value.formData.toolTypeId = parentId
        }
        scrollbarRef.value.setScrollTop(0)
    })
}
//修改
const startEdit = (data, type, strategy) => {
    // 创建组织才允许修改类别
    // states.assigned = data.branchCompanyId != BtUserTokenInfo.getCompany().branchCompanyId
    states.updateType = type
    states.formData = {
        securityLevel: data.securityLevel,
        toolCode: data.toolCode,
        toolName: data.toolName,
        branchCompanyId: data.branchCompanyId,
        useBranchCompanyId: data.useBranchCompanyId,
        branchCompanyName: data.branchCompanyName,
        useBranchCompanyName: strategy == 'share' ? '全部组织' : data.useBranchCompanyName,
        id: data.id,
        logo: data.logo,
    }
    states.visible = true
    states.dialogTitle = type == 'edit' ? '刀具修改' : '刀具查看'
    nextTick(() => {
        scrollbarRef.value.setScrollTop(0)
        cutterBaseRef.value.startEdit(data)
        cutterStockRef.value.startEdit(data)
        cutterPurchaseRef.value.startEdit(data)
        cutterUnitsRef.value.startEdit(data)
        everUploadTableRef.value.startEdit(data.fileList)
    })
}

const checkSave = () => {
    // 三个必填项表单校验，有没填的跳转
    formRef.value.validate(v => {
        cutterBaseRef.value.formRef.validate(v1 => {
            cutterPurchaseRef.value.formRef.validate(v2 => {
                cutterStockRef.value.formRef.validate(v3 => {
                    if (!v1) {
                        clickTabsScrollTo({ paneName: 'basic' })
                        return
                    }
                    if (!v2) {
                        clickTabsScrollTo({ paneName: 'purchase' })
                        return
                    }
                    if (!v3) {
                        clickTabsScrollTo({ paneName: 'stock' })
                        return
                    }
                    if (cutterUnitsRef.value.check()) {
                        clickTabsScrollTo({ paneName: 'unit' })
                        E_Msg.newMessage('有单位换算关系未维护完整','warning');
                        return
                    }
                    if (!v) {
                        return
                    }
                    // const baseUnit = cutterBaseRef.value.formData.baseUnitId
                    // const stockUnits = cutterStockRef.value.groupBaseUnit()
                    // const purchaseUnits = cutterPurchaseRef.value.groupBaseUnit()
                    // const groupUnits = cutterUnitsRef.value.getUnitIds()
                    // const errorList = []
                    // if (stockUnits.stock != baseUnit && !groupUnits.includes(stockUnits.stock)) {
                    //     errorList.push('库存单位')
                    // }
                    // if (purchaseUnits.purchase1 != baseUnit && !groupUnits.includes(purchaseUnits.purchase1)) {
                    //     errorList.push('采购单位')
                    // }
                    // if (errorList.length) {
                    //     E_Msg.confirm(
                    //         '提示',
                    //         `${errorList.join(
                    //             ',',
                    //         )}在的单位组基准单位与基本单位没有换算关系或换算关系不完整，请先维护单位换算关系！`,
                    //     )
                    //     clickTabsScrollTo({ paneName: 'unit' })
                    //     return
                    // }
                    save()
                })
            })
        })
    })
}

const save = () => {
    const params = {
        ...states.formData,
        ...cutterBaseRef.value.getFormData(),
        ...cutterPurchaseRef.value.getFormData(),
        ...cutterStockRef.value.getFormData(),
        unitList: cutterUnitsRef.value.getFormData(),
        fileList: everUploadTableRef.value.getFileList(),
    }
    states.buttonLoading = true
   const functionName= states.updateType == 'add' ? saveAdd : update
   functionName(params).then(res=>{
            states.buttonLoading = false
             emits('success')
             close()
    }).catch(() => {
        //   E_Msg.confirm('提示', err.msg)
          states.buttonLoading = false
      })
    // ToolDescApi[states.updateType == 'add' ? 'save' : 'update'](params)
    //     .then(() => {
    //         states.buttonLoading = false
    //         emits('success')
    //         close()
    //     })
    //     .catch(err => {
    //         E_Msg.confirm('提示', err.msg)
    //         states.buttonLoading = false
    //     })
}

// 上传方法
const uploadMethod = (type, id) => {
    switch (type) {
        case 'success':
            states.buttonLoading = false
            states.formData.logo = id
            break
        case 'uploading':
            states.buttonLoading = true
            break
        case 'uploadingEnd':
            states.buttonLoading = false
            break
    }
}

const clickTabsScrollTo = tag => {
    let el = document.getElementById(tag.paneName)
    if (el) {
        states.tabActive = [...states.tabActive, tag.paneName]
        setTimeout(() => {
            el.scrollIntoView({ block: 'start', behavior: 'smooth' })
        }, 500)
    }
}

const startChooseMaterial = () => {
    materialChooseDialogRef.value.startChoose()
}

const finishChooseMaterial = v => {
    states.formData.toolCode = v.materialNo
    states.formData.toolName = v.materialName
    states.formData.materialId = v.id
    // 查询库存单位名称
    v.stockUnitName = states.unitsList.find(e => e.id == v.stockUnitId)?.unitName || ''
    // 查询采购单位名称
    v.purchaseUnitName = states.unitsList.find(e => e.id == v.purchaseUnitId)?.unitName || ''
    cutterBaseRef.value.setMaterialData(v)
    cutterStockRef.value.setMaterialData(v)
    cutterPurchaseRef.value.setMaterialData(v)

    // MaterialDescApi.get({ id: v.id }).then(res => {
    //     cutterUnitsRef.value.startEdit({
    //         unitList: res.data.conversionList,
    //         baseUnitId: v.baseUnitId,
    //         baseUnitName: v.baseUnitName,
    //     })
    //     everUploadTableRef.value.startEdit(
    //         (res.data.fileList || []).map(x => {
    //             x.disabled = true
    //             return x
    //         }),
    //     )
    // })
}

// 获取单位
const getUnits = async () => {
    // UnitDescApi.listPage({
    //     pageNumber: 1,
    //     pageSize: 10000,
    //     temp: 2,
    // }).then(res => {
    //     states.unitsList = res.data.records
    //     states.baseUnitsList = res.data.records.filter(x => x.isBase)
    // })
}
getUnits()

//校验tabs显示关闭
const isTabsAcitve = key => {
    return states.tabActive.find(e => e == key)
}

//关闭弹窗
const close = () => {
    formRef.value.resetFields()
    cutterBaseRef.value.formRef.resetFields()
    cutterStockRef.value.resetFields()
    cutterPurchaseRef.value.formRef.resetFields()
    cutterUnitsRef.value.resetFields()
    everUploadTableRef.value.resetFields()
    states.visible = false
    states.activeName = 'basic'
    states.tabActive = ['basic', 'stock', 'purchase', 'unit', 'file']
}
defineExpose({ startAdd, startEdit })
</script>
<style scoped lang="scss">
.bt-view {
    position: absolute;
    top: 0px;
    left: 0;
    z-index: 20 !important;
    width: 100%;
}

:deep(.el-collapse-item__arrow) {
    display: none;
}

.collapse-style {
    height: calc(100% - 240px);
    overflow-y: auto;
    overflow-x: hidden;
}

.header-close {
    float: right;
    cursor: pointer;
    width: 48px !important;
    height: 48px !important;
    position: absolute !important;
    top: 0;
    right: 0;
}

.bt-view__table--nospace {
    height: 100%;
}

:deep(.el-form) {
    height: 100%;
    width: 99%;
}

::v-deep .el-tabs__item {
    font-size: 16px;
}
</style>
