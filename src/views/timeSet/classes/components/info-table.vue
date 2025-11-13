<template>
    <!-- <el-card class="bt-view__card--layout-full card" :body-style="{ flex: '1' }"> -->
        <!-- <template #header>班次信息</template> -->
        <div class="ever-main">
            <div class="public-search-area">
                <div :class="['search-box',states.isExpand?'public-search-area-expand':'public-search-area-fixed']">
                    <el-form ref="searchForm" :model="states.searchForm" label-width="80px">
                        <el-row :gutter="10">
                            <el-col :span="6">
                                <el-form-item label="班次编码" prop="rotationCode">
                                    <el-input v-model="states.searchForm.rotationCode" clearable
                                        placeholder="请输入"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="班次名称" prop="rotationName">
                                    <el-input v-model="states.searchForm.rotationName" clearable
                                        placeholder="请输入"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7">

                            </el-col>
                            <el-col :span="5">
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

                        </el-row>
                    </el-form>
                </div>
            </div>
            <div class="public-content-area public-table-thin public-page-thin">
                <div class="mb10">
                    <el-button type="primary" @click="handleAdd" v-hasPermi="['classes:info:add']">新&nbsp;增</el-button>

                    <el-button type="success" plain :disabled="states.mainSelection.length !==1" v-hasPermi="['classes:info:edit']"
                        @click="handleEdit">修&nbsp;改</el-button>
                    <el-dropdown class="ml10" v-hasPermi="['classes:info:status']">
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
                    <el-button class="ml10" type="primary" plain @click="startImport" v-hasPermi="['classes:info:import']">
                        导&nbsp;入</el-button>
                    <el-dropdown v-drop-show class="ml10" v-hasPermi="['classes:info:down']">
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
                    <el-button class="ml10" type="danger" plain :disabled="!states.mainSelection.length" v-hasPermi="['classes:info:del']"
                        @click="deleteModel">
                        删&nbsp;除</el-button>
                </div>
                <div class="public-table-box">
                    <el-table :data="states.data" style="width: 100% " height="100%" border @selection-change="handleSelectionChange" v-loading="states.loading">
                        <el-table-column type="selection" width="55" fixed></el-table-column>
                        <el-table-column type="index" label="序号" width="70" fixed></el-table-column>
                        <el-table-column v-for="item in columnList" :key="item.prop" :prop="item.prop"
                            :label="item.label" :width="item.width" :fixed="item.fixed" show-overflow-tooltip>
                            <template #default="scope">
                                <span v-if="item.prop ==='status'">
                                    <dict-tag :options="use_status" :value="scope.row.status" />
                                </span>
                                <span v-if="item.prop ==='rotationCode'" class="blue-pointer" @click="handleRead(scope.row)">
                                   {{ scope.row.rotationCode }}
                                </span>
                                <!-- <el-tag v-else-if="item.prop ==='operate'">操&nbsp;作</el-tag> -->
                                <!-- <span v-else-if="item.prop ==='operate'" class="blue-pointer" > 操&nbsp;作</span> -->
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
    <!-- <operationHistory ref="operationRef"></operationHistory> -->
    <excelImport ref="excelImportRef" :fileParams="['shiftPage.xlsx', '班次导入模板.xlsx']" :requestApi="onImportLoad"
        @success="reast"></excelImport>
</template>

<script setup lang="ts">
import { ref, reactive ,onMounted} from 'vue'
import { CaretBottom, CaretTop } from '@element-plus/icons-vue'
import editDialog from './edit-dialog-new.vue'
import RotationDescApi from '@/api/basic/rotation-desc-api'
import ReferencePageApi from '@/api/system/reference-page-api'
import {E_Msg, exportFile} from '@/utils/utils'
// import  operationHistory from '@/components/NewComponents/operation'
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { use_status } = toRefs<any>(proxy?.useDict('use_status'));
const emits = defineEmits(['initTree'])
const editDialogRef = ref()
const excelImportRef = ref()
const operationRef = ref()
const states = reactive({
    searchForm:{}as any,
    isExpand:false,
    // 勾选的值
    mainSelection: [],
    // 舍入类型
    operationTypeList: [],
    // 记录左侧点击的id
    treeNodeId: '',
    unitGroupOptions: [],
    //单位组数据
    unitGroupList: [],
    saveParam: undefined,
    data:[],
    table:{
        pageNumber: 1,
        pageSize:20,
        total:0,
    },
    loading:false
})
onMounted(() => {
    states.loading = false
    reast()
})
const initTable = ()=>{
    if(!states.loading){
        states.loading = true
        RotationDescApi.listPage({
        pageNumber: states.table.pageNumber,
        pageSize: states.table.pageSize,
        ...states.searchForm,
        treeNodeId:states.treeNodeId
    }).then(res=>{ 
        if(res.code == '0'){
            states.data = res.data.records
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
    states.treeNodeId = states.treeNodeId||''
    states.searchForm = {} as any 
    states.mainSelection = []
    states.loading= false
    initTable()
}

const handleSearch = ()=>{
    states.table.pageNumber =1
    states.table.pageSize = 20
    states.treeNodeId = states.treeNodeId||''
    states.mainSelection = []
    states.loading= false
    initTable()
}
// 单位组点击
const groupClick = id => {
    states.treeNodeId = id
    states.mainSelection = []
    reast()
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
    editDialogRef.value.startAddData( states.treeNodeId)
}
const handleEdit = ()=>{
    editDialogRef.value.startEditData(states.mainSelection[0], 'edit')
}
const handleRead = (row)=>{
    editDialogRef.value.startEditData(row, 'read')
}
const onImportLoad = (formData) => {
    return RotationDescApi.importExcel(formData)
}
//修改状态
const handleChangeStatus = value => {
    if (states.mainSelection.find(x => x.status == value)) {
        E_Msg.newMessage( `只能选择${value ? '停用' : '启用'}的数据`,'warning')
        return
    }
    E_Msg.confirm('提示',`确认要${value == 1 ? '启用' : '停用'}所选的数据吗？`).then(() => {
            const params = {
            idList: states.mainSelection.map(x => x.id),
            status: value,
        }
        RotationDescApi.changeStatus(params).then(() => {
                E_Msg.newMessage('操作成功','success');
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
    RotationDescApi.exportListPage({
        pageNumber: 1,
        pageSize: 9999,
        ids:ids
    }).then(async (resp: any) => {
        exportFile(resp,'班次导出文件.xlsx')
    }).catch((r: any) => {
      console.error(r);
    //   E_Msg.newMessage('下载文件出现错误，请联系管理员！', 'error' )
    });
}
// 删除数据
const deleteModel = () => {
        E_Msg.confirm('确认要删除这条信息吗', `删除后的数据无法恢复，请谨慎操作！`).then(() => {
            RotationDescApi.deleteBatch({ idList: states.mainSelection.map(x => x.id) })
                        .then(() => {
                            E_Msg.newMessage('操作成功','success');
                            reast()
                        })
                    })
}


// 开始导入
const startImport = () => {
    excelImportRef.value.startImport()
}

const columnList = [
    {
        label: '班次编码',
        prop: 'rotationCode',
        width: '',
        fixed: 'left',
    },
    {
        label: '班次名称',
        prop: 'rotationName',  
        width: '',
        fixed: 'left',
    },
    {
        label: '班次类别',
        prop: 'basicRotationTypeName',
        width: '',
    },
    {
        label: '使用状态',
                prop: 'status',
        width: '100px',
    },
    {
        label: '工作时间(小时)',
                prop: 'workHour',
        width: '140',
    },
    {
        label: '额外扣除时长(分钟）',
                prop: 'extraRemovalTime',
        width: '160',
    },

    {
        label: '创建人',
                prop: 'creatorName',
        width: '',
    },

    // {
    //     label: '创建组织',
    //             prop: 'branchCompanyName',
    //     width: '',
    // },
    {
        label: '创建时间',
                prop: 'gmtCreate',
        width: '',
    },

    {
        label: '备注',
                prop: 'remark',
        width: '',
    },
    // {
    //     label: '操作',
    //             prop: 'operate',
    //     width: '100px',
    // },

]
defineExpose({  groupClick })
</script>
<style scoped>
.el-card__body {
    height: calc(100% - 40px) !important;
}

.ever-main {
    height: 100%;
    width: 100%;
}

::v-deep.bt-table .header-left {
    margin: 0px;
}

.expand-box {
    display: flex;
    margin-left: 24px;
}

.flex-row {
    display: flex;
}


.pagination-box {
    display: flex;
    justify-content: flex-end;
    margin-top: 14px;
}

.public-table-box {
    flex: 1;

}

.point {
    cursor: pointer;
}

.card {
    display: flex;
    flex-direction: column;
}
</style>
