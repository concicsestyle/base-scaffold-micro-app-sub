<template>
    <el-form
        ref="formRef"
        :model="states.formData"
        label-width="80px"
        label-position="top"
        class="standard-form"
        :disabled="props.updateType == 'read'"
    >
        <span class="title-item">
            <p class="tab-content"></p>
            <p class="tab-title">基本信息</p>
        </span>
        <el-row :gutter="32">
            <el-col :span="4">
                <el-form-item label="刀具类别" prop="toolTypeId" :rules="e_rule('required', '刀具类别不能为空')">
                    <el-tree-select
                        v-model="states.formData.toolTypeId"
                        :data="states.toolTypeTree"
                        :props="{ value: 'id', label: 'toolTypeName' }"
                        :disabled="props.assigned"
                        :render-after-expand="false"
                        default-expand-all
                        clearable
                        filterable
                        check-strictly
                    >
                        <template #default="{ data }"> {{ data.toolTypeCode }}({{ data.toolTypeName }}) </template>
                    </el-tree-select>
                </el-form-item>
            </el-col>
            <el-col :span="4">
                <el-form-item label="刀具属性" prop="toolProperty" :rules="e_rule('required', '刀具属性不能为空')">
                    <el-select v-model="states.formData.toolProperty" clearable filterable disabled placeholder=" ">
                        <el-option
                            v-for="item of states.cutterAttrributeList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="4">
                <el-form-item label="基本单位" prop="baseUnitId" :rules="e_rule('required', '基本单位不能为空')">
                    <el-select
                        disabled
                        clearable
                        placeholder="请选择"
                        filterable
                        v-model="states.formData.baseUnitId"
                        @change="baseUnitChange"
                    >
                      <el-option
                          v-for="item in baseUnitIds"
                          :key="item.id"
                          :value="item.value"
                          :label="item.name"
                      ></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
          <el-col :span="4">
            <el-form-item label="规格" prop="specs">
              <el-input
                  disabled
                  maxlength="60"
                  :show-word-limit="false"
                  v-model.trim="states.formData.specs"
                  clearable
                  :placeholder="props.updateType != 'read' ? ' ' : ' '"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="32">
          <el-col :span="4">
            <el-form-item label="型号" prop="model">
              <el-input
                  disabled
                  maxlength="60"
                  :show-word-limit="false"
                  v-model.trim="states.formData.model"
                  clearable
                  :placeholder="props.updateType != 'read' ? ' ' : ' '"
              ></el-input>
            </el-form-item>
          </el-col>
            <el-col :span="4">
                <el-form-item label="材质" prop="texture">
                    <el-input
                        maxlength="60"
                        :show-word-limit="false"
                        v-model.trim="states.formData.texture"
                        clearable
                        disabled
                        :placeholder="props.updateType != 'read' ? ' ' : ' '"
                    ></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="4">
                <el-form-item label="精度" prop="accuracy">
                    <el-input
                        maxlength="60"
                        :show-word-limit="false"
                        v-model.trim="states.formData.accuracy"
                        clearable
                        :placeholder="props.updateType != 'read' ? '请输入' : ' '"
                    ></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="4">
                <el-form-item label="硬度" prop="hardness">
                    <el-input
                        maxlength="60"
                        :show-word-limit="false"
                        v-model.trim="states.formData.hardness"
                        clearable
                        :placeholder="props.updateType != 'read' ? '请输入' : ' '"
                    ></el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row :gutter="32">
            <el-col :span="4">
                <el-form-item label="是否涂层" prop="isCoating" :rules="e_rule('required', '是否涂层不能为空')">
                    <el-select v-model="states.formData.isCoating">
                        <el-option label="是" :value="1"></el-option>
                        <el-option label="否" :value="0"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="4">
                <el-form-item label="是否刃磨" prop="isSharpening" :rules="e_rule('required', '是否涂层不能为空')">
                    <el-select v-model="states.formData.isSharpening">
                        <el-option label="是" :value="1"></el-option>
                        <el-option label="否" :value="0"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="4">
                <el-form-item
                    v-if="states.formData.isSharpening == '1'"
                    label="切削刃厚度"
                    prop="cuttingEdgeThickness"
                    :rules="e_rule(['required', 'greaterZero'], '切削刃厚度不能为空')"
                >
                    <el-input-number
                        v-model="states.formData.cuttingEdgeThickness"
                        :min="0"
                        :max="Math.pow(10, 10)"
                        v-bt-noe
                        v-bt-input="{
                            value: states.formData.cuttingEdgeThickness,
                            precision: states.cuttingEdgeThicknessUnitFix,
                            type: states.cuttingEdgeThicknessUnitType,
                            isHandle: states.formData.cuttingEdgeThicknessUnitId,
                        }"
                        controls-position="right"
                        :placeholder="props.updateType != 'read' ? '请输入' : ' '"
                    ></el-input-number>
                </el-form-item>
                <el-form-item v-else label="切削刃厚度" prop="cuttingEdgeThickness">
                    <el-input-number
                        v-model="states.formData.cuttingEdgeThickness"
                        :min="0"
                        :max="Math.pow(10, 10)"
                        v-bt-noe
                        v-bt-input="{
                            value: states.formData.cuttingEdgeThickness,
                            precision: states.cuttingEdgeThicknessUnitFix,
                            type: states.cuttingEdgeThicknessUnitType,
                            isHandle: states.formData.cuttingEdgeThicknessUnitId,
                        }"
                        controls-position="right"
                        :placeholder="props.updateType != 'read' ? '请输入' : ' '"
                    ></el-input-number>
                </el-form-item>
            </el-col>
            <el-col :span="4">
                <el-form-item
                    v-if="states.formData.isSharpening == '1'"
                    label="切削刃厚度单位"
                    prop="cuttingEdgeThicknessUnitId"
                    :rules="e_rule('required', '切削刃厚度单位不能为空')"
                >
                    <el-select
                        v-model="states.formData.cuttingEdgeThicknessUnitId"
                        clearable
                        placeholder="请选择"
                        filterable
                        :disabled-list="props.unitsList.filter(e=>e.status==0).map(e=>e.id)"
                        @change="unitChange"
                    >
                      <el-option
                          v-for="item in cuttingEdgeThicknessUnitIds"
                          :key="item.id"
                          :value="item.id"
                          :label="item.unitName"
                      ></el-option>
                    </el-select>
<!--                  <scrollLoadSelect-->
<!--                      v-model="states.formData.cuttingEdgeThicknessUnitId"-->
<!--                      :cached-name="states.formData.cuttingEdgeThicknessUnitName"-->
<!--                      :api="UnitDescApi"-->
<!--                      searchKey="unitName"-->
<!--                      :disabled-list="props.unitsList.filter(e=>e.status==0).map(e=>e.id)"-->
<!--                      @change="unitChange"-->
<!--                  ></scrollLoadSelect>-->
<!--                  unitGroupCode unitGroupId unitGroupName-->
                </el-form-item>
                <el-form-item v-else label="切削刃厚度单位" prop="cuttingEdgeThicknessUnitId">
                    <el-select
                        v-model="states.formData.cuttingEdgeThicknessUnitId"
                        clearable
                        placeholder="请选择"
                        filterable
                        :disabled-list="props.unitsList.filter(e=>e.status==0).map(e=>e.id)"
                        @change="unitChange"
                    >
                      <el-option
                          v-for="item in cuttingEdgeThicknessUnitIds"
                          :key="item.id"
                          :value="item.id"
                          :label="item.unitName"
                      ></el-option>
                    </el-select>
<!--                  <scrollLoadSelect-->
<!--                      v-model="states.formData.cuttingEdgeThicknessUnitId"-->
<!--                      :cached-name="states.formData.cuttingEdgeThicknessUnitName"-->
<!--                      :api="UnitDescApi"-->
<!--                      searchKey="unitName"-->
<!--                      :disabled-list="props.unitsList.filter(e=>e.status==0).map(e=>e.id)"-->
<!--                      @change="unitChange"-->
<!--                  ></scrollLoadSelect>-->
                </el-form-item>
            </el-col>
        </el-row>
        <el-row :gutter="32">
            <el-col :span="12">
                <el-form-item label="备注" prop="remark">
                    <el-input
                        v-model.trim="states.formData.remark"
                        :placeholder="props.updateType != 'read' ? ' ' : ' '"
                        type="textarea"
                        show-word-limit
                        :rows="3"
                        maxlength="500"
                    ></el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <span class="title-item">
            <p class="tab-content"></p>
            <p class="tab-title">使用状况</p>
        </span>
        <el-row :gutter="32">
            <el-col :span="4">
                <el-form-item label="使用寿命" prop="serviceLife">
                    <el-row :gutter="6">
                        <el-col :span="15">
                            <el-input-number
                                v-model="states.formData.serviceLife"
                                :min="1"
                                :max="Math.pow(10, 10)"
                                v-bt-noe
                                :precision="0"
                                controls-position="right"
                                :placeholder="props.updateType != 'read' ? '请输入' : ' '"
                            ></el-input-number>
                        </el-col>
                        <el-col :span="9">
                            <el-select
                                v-model="states.formData.serviceLifeUnit"
                                :clearable="false"
                                filterable
                                :placeholder="props.updateType != 'read' ? '请选择' : ' '"
                            >
                                <el-option
                                    v-for="item of states.timeList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.value"
                                ></el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                </el-form-item>
            </el-col>
            <el-col :span="4">
                <el-form-item label="检验周期" prop="inspectionCycle">
                    <el-row :gutter="6">
                        <el-col :span="15">
                            <el-input-number
                                v-model="states.formData.inspectionCycle"
                                :min="1"
                                :max="Math.pow(10, 10)"
                                v-bt-noe
                                :precision="0"
                                controls-position="right"
                                :placeholder="props.updateType != 'read' ? '请输入' : ' '"
                            ></el-input-number>
                        </el-col>
                        <el-col :span="9">
                            <el-select
                                v-model="states.formData.inspectionCycleUnit"
                                :clearable="false"
                                filterable
                                :placeholder="props.updateType != 'read' ? '请选择' : ' '"
                            >
                                <el-option
                                    v-for="item of states.timeList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.value"
                                ></el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                </el-form-item>
            </el-col>
            <el-col :span="4">
                <el-form-item label="提前预警周期" prop="earlyWarningTime">
                    <el-row :gutter="6">
                        <el-col :span="15">
                            <el-input-number
                                v-model="states.formData.earlyWarningTime"
                                :min="1"
                                :max="Math.pow(10, 10)"
                                v-bt-noe
                                :precision="0"
                                controls-position="right"
                                :placeholder="props.updateType != 'read' ? '请输入' : ' '"
                            ></el-input-number>
                        </el-col>
                        <el-col :span="9">
                            <el-select
                                v-model="states.formData.earlyWarningTimeUnit"
                                :clearable="false"
                                filterable
                                :placeholder="props.updateType != 'read' ? '请选择' : ' '"
                            >
                                <el-option
                                    v-for="item of states.timeList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.value"
                                ></el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                </el-form-item>
            </el-col>
        </el-row>
        <span class="title-item">
            <p class="tab-content"></p>
            <p class="tab-title">控制</p>
        </span>
        <el-row :gutter="32">
            <el-col :span="1.5">
                <div class="item">组合刀具</div>
            </el-col>
            <el-col :span="4">
                <el-radio-group v-model="states.formData.isCombined" class="ml-4">
                    <el-radio :label="1" size="large">是</el-radio>
                    <el-radio :label="0" size="large">否</el-radio>
                </el-radio-group>
            </el-col>
        </el-row>
    </el-form>
</template>

<script setup lang="ts">
import { e_rule } from '@/utils/require-rule/index'
import { reactive, ref, watch,onMounted  } from 'vue'
// import { ToolTypeApi } from '@/base/consts/api/basic'
// import { BtUseAppStore } from 'beeboat-ui/es/core/store'
// import UnitDescApi from '@/usage/api/basic/unit/unit-desc-api'
import scrollLoadSelect from '@/components/NewComponents/scroll-load-select/index.vue'
import { treeTool } from '@/api/basic/toolType-api'
import {listPage} from  '@/api/basic/unit-desc-api'
// const appStore = BtUseAppStore()
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { baseUnitIds } = toRefs<any>(proxy?.useDict('course_rating'));
const emits = defineEmits(['baseUnitChange'])
const props = defineProps({
    updateType: {
        type: String,
        default: 'read',
    },
    unitsList: Array<any>,
    baseUnitsList: Array,
    visible: Boolean,
    assigned: Boolean,
})
const cuttingEdgeThicknessUnitIds=ref([])
onMounted(() => {
  console.log("单位")
  const param=reactive({pageNumber:1, pageSize:10000,temp:2})
  // cuttingEdgeThicknessUnitIds
  listPage( param ).then(res => {
    console.log(res.data);
    cuttingEdgeThicknessUnitIds.value = res.data.records
  })
})
watch(
    () => props.visible,
    v => {
        if (v) {
            init()
            states.formData.serviceLifeUnit = '1'
            states.formData.earlyWarningTimeUnit = '2'
            states.formData.inspectionCycleUnit = '1'
            states.formData.cuttingEdgeThickness = undefined
            states.formData.cuttingEdgeThicknessUnitId = undefined
        }
    },
)

const states = reactive({
    //弹窗标题
    dialogTitle: '',
    //表单
    formData: {
        toolTypeId: undefined, // 刀具类别ID
        toolProperty: undefined, // 刀具属性
        baseUnitId: undefined, // 基本单位id
        specs: undefined, // 规格
        model: undefined, // 型号
        texture: undefined, // 材质
        serviceLife: undefined, // 使用寿命
        serviceLifeUnit: '1', // 寿命单位
        earlyWarningTime: undefined, // 提前预警时间
        earlyWarningTimeUnit: '2', // 提前预警时间单位
        inspectionCycle: undefined, // 检验周期
        inspectionCycleUnit: '1', // 检验周期单位
        accuracy: undefined, // 精度
        hardness: undefined, // 硬度
        remark: undefined, // 备注
        isCombined: 0, // 组合刀具
        // 基本单位名称
        baseUnitName: undefined,
        cuttingEdgeThickness: undefined,
        cuttingEdgeThicknessUnitId: undefined,
        cuttingEdgeThicknessUnitName: undefined,
        isSharpening: undefined,
        isCoating: undefined,
    },
    //显示隐藏
    visible: false,
    toolTypeTree: [],
    cutterAttrributeList: [],//appStore.getDictByParentCode('INNER_DICT_MATERIALPROPERTY'), // 刀具属性
    timeList: [],//appStore.getDictByParentCode('INNER_DICT_CutterTimes'), // 刀具使用状况下拉
    cuttingEdgeThicknessUnitFix: 0,
    cuttingEdgeThicknessUnitType: 0,
})
const formRef = ref()

const startEdit = data => {
    for (let i in states.formData) {
        states.formData[i] = data[i]
    }
    // baseUnitChange(states.formData.baseUnitId)
    // 获取位数
    unitChange()
}

// 选择物料带过来部分属性
const setMaterialData = data => {
    states.formData.toolProperty = data.property
    states.formData.baseUnitId = data.baseUnitId
    states.formData.baseUnitName = data.baseUnitName
    states.formData.specs = data.specs
    states.formData.model = data.model
    states.formData.texture = data.texture
    states.formData.remark = data.description
    baseUnitChange(data.baseUnitId, data?.baseUnitName || '')
}

// 有单位变化 将位数都重新拿一下
const unitChange = () => {
    if (states.formData.cuttingEdgeThicknessUnitId) {
        states.cuttingEdgeThicknessUnitFix = props.unitsList.find(
            x => x.id == states.formData.cuttingEdgeThicknessUnitId,
        ).decimalBit
        states.cuttingEdgeThicknessUnitType = props.unitsList.find(
            x => x.id == states.formData.cuttingEdgeThicknessUnitId,
        ).roundingType
    } else {
        states.cuttingEdgeThicknessUnitFix = 0
        states.cuttingEdgeThicknessUnitType = 0
    }
}

// 获取树
const init = () => {
  treeTool({ temp: 1 }).then(res => {
        states.toolTypeTree = res.data
    })
}
init()
// 基本单位变化
const baseUnitChange = (v, name) => {
    emits('baseUnitChange', v, name)
}

const getFormData = () => {
    return states.formData
}

defineExpose({ formRef, formData: states.formData, startEdit, getFormData, setMaterialData })
</script>
<style lang="scss" scoped>
.title-item {
    font-weight: 800;
    font-size: 14px;
    margin-bottom: 8px;
    display: inline-block;
    p {
        display: inline-block;
    }
}

:deep(.el-input-number .el-input__inner) {
    text-align: left;
}
.item {
    height: 40px;
    line-height: 43px;
}
</style>
