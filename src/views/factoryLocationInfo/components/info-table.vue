<template>
    <!-- <el-card class="bt-view__card--layout-full card" :body-style="{ flex: '1' }"> -->
        <!-- <template #header>工厂位置列表</template> -->
        <div class="ever-main">
        <div class="public-search-area">
            <div :class="['search-box',states.isExpand?'public-search-area-expand':'public-search-area-fixed']">
                <el-form ref="searchForm" :model="states.searchForm" label-width="120px">
                    <el-row :gutter="10">
                        <el-col :span="6">
                            <el-form-item label="厂房位置编码" prop="plantCode">
                                <el-input v-model="states.searchForm.plantCode" clearable
                                    placeholder="请输入"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="厂房位置名称" prop="plantName">
                                <el-input v-model="states.searchForm.plantName" clearable
                                    placeholder="请输入"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <!-- <el-form-item label="工种名称" prop="workTypeName">
                                <el-input v-model="states.searchForm.workTypeName" clearable
                                    placeholder="请输入"></el-input>
                            </el-form-item> -->
                        </el-col>
                        <el-col :span="6">
                            <div class="flex-row expand-box flex-j-end">
                                <!-- <div class="flex-row point flex-a-center" @click="handleExpand()">
                                    <span>{{ states.isExpand?'折叠':'展开' }}</span>
                                    <el-icon class="mlr-10" v-if="states.isExpand">
                                        <CaretTop />
                                    </el-icon>
                                    <el-icon class="mlr-10" v-else>
                                        <CaretBottom />
                                    </el-icon>
                                </div> -->
                                <el-button type="primary" @click="handleSearch">查&nbsp;询</el-button>
                                <el-button @click="reast">重&nbsp;置</el-button>
                            </div>
                        </el-col>
                        <!-- <template v-if="states.isExpand">
                            <el-col :span="6">
                                <el-form-item label="工种编码" prop="workTypeCode">
                                    <el-input v-model="states.searchForm.workTypeCode" clearable
                                        placeholder="请输入"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="工种名称" prop="workTypeName">
                                    <el-input v-model="states.searchForm.workTypeName" clearable
                                        placeholder="请输入"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="工种名称" prop="workTypeName">
                                    <el-input v-model="states.searchForm.workTypeName" clearable
                                        placeholder="请输入"></el-input>
                                </el-form-item>
                            </el-col>
                        </template> -->
                    </el-row>
                </el-form>
            </div>
        </div>
        <div class="public-content-area public-table-thin public-page-thin">
            <div class="mb10">
                <el-button type="primary" @click="handleAdd" v-hasPermi="['factory:info:add']">新&nbsp;增</el-button>
                <el-button type="success" plain :disabled="states.mainSelection.length !==1"
                    @click="handleEdit"  v-hasPermi="['factory:info:edit']">修&nbsp;改</el-button>
               
                <el-button v-hasPermi="['factory:info:del']" class="ml10" type="danger" plain :disabled="!states.mainSelection.length" @click="deleteModel">
                    删&nbsp;除</el-button>
                    <el-button type="success"  v-hasPermi="['factory:info:print']" :disabled="states.mainSelection.length !==1" plain @click="handlePrint">编码打印</el-button>
            </div>
            <div class="public-table-box">
                <el-table :data="states.data" style="width: 100% " height="100%" border @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" fixed></el-table-column>
                    <el-table-column v-for="item in columnList" :key="item.prop" :prop="item.prop" :label="item.label" :width="item.width" :fixed="item.fixed" show-overflow-tooltip>
                        <template #default="scope">
                            {{scope.row[item.prop]||'-'}}
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagination-box">
                <el-pagination background small layout="total, prev, pager, next, sizes, jumper"
                    :page-sizes="[10, 20, 25, 30, 50, 100, 200, 500]" :page-size="states.table.pageSize"
                    :current-page="states.table.pageNumber" :total="states.table.total"
                    @current-change="changePageNumber" @size-change="changePageSize">
                </el-pagination>
            </div>
        </div>
    </div>
    <!-- </el-card> -->
 
    <editDialog ref="editDialogRef" @success="success"></editDialog>
    <printDialog ref="printDialogRef"></printDialog>

</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { CaretBottom, CaretTop } from '@element-plus/icons-vue'
import { E_Msg } from '@/utils/message/index'
import editDialog from './edit-dialog.vue'
import printDialog from './print-dialog.vue'
import PlantLocationApi from '@/api/basic/plant-location-api'
// import {importExcel,changeStatus,exportListPage,listPage } from '@/api/basic/work-type-group-api'
// <el-icon><CaretBottom /></el-icon>
// <el-icon><CaretTop /></el-icon>
const emits = defineEmits(['initTree'])
const editDialogRef = ref()
const excelImportRef = ref()
const states = reactive({
    searchForm:{}as any,
    isExpand:false,
    // 勾选的值
    mainSelection: [],
    // 舍入类型
    operationTypeList: [],
    // 记录左侧点击的code码
    treeId: '',
    unitGroupOptions: [],
    //单位组数据
    unitGroupList: [],
    saveParam: undefined,
    data:[],
    table:{
        pageNumber: 1,
        pageSize:20,
        total:0,
        loading:false
    }
})
onMounted(() => {
    reast()
})
const initTable = ()=>{
    PlantLocationApi.listPage({
        pageNumber: states.table.pageNumber,
        pageSize: states.table.pageSize,
        ...states.searchForm,
        plantCode:states.searchForm.plantCode||states.treeId // id:states.treeId
    }).then(res=>{ 
        if(res.code == '0'){
            states.data = res.data.records
            states.table.total = Number(res.data.total||0)
        }
    })
}
const reast = ()=>{
    states.table.pageNumber =1
    states.table.pageSize = 20
    states.treeId = states.treeId||''
    states.searchForm = {} as any 
    states.mainSelection = []
    initTable()
}
const handleSearch = ()=>{
    states.table.pageNumber =1
    states.table.pageSize = 20
    states.treeId = states.treeId||''
    states.mainSelection = []
    initTable() 
}

// 单位组点击
const groupClick = id => {
    states.treeId = id
    states.mainSelection = []
    reast()
}
// 单位组变化
const groupChange = dataList => {
    states.unitGroupOptions = dataList
}
//处理勾选
const handleSelectionChange = (val: any) => {
    states.mainSelection = val
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
    editDialogRef.value.startAddData()
}
const handleEdit = ()=>{
    editDialogRef.value.startEditData(states.mainSelection[0],'edit')
}
const success = ()=>{
    reast()
    // 刷新左侧树
    emits('initTree')
}
const printDialogRef = ref()
const handlePrint = ()=>{
    printDialogRef.value.showOpenDialog(states.mainSelection[0])
}
const onImportLoad = (params = {}) => {
    // return importExcel(params)
}

// 删除数据
const deleteModel = () => {
    E_Msg.confirm( '删除确认','删除后的数据无法恢复，请谨慎操作！').then(() => {
            PlantLocationApi.deleteBatch({ idList: states.mainSelection.map(x => x.id) })
            .then(() => {
                reast()
                E_Msg.newMessage('操作成功')
            })
        })
}


const columnList = [
    {
        label: '厂房位置编码',
        prop: 'plantCode',
    },
    {
        label: '厂房位置名称',
        prop: 'plantName',  
    },
    {
        label: '上级位置',
        prop: 'parentName',
    },
    {
        label: '所属组织',
        prop: 'branchCompanyName',
    },
    {
        label: '备注',
        prop: 'remark',
    },
    {
        label: '创建人',
        prop: 'createName',
    },
    {
        label: '创建时间',
        prop: 'gmtCreate',
    },
    
]
defineExpose({ groupChange, groupClick })
</script>
<style scoped>

::v-deep.bt-table .header-left {
    margin: 0px;
}

.ever-main {
    height: 100%;
    width: 100%;
}
.card {
    display: flex;
    flex-direction: column;
}
</style>
