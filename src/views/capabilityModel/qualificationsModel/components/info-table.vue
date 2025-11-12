<template>
     <!-- <el-card class="bt-view__card--layout-full card" :body-style="{ flex: '1' }"> -->
        <!-- <template #header>资质信息</template> -->
        <div class="ever-main">
        <div class="public-search-area">
            <div :class="['search-box',states.isExpand?'public-search-area-expand':'public-search-area-fixed']">
                <el-form ref="searchForm" :model="states.searchForm" label-width="80px">
                    <el-row :gutter="20">
                        <el-col :span="6">
                            <el-form-item label="资质编码" prop="qualificationsCode">
                                <el-input v-model="states.searchForm.qualificationsCode" clearable
                                    placeholder="请输入"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="资质名称" prop="qualificationsName">
                                <el-input v-model="states.searchForm.qualificationsName" clearable
                                    placeholder="请输入"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" />
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
                                <el-button type="primary" @click="search">查&nbsp;询</el-button>
                                <el-button @click="reast">重&nbsp;置</el-button>
                            </div>
                        </el-col>
                        <!-- <template v-if="states.isExpand">
                            <el-col :span="5">
                                <el-form-item label="工种编码" prop="workTypeCode">
                                    <el-input v-model="states.searchForm.workTypeCode" clearable
                                        placeholder="请输入"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="5">
                                <el-form-item label="工种名称" prop="workTypeName">
                                    <el-input v-model="states.searchForm.workTypeName" clearable
                                        placeholder="请输入"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="5">
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
                <el-button type="primary" v-hasPermi="['qualification:info:add']" @click="handleAdd">新&nbsp;增</el-button>
                <el-button type="success" v-hasPermi="['qualification:info:edit']" plain :disabled="states.mainSelection.length !==1"
                    @click="handleEdit">修&nbsp;改</el-button>
                <el-dropdown class="ml10" v-hasPermi="['qualification:info:status']" >
                    <el-button type="primary" plain :disabled="!states.mainSelection.length" @click="handleChangeStatus(1)">
                        启&nbsp;用<el-icon class="el-icon--right">
                            <CaretBottom></CaretBottom>
                        </el-icon>
                    </el-button>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item :disabled="!states.mainSelection.length" @click="handleChangeStatus(0)">
                                停&nbsp;用
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
                <el-button class="ml10" type="primary" plain @click="startImport" v-hasPermi="['qualification:info:import']">
                    导&nbsp;入</el-button>
                <el-dropdown v-drop-show class="ml10" v-hasPermi="['qualification:info:down']">
                    <el-button type="primary" plain>
                        导&nbsp;出
                        <el-icon class="el-icon--right">
                            <CaretBottom></CaretBottom>
                        </el-icon>
                    </el-button>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item @click="excelExport(1)" :disabled="states.mainSelection.length == 0">
                                勾选导出
                            </el-dropdown-item>
                            <el-dropdown-item @click="excelExport(2)">全部导出</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
                <el-button class="ml10" type="danger" v-hasPermi="['qualification:info:del']" plain :disabled="!states.mainSelection.length" @click="deleteModel">
                    删&nbsp;除</el-button>
            </div>
            <div class="public-table-box">
                   <el-table :data="states.tableData" style="width: 100% " height="100%" border  @selection-change="handleSelectionChange" v-loading="states.loading">
                    <el-table-column type="selection" width="55" fixed></el-table-column>
                    <el-table-column type="index" label="序号" width="70" fixed></el-table-column>
                        <el-table-column v-for="item in columnList" :key="item.prop" :prop="item.prop" :label="item.label" :width="item.width" :fixed="item.fixed" show-overflow-tooltip>
                            <template #default="scope">
                                <span v-if="item.prop === 'workTypeCode'" class="blue-pointer">{{ scope.row[item.prop]||'-' }} </span>
                                <span v-if="item.prop ==='qualificationsLevel'">
                                    <dict-tag :options="qualifications_level" :value="scope.row.qualificationsLevel" />
                                </span>
                                <span v-else-if="item.prop ==='useStatus'">
                                    <dict-tag :options="use_status" :value="scope.row.useStatus" />
                                </span>
                                <span v-else>{{ scope.row[item.prop]||'-' }}</span>
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
  
    <editDialog ref="editDialogRef" @success="reast"></editDialog>
    <excelImport ref="excelImportRef"  :fileParams="['qualifications.xlsx', '资质建模导入模板.xlsx']" :requestApi="onImportLoad"
        @success="success"></excelImport>
</template>

<script setup lang="ts">
import { ref, reactive,onMounted } from 'vue'
import { CaretBottom, CaretTop } from '@element-plus/icons-vue'
import editDialog from './edit-dialog.vue'
import  qualificationsDescApi from '@/api/basic/qualifications-desc-api'
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { qualifications_level,use_status } = toRefs<any>(proxy?.useDict('qualifications_level','use_status'));
import {E_Msg, exportFile} from '@/utils/utils'
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
    // 记录左侧点击的id
    parentId: '',
    unitGroupOptions: [],
    //单位组数据
    unitGroupList: [],
    saveParam: undefined,
    tableData:[],
    table:{
        pageNumber: 1,
        pageSize:20,
        total:0,
    },
    loading:false
})
onMounted(() => {
    reast()
})
const initTable = ()=>{
    if(!states.loading){
        states.loading = true
        qualificationsDescApi.listPage({
        pageNumber: states.table.pageNumber,
        pageSize: states.table.pageSize,
        ...states.searchForm,
        qualificationsGroupId:states.parentId
    }).then(res=>{ 
        if(res.code == 0){
            states.tableData = res.data.records
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
    states.tableData = []
    states.parentId = states.parentId||''
    states.searchForm = {} as any 
    states.mainSelection = []
    states.loading = false
    initTable()
}
const search = () => {
    states.table.pageNumber =1
    states.table.pageSize = 20
    states.parentId = states.parentId||''
    states.mainSelection = []
    states.loading = false
    initTable()
}

// 单位组点击
const groupClick = id => {
    states.parentId = id
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
const onImportLoad = (formData ) => {
    return qualificationsDescApi.importExcel(formData)
}
//修改状态
const handleChangeStatus = value => {
    if (!value && states.mainSelection.find(x => x.isBase)) {
        E_Msg.newMessage('基准单位不允许停用','warning');
        return
    }
    if (states.mainSelection.find(x => x.useStatus == value)) {
        E_Msg.newMessage(`只能选择${value ? '停用' : '启用'}的数据`,'warning');
        return
    }
        E_Msg.confirm('提示', `确认要${value == 1 ? '启用' : '停用'}所选的数据吗？`).then(() => {
            const params = {
            idlist: states.mainSelection.map(x => x.id),
            useStatus: value,
        }
        qualificationsDescApi.changeStatus(params).then(() => {
            E_Msg.newMessage('操作成功');
                reast()
            })
        })
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
    qualificationsDescApi.exportListPage({
        pageNumber: 1,
        pageSize: 9999,
        ids:ids,
        qualificationsGroupId:states.parentId
    }).then(async (resp: any) => {
        exportFile(resp,'工种资质导出文件.xlsx')
    })
}
// 删除数据
const deleteModel = () => {
    E_Msg.confirm('确认要删除这条信息吗', `删除后的数据无法恢复，请谨慎操作！`).then(() => {
            qualificationsDescApi.deleteBatch({ idList: states.mainSelection.map(x => x.id) })
            .then(() => {
                E_Msg.newMessage('操作成功');
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
        label: '资质编码',
        prop: 'qualificationsCode', 
        width:'140px',
        fixed:'left'
    },
    {
        label: '资质名称',
        prop: 'qualificationsName', 
        width:'140px',
        fixed:'left'
    },
    {
        label: '资质水平',
        prop: 'qualificationsLevel',
        width: '100px',
    },
    // {
    //     label: '密级',
    //     prop: 'securityLevel',
    //     width: '100px',
    // },
    {
        label: '资质组',
        prop: 'qualificationsGroupName',
        width: '100px',
    },
    {
        label: '使用状态',
        prop: 'useStatus',
        width: '100px',
    },
    // {
    //     label: '密级',
    //     prop: 'securityLevel',
    //     width: '100px',
    // },

    // {
    //     label: '使用组织',
    //     prop: 'useBranchCompanyName',
    //     width: '140px',
    // },
    {
        label: '分配组织',
        prop: 'distributedNum',
        width: '140px',
    },
    // {
    //     label: '创建组织',
    //     prop: 'branchCompanyName',
    //     width: '140px',
    // },
    {
        label: '创建人',
        prop: 'creatorName',
        width: '120px',
    },
    {
        label: '创建时间',
        prop: 'gmtCreate',
        width: '180px',
    },
    {
        label: '备注',
        prop: 'remark',
    },
]
defineExpose({ groupChange, groupClick })
</script>
<style scoped>
.ever-main {
    height: 100%;
    width: 100%;
}
.card {
    display: flex;
    flex-direction: column;
}
</style>
