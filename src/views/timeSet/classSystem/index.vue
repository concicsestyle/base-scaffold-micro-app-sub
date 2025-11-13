<!--
 * @Description: 
 * @Autor: 王瑶
 * @Date: 2025-06-03 20:18:23
 * @LastEditors: 王瑶
 * @LastEditTime: 2025-09-11 18:16:34
-->
<template>
    <el-row style="height: 100%;">
        <el-col :lg="24" :xs="24">
            <div class="bt-page">
                    <div class="ever-main">
                        <div class="public-search-area">
                            <div
                                :class="['search-box',states.isExpand?'public-search-area-expand':'public-search-area-fixed']">
                                <el-form ref="searchForm" :model="states.searchForm" label-width="80px">
                                    <el-row :gutter="20">
                                        <el-col :span="5">
                                            <el-form-item label="班制编码" prop="shiftSystemCode">
                                                <el-input v-model="states.searchForm.shiftSystemCode" clearable
                                                    placeholder="请输入"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="5">
                                            <el-form-item label="班制名称" prop="shiftSystemName">
                                                <el-input v-model="states.searchForm.shiftSystemName" clearable
                                                    placeholder="请输入"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="5" />
                                        <el-col :span="5" />
                                        <el-col :span="4">
                                            <div class="flex-row expand-box flex-j-end">
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
                                <el-button type="primary" @click="handleAdd" v-hasPermi="['class:sys:add']">新&nbsp;增</el-button>

                                <el-button type="success" plain :disabled="states.mainSelection.length !==1" v-hasPermi="['class:sys:edit']"
                                    @click="handleEdit">修&nbsp;改</el-button>
                                <el-dropdown class="ml10" v-hasPermi="['class:sys:status']">
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
                                <el-button class="ml10" type="primary" plain @click="startImport" v-hasPermi="['class:sys:import']">
                                    导&nbsp;入</el-button>
                                <el-dropdown v-drop-show class="ml10" v-hasPermi="['class:sys:down']">
                                    <el-button type="primary" plain>
                                        导&nbsp;出
                                        <el-icon class="el-icon--right">
                                            <CaretBottom></CaretBottom>
                                        </el-icon>
                                    </el-button>
                                    <template #dropdown>
                                        <el-dropdown-menu>
                                            <el-dropdown-item @click="excelExport(1)"
                                                :disabled="states.mainSelection.length == 0">
                                                勾选导出
                                            </el-dropdown-item>
                                            <el-dropdown-item @click="excelExport(2)">全部导出</el-dropdown-item>
                                        </el-dropdown-menu>
                                    </template>
                                </el-dropdown>
                                <el-button class="ml10" type="danger" plain :disabled="!states.mainSelection.length" v-hasPermi="['class:sys:del']"
                                    @click="deleteModel">
                                    删&nbsp;除</el-button>
                            </div>
                            <div class="public-table-box">
                                <el-table :data="states.data" style="width: 100% " height="100%" border @selection-change="handleSelectionChange" v-loading="states.loading">
                                    <el-table-column type="selection" width="55" fixed></el-table-column>
                                    <el-table-column type="index" label="序号" width="70" fixed></el-table-column>
                                    <el-table-column v-for="item in columnList" :key="item.prop" :prop="item.prop"
                                        :label="item.label" :width="item.width" :fixed="item.fixed"
                                        show-overflow-tooltip>
                                        <template #default="scope">
                                <span v-if="item.prop ==='status'">
                                    <dict-tag :options="use_status" :value="scope.row.status" />
                                </span>
                                <span v-else-if="item.prop ==='shiftSystemCode'" class="blue-pointer" @click="handleRead(scope.row)">
                                   {{ scope.row.shiftSystemCode }}
                                </span>
                                <span v-else-if="item.prop ==='rotationStatus'">
                                    <dict-tag :options="use_status" :value="scope.row.rotationStatus" />
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
                </div>
            </el-col>
        </el-row>
    <editDialog ref="editDialogRef" @success="reast"></editDialog>
    <excelImport ref="excelImportRef" :fileParams="['shiftSystem.xlsx', '班制导入模板.xlsx']" :requestApi="onImportLoad"
        @success="reast"></excelImport>
</template>
<script lang="ts" setup>
import { ref, reactive,onMounted } from 'vue'
import editDialog from './components/edit-dialog.vue'
import ShiftSystemApi from '@/api/basic/shift-system-api'
import {E_Msg, exportFile} from '@/utils/utils'
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { use_status } = toRefs<any>(proxy?.useDict('use_status'));
const editDialogRef  = ref()
const excelImportRef = ref()
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
    },
    loading:false
})
onMounted(()=>{ 
    reast()
})
const reast = ()=>{
    states.table.pageNumber =1
    states.table.pageSize = 20
    states.searchForm = {} as any 
    states.mainSelection = []
    states.loading= false
    initTable()
}
const handleSearch =()=>{
    states.table.pageNumber =1
    states.table.pageSize = 20
    states.mainSelection = []
    states.loading= false
    initTable()
}
const initTable = ()=>{ 
    if(!states.loading){
        states.loading = true
        ShiftSystemApi.listPage({
        pageNumber: states.table.pageNumber,
        pageSize: states.table.pageSize,
        ...states.searchForm,
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
const changePageNumber = val=>{
    states.table.pageNumber = val
    initTable()
}
const changePageSize = val=>{
    states.table.pageSize = val
    initTable()
}
//处理勾选
const handleSelectionChange = (val: any) => {
    states.mainSelection = val
}
const handleAdd = ()=>{
    editDialogRef.value.startAddData()
}
const handleEdit = ()=>{
    editDialogRef.value.startEditData(states.mainSelection[0], 'edit')
}
const handleRead = (row)=>{
    editDialogRef.value.startEditData(row, 'read')
}
const handleChangeStatus = value=>{
    if (states.mainSelection.find(x => x.status == value)) {
        E_Msg.newMessage(`只能选择${value ? '停用' : '启用'}的数据`,'warning');
        return
    }
        E_Msg.confirm('提示', `确认要${value == 1 ? '启用' : '停用'}所选的数据吗？`).then(() => {
            const params = {
            idList: states.mainSelection.map(x => x.id),
            status: value,
        }
        ShiftSystemApi.changeStatus(params).then(() => {
            E_Msg.newMessage('操作成功','success');
                reast()
            })
        })
}
const startImport = ()=>{
    excelImportRef.value.startImport()
}
const onImportLoad =(formData) => {
    return ShiftSystemApi.importExcel(formData)
}
const excelExport = val=>{
    let ids = []
    // 勾选导出
    if (val == 1) {
        states.mainSelection.forEach(ele => {
            ids.push(ele.id)
        })
    } 
    ShiftSystemApi.exportListPage({
        pageNumber: 1,
        pageSize: 9999,
        ids:ids
    }).then(async (resp: any) => {
        exportFile(resp,'班制导出文件.xlsx')
    }).catch((r: any) => {
      console.error(r);
    //   E_Msg.newMessage('下载文件出现错误，请联系管理员！', 'error' )
    });
}
const deleteModel = ()=>{
        E_Msg.confirm('确认要删除这条信息吗', `删除后的数据无法恢复，请谨慎操作！`).then(() => {
            ShiftSystemApi.deleteBatch({ idList: states.mainSelection.map(x => x.id) })
                .then(() => {
                    E_Msg.newMessage('操作成功','success');
                    reast()
                })
        })
}
const columnList = [
    {
        label: '班制编码',
        prop: 'shiftSystemCode',
        width: '',
        fixed: 'left',
    },
    {
        label: '班制名称',
        prop: 'shiftSystemName',  
        width: '',
        fixed: 'left',
    },
    {
        label: '工作时长(小时)',
        prop: 'workHour',
        width: '130',
    },
    {
        label: '班制使用状态',
        prop: 'status',
        width: '120',
    },
    {
        label: '备注',
        prop: 'remark',
    },
    // {
    //     label: '班次编号',
    //     prop: 'rotationCode',
    //     width: '140',
    // },
    // {
    //     label: '班次名称',
    //     prop: 'rotationName',
    //     width: '160',
    // },

    {
        label: '工作时间(小时)',
        prop: 'rotationWorkHour',
        width: '130px',
    },
    {
        label: '班次使用状态',
        prop: 'rotationStatus',
        width: '130px',
    },
    {
        label: '创建组织',
        prop: 'branchCompanyName',
    },
    {
        label: '创建人',
        prop: 'creatorName',
    },
    {
        label: '创建时间',
        prop: 'gmtCreate',
        width: '160px',
    },

]
</script>

<style lang="scss" scoped>
.bt-page {
    box-sizing: border-box;
    // padding: 24px;
    // height: calc(100vh - 84px);
    width: 100%;

    // background: pink;
    ::v-deep .el-row {
        height: 100%;
    }
}
</style>