<template>
  <div class="ever-main">
    <div class="public-search-area">
      <div :class="['search-box', states.isExpand ? 'public-search-area-expand' : 'public-search-area-fixed']">
        <el-form ref="searchForm" :model="states.searchForm" label-width="80px">
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item label="资产编号" prop="assetCode">
                <el-input v-model="states.searchForm.assetCode" clearable placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="设备编号" prop="accountCode">
                <el-input v-model="states.searchForm.accountCode" clearable placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="设备名称" prop="accountName">
                <el-input v-model="states.searchForm.accountName" clearable placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <div class="flex-row expand-box flex-j-end">
                <div class="flex-row point flex-a-center" @click="handleExpand()">
                  <span>{{ states.isExpand ? '折叠' : '展开' }}</span>
                  <el-icon class="mlr-10" v-if="states.isExpand">
                    <CaretTop />
                  </el-icon>
                  <el-icon class="mlr-10" v-else>
                    <CaretBottom />
                  </el-icon>
                </div>
                <el-button @click="search()" type="primary">查&nbsp;询</el-button>
                <el-button @click="reast()">重&nbsp;置</el-button>
              </div>
            </el-col>
            <template v-if="states.isExpand">
              <el-col :span="6">
                <el-form-item label="责任人" prop="dutyName">
                  <el-input v-model="states.searchForm.dutyName" clearable placeholder="请输入"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="寿命状态" prop="lifeStatus">
                  <el-select v-model="states.searchForm.lifeStatus" clearable placeholder="请选择" filterable>
                    <el-option v-for="item in route_attribute_type" :key="item.value" :value="item.value" :label="item.label"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="品牌" prop="brand">
                  <el-input v-model="states.searchForm.brand" clearable placeholder="请输入"></el-input>
                </el-form-item>
              </el-col>
            </template>
          </el-row>
        </el-form>
      </div>
    </div>

    <div class="public-content-area public-table-thin public-page-thin">
      <div class="mb10">
        <el-button type="primary" @click="handleAdd" v-hasPermi="['equipment:info:add']">新&nbsp;增</el-button>
        <el-button type="success" plain :disabled="states.mainSelection.length !== 1" v-hasPermi="['equipment:info:edit']" @click="handleEdit"
          >修&nbsp;改</el-button
        >
        <el-button v-hasPermi="['equipment:info:import']" type="primary" plain @click="startImport">导入</el-button>
        <el-dropdown v-drop-show class="ml10" v-hasPermi="['equipment:info:down']">
          <el-button type="primary" plain>
            导&nbsp;出
            <el-icon class="el-icon--right">
              <CaretBottom></CaretBottom>
            </el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="excelExport(1)" :disabled="states.mainSelection.length == 0"> 勾选导出 </el-dropdown-item>
              <el-dropdown-item @click="excelExport(2)">全部导出</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-button class="ml10" type="danger" plain :disabled="!states.mainSelection.length" @click="deleteModel" v-hasPermi="['equipment:info:del']">
          删&nbsp;除</el-button
        >
      </div>
      <div class="public-table-box">
        <el-table :data="states.data" style="width: 100%" v-loading="states.loading" height="100%" @selection-change="handleSelectionChange" border>
          <el-table-column type="selection" width="55" fixed></el-table-column>
          <el-table-column type="index" width="55" label="序号" fixed></el-table-column>
          <el-table-column
            v-for="item in columnList"
            :key="item.prop"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            :fixed="item.fixed"
            show-overflow-tooltip
          >
            <template #default="scope">
              <span v-if="item.prop === 'eqpModelId'">
                <dict-tag :options="eam_eqp_model" :value="scope.row.eqpModelId" />
              </span>
              <span v-else-if="item.prop === 'assetOwnership'">
                <dict-tag :options="eam_asset_ownership" :value="scope.row.assetOwnership" />
              </span>
              <span v-else-if="item.prop === 'assetType'">
                <dict-tag :options="eam_asset_type" :value="scope.row.assetType" />
              </span>
              <span v-else-if="item.prop === 'eqpNature'">
                <dict-tag :options="eam_eqp_attribute" :value="scope.row.eqpNature" />
              </span>
              <span v-else-if="item.prop === 'lifeStatus'">
                <dict-tag :options="eam_eqp_life_state" :value="scope.row.lifeStatus" />
              </span>
              <span v-else-if="item.prop === 'aBCType'">
                <dict-tag :options="eam_eqp_abc_type" :value="scope.row.aBCType" />
              </span>
              <span v-else-if="item.prop === 'isSpecial'">
                <dict-tag :options="eam_yes_no" :value="scope.row.isSpecial" />
              </span>
              <span v-else-if="item.prop === 'isCncEqp'">
                <dict-tag :options="eam_yes_no" :value="scope.row.isCncEqp" />
              </span>
              <span v-else-if="item.prop === 'isEpEqp'">
                <dict-tag :options="eam_yes_no" :value="scope.row.isEpEqp" />
              </span>
              <span v-else-if="item.prop === 'isNetEqp'">
                <dict-tag :options="eam_yes_no" :value="scope.row.isNetEqp" />
              </span>
              <span v-else-if="item.prop === 'isProdEqp'">
                <dict-tag :options="eam_yes_no" :value="scope.row.isProdEqp" />
              </span>
              <span v-else-if="item.prop === 'unit'">
                <dict-tag :options="eam_eqp_untis" :value="scope.row.unit" />
              </span>
              <span v-else> {{ scope.row[item.prop] || '-' }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination-box">
        <el-pagination
          background
          small
          layout="total, prev, pager, next, sizes, jumper"
          :page-sizes="[10, 20, 25, 30, 50, 100, 200, 500]"
          :page-size="states.table.pageSize"
          :current-page="states.table.pageNumber"
          :total="states.table.total"
          @current-change="changePageNumber"
          @size-change="changePageSize"
        >
        </el-pagination>
      </div>
    </div>
  </div>

  <editDialog ref="editDialogRef" @success="reast"></editDialog>
  <!-- <printDialog ref="printDialogRef"></printDialog> -->
  <excelImport
    ref="excelImportRef"
    :fileParams="['equipment.xlsx', '设备台账导入模板.xlsx']"
    :requestApi="onImportLoad"
    @success="success"
  ></excelImport>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { CaretBottom, CaretTop } from '@element-plus/icons-vue'
import editDialog from './edit-dialog.vue'
import { E_Msg} from '@/utils/message/index'
import printDialog from './print-dialog.vue'
import EqpAccountApi from '@/api/basic/eqp-account-api'
import {exportFile} from '@/utils/utils'
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { route_attribute_type, eam_eqp_attribute, eam_eqp_untis, eam_eqp_life_state, eam_eqp_abc_type } = toRefs<any>(proxy?.useDict('route_attribute_type', 'eam_eqp_attribute', 'eam_eqp_untis', 'eam_eqp_life_state', 'eam_eqp_abc_type'));
const { eam_asset_type,eam_asset_ownership ,eam_special_eqp_type} = toRefs<any>(proxy?.useDict('eam_asset_type', 'eam_asset_ownership','eam_special_eqp_type'));
const { eam_eqp_model,eam_yes_no} = toRefs<any>(proxy?.useDict('eam_eqp_model','eam_yes_no'));
const emits = defineEmits(['initTree'])
const editDialogRef = ref()
const excelImportRef = ref()
const states = reactive({
    searchForm:{}as any,
    activeName: '',
    loading:false,
    isExpand:false,
    // 勾选的值
    mainSelection: [],
    // 舍入类型
    operationTypeList: [],
    // 记录左侧点击的id
    parentId: '-1',
    unitGroupOptions: [],
    //单位组数据
    unitGroupList: [],
    saveParam: undefined,
    data:[],
    table:{
        pageNumber: 1,
        pageSize:20,
        total:0,
    }
})
onMounted(() => {
    reast()
})

const initTable = ()=>{
    let params = {
        pageNumber: states.table.pageNumber,
        pageSize: states.table.pageSize,
        ...states.searchForm,
        eqpTypeId:states.parentId
    }
    // 部门 useOrgId
    // 位置 plantLocationId
    if(states.activeName=='useOrgId'&&states.parentId){
        params.useOrgId = states.parentId
        delete params.eqpTypeId
    } else if(states.activeName=='plantLocationId'&&states.parentId){
        params.plantLocationId = states.parentId
        delete params.eqpTypeId
    }
    if(!states.parentId){
        delete params.eqpTypeId

    }
    if(!states.loading ){
        states.loading = true
        EqpAccountApi.listPage(params).then(res=>{
        if(Number(res.code) === 0){
            states.data = res.data.records||[]
            states.table.total = Number(res.data.total||0)
        }
    }).finally(()=>{
        states.loading = false
    })
    }

}
const reast = ()=>{
    states.table.pageNumber =1
    states.table.pageSize = 20
    states.mainSelection = []
    states.searchForm = {} as any
    initTable()
}

const search = ()=>{
    states.table.pageNumber =1
    states.table.pageSize = 20
    states.parentId = ''

    states.mainSelection = []
    initTable()
}

// 单位组点击
const groupClick = (type,id) => {
    states.activeName = type
    if(type==='eqpTypeId'&&id){
        states.parentId = id
    } else if(type&&id){
        states.parentId = id
    } else {
        states.parentId = ''
    }
    states.mainSelection = []
    reast()

}
// 单位组变化
const groupChange = dataList => {
    states.unitGroupOptions = dataList
}
const handleExpand = () => {
    states.isExpand = !states.isExpand
}
//处理勾选
const handleSelectionChange = (val: any) => {
    states.mainSelection = val
    console.log(states.mainSelection)
}
const changePageNumber = val=>{
    states.table.pageNumber = val
    initTable()
}
const changePageSize = val=>{
    states.table.pageSize = val
    initTable()
}
const handleAdd = ()=>{
    editDialogRef.value.startAddData(states.parentId)
}
const handleEdit = ()=>{
    editDialogRef.value.startEditData(states.mainSelection[0],'edit')
}
const printDialogRef = ref()
const handlePrint = ()=>{
    printDialogRef.value.showOpenDialog()
}
const onImportLoad = (params = {}) => {
    return EqpAccountApi.importExcel(params)
}
// 导出
const excelExport = async val => {
    let ids = []
    // 勾选导出
    if (val == 1) {
        states.mainSelection.forEach(ele => {
            ids.push(ele.id)
        })
    }
    EqpAccountApi.exportListPage({
        pageNumber: 1,
        pageSize: 9999,
        ids:ids.length?ids:undefined
    }).then(async (resp: any) => {
        exportFile(resp,'设备台账导出文件.xlsx')
    })
}
// 删除数据
const deleteModel = () => {
    E_Msg.confirm('删除确认', '删除后的数据无法恢复，请谨慎操作！').then(() => {
            EqpAccountApi.deleteBatch({ idList: states.mainSelection.map(x => x.id) })
            .then(() => {
                E_Msg.newMessage('操作成功')
                reast()
            })

        })
}
// 新增修改成功 刷新树
const success = () => {
    //清空勾选
    // craftBtTable.value.clearSelection()
    states.mainSelection = []
    // craftBtTable.value.refresh()
}
// 开始导入
const startImport = () => {
    excelImportRef.value.startImport()
}
const columnList = [
    {
        label: '资产编号',
        prop: 'assetCode',
        width: '150px',
        fixed: 'left'
    },
    {
        label: '设备编号',
        prop: 'accountCode',
        width: '150px',
        fixed: 'left'
    },
    {
        label: '设备名称',
        prop: 'accountName',
        width: '150px',
        fixed: 'left'
    },
    {
        label: '资产类别',
        prop: 'assetType',
         width: '100px',
    },
    {
        label: '资产权属',
        prop: 'assetOwnership',
         width: '100px',
    },
    {
        label: '设备类别',
        prop: 'typeName',
         width: '100px',
    },
    {
        label: '设备机型',
        prop: 'eqpModelId',
         width: '100px',
    },
    {
        label: '设备属性',
        prop: 'eqpNature',
         width: '100px',
    },
    {
        label: '规格',
        prop: 'specs',
    },
    {
        label: '型号',
        prop: 'model',
    },
    {
        label: '原值（元）',
        prop: 'originalValue',
         width: '100px',
    },
    {
        label: '环保设备',
        prop: 'isEpEqp',
         width: '100px',
    },
    {
        label: '数控设备',
        prop: 'isCncEqp',
         width: '100px',
    },
    {
        label: '联网设备',
        prop: 'isNetEqp',
         width: '100px',
    },
    {
        label: '生产设备',
        prop: 'isProdEqp',
         width: '100px',
    },
    {
        label: '转圈日期',
        prop: 'transferDate',
         width: '100px',
    },
    {
        label: '成本中心',
        prop: 'costCenter',
         width: '100px',
    },
    {
        label: '使用部门',
        prop: 'useOrgName',
         width: '100px',
    },
    {
        label: '责任人',
        prop: 'dutyName',
         width: '100px',
    },
    {
        label: '厂房位置',
        prop: 'plantName',
         width: '100px',
    },
    {
        label: '播放位置',
        prop: 'displayLocation',
         width: '100px',
    },
    {
        label: '运维组织',
        prop: 'omOrgName',
         width: '100px',
    },
    {
        label: '运维部门',
        prop: 'omDeptName',
         width: '100px',
    },
    {
        label: '寿命状态',
        prop: 'lifeStatus',
         width: '100px',
    },
    {
        label: 'ABC分类',
        prop: 'abctype',
        width: '100px',
    },
    {
        label: '投产日期',
        prop: 'operationDate',
         width: '100px',
    },
    {
        label: '单位',
        prop: 'unit',
    },
    {
        label: '出厂编号',
        prop: 'leaveFactoryCode',
         width: '100px',
    },
    {
        label: '出厂日期',
        prop: 'leaveFactoryDate',
         width: '100px',
    },
    {
        label: '特种设备',
        prop: 'isSpecial',
         width: '100px',
    },
    {
        label: '备注',
        prop: 'remark',
    },
    {
        label: '品牌',
        prop: 'brand',
         width: '100px',
    },
    {
        label: '生产厂商',
        prop: 'produceFirm',
         width: '100px',
    },
    {
        label: '供应商',
        prop: 'supplierId',
         width: '100px',
    },
    {
        label: '产地',
        prop: 'producingArea',
        width: '100px',
    },
    {
        label: '创建人',
        prop: 'creatorName',
         width: '100px',
    },
    {
        label: '创建时间',
        prop: 'gmtCreate',
         width: '160px',
    },
]
defineExpose({ groupChange, groupClick })
</script>
<style scoped>
.ever-main {
  height: 100%;
  width: 100%;
}

/* ::v-deep.bt-table .header-left {
    margin: 0px;
}

.ever-main {
    height: 100%;
    width: 100%;
}
.card {
    display: flex;
    flex-direction: column;
} */
</style>
