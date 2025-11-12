<template>
    <!-- <el-card class="bt-view__card--layout-full card" :body-style="{ flex: '1' }">
        <template #header>工作中心信息</template> -->
    <div class="ever-main">

        <div class="public-search-area">
            <div :class="['search-box',states.isExpand?'public-search-area-expand':'public-search-area-fixed']">
                <el-form ref="searchForm" :model="states.searchForm" label-width="90px">
                    <el-row :gutter="10">
                        <el-col :span="5">
                            <el-form-item label="生产中心编码" prop="workCenterCode">
                                <el-input v-model="states.searchForm.workCenterCode" clearable
                                    placeholder="请输入"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="生产中心名称" prop="workCenterName">
                                <el-input v-model="states.searchForm.workCenterName" clearable
                                    placeholder="请输入"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="状态" prop="state">
                                <el-select v-model="states.searchForm.state" placeholder="请选择">
                                    <el-option label="启用" value=1 />
                                    <el-option label="停用" value=0 />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5" />
                        <el-col :span="4">
                            <div class="flex-row expand-box  flex-j-end">
                                <!-- <div class="flex-row point" @click="handleExpand()">
                                    <span>{{ states.isExpand?'折叠':'展开' }}</span>
                                    <el-icon class="mlr-10" v-if="states.isExpand">
                                        <CaretTop />
                                    </el-icon>
                                    <el-icon class="mlr-10" v-else>
                                        <CaretBottom />
                                    </el-icon>
                                </div> -->
                                <el-button type="primary" @click="initTable">查&nbsp;询</el-button>
                                <el-button @click="reast">重&nbsp;置</el-button>
                            </div>
                        </el-col>

                    </el-row>
                </el-form>
            </div>
        </div>
        <div class="public-content-area public-table-thin public-page-thin">
            <div class="mb10" style="align-items: center;">
                <div class="title"><b>工作中心</b></div>
                <div class="btn">
                    <el-button type="primary" @click="handleAdd">新&nbsp;增</el-button>
                    <el-button type="success" plain :disabled="states.mainSelection.length !==1"
                        @click="handleEdit">修&nbsp;改</el-button>
                    <el-dropdown class="ml10">
                        <el-button type="primary" plain :disabled="!states.mainSelection.length"
                            @click="handleChangeStatus(1)">
                            启&nbsp;用<el-icon class="el-icon--right">
                                <CaretBottom></CaretBottom>
                            </el-icon>
                        </el-button>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item :disabled="!states.mainSelection.length"
                                    @click="handleChangeStatus(0)">
                                    停&nbsp;用
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                    <el-button class="ml10" plain type="danger" :disabled="!states.mainSelection.length"
                        @click="deleteModel">
                        删&nbsp;除</el-button>
                </div>
            </div>
            <div class="public-table-box">
                <el-table :data="states.data" style="-width: 1240px " height="100%" @selection-change="handleSelection"
                    @row-click="showSonData" border>
                    <el-table-column type="selection" width="55" fixed></el-table-column>
                    <el-table-column type="index" label="序号" width="70" fixed></el-table-column>
                    <el-table-column v-for="item in columnList" :key="item.prop" :prop="item.prop" :label="item.label"
                        :width="item.width" :fixed="item.fixed" :formatter="item.formatter" show-overflow-tooltip>
                        <template #default="scope">
                            <span v-if="item.prop ==='abilityUnitsId'">
                                <dict-tag :options="basic_ability_units" :value="scope.row.abilityUnitsId" />
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <div class="mb10">
                <div class="title"><b>派工单元</b></div>
                <div class="btn">
                    <el-button type="primary" @click="editDispatchunitDialogAdd"
                        :disabled="states.mainSelection.length !==1">新&nbsp;增</el-button>
                    <el-button type="success" plain :disabled="statesSon.mainSelection.length !==1"
                        @click="editDispatchunitDialogEdit">修&nbsp;改</el-button>
                    <el-dropdown class="ml10">
                        <el-button type="primary" plain :disabled="!statesSon.mainSelection.length"
                            @click="handleChangeStatusUnit(1)">
                            启&nbsp;用<el-icon class="el-icon--right">
                                <CaretBottom></CaretBottom>
                            </el-icon>
                        </el-button>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item :disabled="!statesSon.mainSelection.length"
                                    @click="handleChangeStatusUnit(0)">
                                    停&nbsp;用
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                    <el-button class="ml10" plain type="danger" :disabled="!statesSon.mainSelection.length"
                        @click="deleteModelUnit">
                        删&nbsp;除</el-button>
                </div>
            </div>
            <div class="public-table-box">
                <el-table :data="statesSon.data" style="width: 100%" @selection-change="handleSelectionSon" border
                    height="100%">
                    <el-table-column type="selection" width="55" fixed></el-table-column>
                    <el-table-column type="index" label="序号" width="70" fixed></el-table-column>
                    <el-table-column v-for="item in columnSonList" :key="item.prop" :prop="item.prop"
                        :label="item.label" :width="item.width" :fixed="item.fixed" :formatter="item.formatter"
                        show-overflow-tooltip>
                        <template #default="scope">
                            <span v-if="item.prop ==='abilityUnitsId'">
                                <dict-tag :options="basic_ability_units" :value="scope.row.abilityUnitsId" />
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagination-box">
                <el-pagination background small layout="total, prev, pager, next, sizes, jumper"
                    :page-sizes="[10, 20, 25, 30, 50, 100, 200, 500]" :page-size="states.table.pageSize"
                    :current-page="states.table.pageNumber" :total="Number(states.table.total||0)"
                    @current-change="changePageNumber" @size-change="changePageSize">
                </el-pagination>
            </div>
        </div>
    </div>
    <!-- </el-card> -->
    <editDialog ref="editDialogRef" @succeed="success"></editDialog>
    <edit-dispatchunit-dialog ref="editDispatchunitDialog" @success-unit="successUnit"></edit-dispatchunit-dialog>
    <excelImport ref="excelImportRef" :fileParams="['craft.xlsx', '工种信息导入模板.xlsx']" :requestApi="onImportLoad"
        @success="success"></excelImport>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { CaretBottom, CaretTop } from '@element-plus/icons-vue'
import editDialog from './edit-dialog-new.vue'
import { E_Msg } from '@/utils/message/index'
// import {importExcel,changeStatus,exportListPage,listPage } from '@/api/basic/work-type-group-api'
import {listPage,getOneById,deleteByIds,changeStatus     ,getListByWorkCenterId,changeStatusUnit,deleteBatchUnit} from '@/api/basic/work-center-api'
import workTypeDescApi from "@/api/basic/work-type-desc-api";
import EditDispatchunitDialog from "@/views/capabilityModel/workCenter/components/edit-dispatchunit-dialog.vue";
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { basic_ability_units } = toRefs<any>(proxy?.useDict('basic_ability_units'));
// <el-icon><CaretBottom /></el-icon>
// <el-icon><CaretTop /></el-icon>
const emits = defineEmits(['initTree'])
const editDialogRef = ref()
const excelImportRef = ref()
const editDispatchunitDialog = ref()
const states = reactive({
    searchForm:{}as any,
    isExpand:false,
    // 勾选的值
    mainSelection: [],
    // 舍入类型
    operationTypeList: [],
    // 记录左侧点击的id
    unitGroupId: '',
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
const statesSon=reactive({
  data:[],
  // 勾选的值
  mainSelection: [],
  // 记录左侧点击的id
  unitGroupId: '',
  unitGroupOptions: [],
})
onMounted(() => {
    reast()
})
const initTable = ()=>{
    listPage({
        pageNumber: states.table.pageNumber,
        pageSize: states.table.pageSize,
        ...states.searchForm,
        unitGroupId:states.unitGroupId
    }).then(res=>{
      console.log(1);
        if(res.code == 0){
          console.log(2);
          states.data = res.data.records
          console.log(states.data);
            states.table.total = res.data.total
        }
    })
}
const reast = ()=>{
    states.table.pageNumber =1
    states.table.pageSize = 20
    states.unitGroupId = ''
    states.searchForm = {} as any
    states.mainSelection = []
    initTable()
}


// 单位组点击
const groupClick = id => {
    states.unitGroupId = id
    states.mainSelection = []
}
// 单位组变化
const groupChange = dataList => {
    states.unitGroupOptions = dataList
}
const handleExpand = () => {
    states.isExpand = !states.isExpand
}
//处理勾选
const handleSelection = (val: any) => {
    states.mainSelection = val
}
const cacheShowSonParamData=ref();
const showSonData=(val: any)=>{
  cacheShowSonParamData.value=val;
  getListByWorkCenterId(val).then(res=>{
      statesSon.data=res.data;
  })
}
//工作单元
const editDispatchunitDialogAdd=()=>{
  states.mainSelection[0].id;
  let data= JSON.parse(JSON.stringify(states.mainSelection[0]));
  delete data.id;
  editDispatchunitDialog.value.openDialog({
    pid:states.mainSelection[0].id,
    // workCenterName:states.mainSelection[0].workCenterName,
    // factoryName:states.mainSelection[0].factoryName,
    // factoryId:states.mainSelection[0].factoryId,
    ...data
  })
}
const editDispatchunitDialogEdit=()=>{
  console.log(statesSon.mainSelection);
  // states.mainSelection[0].id;
  editDispatchunitDialog.value.openDialog({
    id:statesSon.mainSelection[0].id,
    // pid:states.mainSelection[0].id,
    // workCenterName:states.mainSelection[0].workCenterName,
    // factoryName:states.mainSelection[0].factoryName,
  })
}
const handleSelectionSon = (val: any) => {
  statesSon.mainSelection = val
}
const changePageNumber = val=>{
    states.table.pageNumber = val
    initTable()
}
const changePageSize = val=>{
    states.table.pageSize = val
    initTable()
}
const handleEdit = ()=>{
  const params =reactive({id:states.mainSelection[0].id})
  getOneById(params).then(res=>{
    editDialogRef.value.startEditData(res.data)
  })
}
const handleAdd = ()=>{
    editDialogRef.value.startAddData()
}
const onImportLoad = (params = {}) => {
    // return importExcel(params)
}
//修改状态
const handleChangeStatus = value => {
    if (!value && states.mainSelection.find(x => x.isBase)) {
        E_Msg.confirm('提示', '基准单位不允许停用')
        return
    }
    if (states.mainSelection.find(x => x.status == value)) {
        E_Msg.confirm('提示', `只能选择${value ? '停用' : '启用'}的数据`)
        return
    }
    E_Msg.confirm('提示', `确认要${value == 1 ? '启用' : '停用'}所选的数据吗？`).then(() => {
        const params = {
            idList: states.mainSelection.map(x => x.id),
            status: value,
        }
      changeStatus(params).then(() => {
                E_Msg.newMessage('修改成功');
                initTable()
            })
    })
}
//修改状态
const handleChangeStatusUnit = value => {
  // if (!value && statesSon.mainSelection.find(x => x.isBase)) {
  //   E_Msg.confirm('提示', '基准单位不允许停用')
  //   return
  // }
  if (statesSon.mainSelection.length==0){
    E_Msg.confirm('提示', `请勾选要${value ? '停用' : '启用'}的数据`)
    return
  }
  if (statesSon.mainSelection.find(x => x.status == value)) {
    E_Msg.confirm('提示', `只能选择${value ? '停用' : '启用'}的数据`)
    return
  }
  E_Msg.confirm('提示', `确认要${value == 1 ? '启用' : '停用'}所选的数据吗？`).then(() => {
    const params = {
      idList: statesSon.mainSelection.map(x => x.id),
      status: value,
    }
    changeStatusUnit(params).then(() => {
      E_Msg.newMessage('修改成功');
      showSonData(cacheShowSonParamData.value)
    })
  })
}
// 导出
const excelExport = async val => {
    let ids = []
    // // 勾选导出
    // if (val == 1) {
    //     states.mainSelection.forEach(ele => {
    //         ids.push(ele.id)
    //     })
    //     const excelBlob = await exportListPage({
    //         idList: ids,
    //         pageNumber: 1,
    //         pageSize: states.mainSelection.length,
    //     })
    //     exportFile(excelBlob).then(res => {
    //         if (res) {
    //             E_Msg.confirm('提示', res.msg)
    //         }
    //     })
    //     // 全部导出
    // } else if (val == 2) {
    //     const excelBlob = await exportListPage({
    //         ...states.saveParam,
    //         pageNumber: 1,
    //         pageSize: 9999,
    //     })
    //     exportFile(excelBlob).then(res => {
    //         if (res) {
    //             E_Msg.confirm('提示', res.msg)
    //         }
    //     })
    // }
}
// 删除数据
const deleteModel = () => {
    E_Msg.confirm( `确认要删除这条信息吗`,'删除后的数据无法恢复，请谨慎操作！').then(async () => {
   await deleteByIds({idList: states.mainSelection.map(x => x.id)})
   await initTable()
    E_Msg.newMessage('删除成功');
  })
}
// 删除数据派工单元
const deleteModelUnit = () => {
    E_Msg.confirm( `确认要删除这条信息吗`,'删除后的数据无法恢复，请谨慎操作！').then(async () => {
   await deleteBatchUnit({idList: statesSon.mainSelection.map(x => x.id)})
   await  showSonData(cacheShowSonParamData.value)
    E_Msg.newMessage('删除成功');
  })
}
// 新增修改成功 刷新树
const success = () => {
    //清空勾选
    states.mainSelection = []
    initTable();
}
const successUnit=()=>{
  showSonData(cacheShowSonParamData.value)
  
}
// 开始导入
const startImport = () => {
    excelImportRef.value.startImport()
}
// 设置工作日历
const setWorkCalendar = () => {
    // workCalendarRef.value.startAdd(states.mainSelection, 'add')
}

const columnList = [
    {
        label: '生产中心编码',
        prop: 'workCenterCode',
       
        fixed: 'left',
    },
    {
        label: '生产中心名称',
        prop: 'workCenterName',
        fixed: 'left',
    },
    {
        label: '关联过程节点',
        prop: 'processNodes',
    },
    {
        label: '能力类型',
        prop: 'workCenterType',
        width: '100px',
    },
    {
        label: '能力单位',
        prop: 'abilityUnitsId',
        width: '100px',
    },
    {
        label: '能力值',
        prop: 'abilityData',
        width: '100px',
    },
    {
        label: '所属制造厂',
        prop: 'factoryName',
        width: '150px',
    },
    {
        label: '状态',
        prop: 'state',
        width: '100px',
      formatter: (row, column, cellValue) => {
        return cellValue == 1 ? '启用' : '停用';
      }
    },

    {
        label: '责任人',
        prop: 'responsiblePersonName',
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
        width: '',
    },

]

const columnSonList = [
  {
    label: '派工单元编码',
    prop: 'dispatchUnitCode',
    width: '120px',
    fixed: 'left',
  },
  {
    label: '派工单元名称',
    prop: 'dispatchUnitName',
    width: '120px',
    fixed: 'left',
  },
  {
    label: '工作中心类型',
    prop: 'processNodes',
    width: '120px',
  },
  {
    label: '能力单位',
    prop: 'abilityUnitsId',
    width: '',
  },
  {
    label: '能力值',
    prop: 'abilityData',
    width: '',
  },
  {
    label: '所属制造厂',
    prop: 'abilityData',
    width: '',
  },
  {
    label: '所属工段',
    prop: 'machiningSection',
    width: '',
  },
  {
    label: '所属工作中心',
    prop: 'workCenterName',
    width: '120px',
  },
  {
    label: '状态',
    prop: 'state',
    width: '',
    formatter: (row, column, cellValue) => {
      return cellValue == 1 ? '启用' : '停用';
    }
  },
  // {
  //   label: '单元主资源',
  //   prop: 'factoryNames',
  //   width: '',
  // },
  // {
  //   label: '工作日历',
  //   prop: 'factoryNamess',
  //   width: '',
  // },
  {
    label: '班制',
    prop: 'shiftsName',
    width: '',
  },

  {
    label: '班次',
    prop: 'shiftName',
    width: '',
  },
  {
    label: '负责人',
    prop: 'responsiblePersonName',
    width: '',
  },
  {
    label: '创建人',
    prop: 'creatorName',
    width: '',
  },
  {
    label: '创建时间',
    prop: 'gmtCreate',
    width: '',
  },

]
defineExpose({ groupChange, groupClick })
</script>
<style scoped>
/* 确保卡片体使用弹性布局 */
.el-card__body {
    display: flex;
    flex-direction: column;
    height: 100% !important;
    padding: 0 !important;
    overflow: hidden;
}

/* 主容器使用弹性布局 */
.ever-main {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    padding: 15px;
    box-sizing: border-box;
    overflow: hidden;
}

/* 内容区域布局 */
.public-content-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: white;
    border-radius: 4px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

/* 表格容器 */
.public-table-box {
    flex: 1;
    min-height: 200px;
    /* 确保有最小高度 */
    overflow: auto;
}

/* 按钮区域 */
.mb10 {
    margin-bottom: 15px;
    padding: 10px 15px;
    background: white;
    border-radius: 4px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    display: flex;
    align-items: center;
}

.title {
    float: left;
    line-height: 35px;
    text-align: center;
}

.btn {
    margin-left: 25px;
}

/* 分页区域 */
.pagination-box {
    display: flex;
    justify-content: flex-end;
    background: white;
}

/* 其他样式 */
.expand-box {
    display: flex;
    margin-left: 24px;
}

.flex-row {
    display: flex;
}

.point {
    cursor: pointer;
}

.card {
    display: flex;
    flex-direction: column;
}
</style>
