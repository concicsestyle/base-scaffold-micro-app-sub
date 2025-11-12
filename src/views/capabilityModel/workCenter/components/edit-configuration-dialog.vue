<template>
    <el-dialog v-model="states.dialogVisible" :title="states.title" :close-on-click-modal="false" draggable width="60%"
        :before-close="handleClose">
        <div> 
            <el-button type="primary" @click="handleAddrow">
                添加行
            </el-button>
            <el-button :disabled="states.selectStatus" type="danger" plain @click="handleDelrow">
                删除行
            </el-button>
        </div>
        <el-table ref="masterTableRef" width="500" @selection-change="handleMainSelectionChange"
            :data="states.tableList" highlight-current-row border height="300px" size="small">
            <el-table-column type="selection" width="55" :align="'center'" />
            <el-table-column type="index" label="序号" width="60" align="center" />
            <el-table-column prop="abilityType" label="能力" min-width="140">
                <template #default="{ row }">
                    <el-input v-model="row.abilityType" placeholder="请输入" />
                </template>
            </el-table-column>
            <el-table-column prop="numerical" label="数值" min-width="80" align="center">
                <template #default="{ row }">
                    <el-input-number v-model="row.numerical" :min="0" :precision="0" controls-position="right"
                        style="width: 70px" />
                </template>
            </el-table-column>
            <el-table-column prop="unit" label="单位" min-width="140">
                <template #default="{ row }">
                    <el-select v-model="row.unit" placeholder="请选择" class="full-width">
                        <el-option v-for="item in basic_capacity_unit" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </template>
            </el-table-column>
        </el-table>
        <template v-if="states.updateType != 'read'" #footer>
            <el-button @click="handleClose">取&nbsp;消</el-button>
            <el-button type="primary" :loading="states.saveLoading" @click="saveData">保&nbsp;存</el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { e_rule } from '@/utils/require-rule/index'
import { E_Msg } from '@/utils/message/index'
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { basic_capacity_unit} = toRefs<any>(proxy?.useDict('basic_capacity_unit'));
import { reactive, ref, nextTick, watch, onMounted } from 'vue'
const emits = defineEmits(['success'])
// const props = defineProps({
//     groupOptions: Array,
// })

const states = reactive({
    dialogVisible: false,
    title: '',
    tableList:[],//数据源
    ourcing:'',//是否外协
    updateType: '', // 区分新增、修改
    saveLoading: false,
    parentId:null,
    data:{
        id: null,
        abilityType: null,
        numerical:null,
        unit:null,
        pid: null
    },//行对象
    selectList:[],
    selectStatus:true
})
const formRef = ref()
onMounted(() => {
})

const handleAddrow=()=>{
    let data=JSON.parse(JSON.stringify(states.data));
    data.id=getSafeRandomId()
    states.tableList.push(data)
}

const handleDelrow=()=>{
    let list=JSON.parse(JSON.stringify(states.tableList))
    let result = list.filter(one=>!states.selectList.find(s=>one.id===s.id))
    states.tableList=result
}

// 生成安全的随机整数（在Integer范围内）
function getSafeRandomId() {
  const MIN = 100000
  const MAX = 2147483647
  return Math.floor(Math.random() * (MAX - MIN + 1)) + MIN
}

const handleMainSelectionChange=(row)=>{
    states.selectList=row
    if(Array.isArray(row)&&row.length>0){
        states.selectStatus=false
    }else{
        states.selectStatus=true
    }
}

// 新增数据
const startAddData = (parentData) => {
    console.log(parentData.dispatchUnitResourceConfigDTOS);
    states.title = '能力配置'
    states.updateType = 'add'
    states.dialogVisible = true
    states.parentId=parentData.id
    states.tableList=parentData.dispatchUnitResourceConfigDTOS
}

// 修改数据
const startEditData = (editData,type) => {
    states.title = '能力配置'
    states.updateType = type
    states.dialogVisible = true
    nextTick(() => {
        states.parentId=editData.id
        states.tableList=editData.dispatchUnitResourceConfigDTOS
    })
}
// 保存方法
const saveData = () => {
    handleClose()
}



const handleClose = () => {
    states.dialogVisible = false
    emits("success",states.tableList,states.parentId)
    states.tableList=[]
}

defineExpose({ startAddData, startEditData })
</script>
<style scoped lang="scss">
</style>
