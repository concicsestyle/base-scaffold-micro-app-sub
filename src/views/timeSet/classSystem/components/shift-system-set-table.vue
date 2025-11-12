<template>
    <span class="title-item">
        <p class="tab-content"></p>
        <p class="tab-title"><span style="color: red">*</span>班次信息</p>
    </span>
    <div v-if="props.updateType != 'read'" class="mt-2 mb-2">
        <el-button type="primary" plain @click="addColumn">添&nbsp;加</el-button>
        <el-button type="danger" plain :disabled="states.multipleSelection.length == 0" @click="delteColumn">
            删&nbsp;除
        </el-button>
        <span v-if="states.warningTextShow" class="warning-text">
            <el-icon>
                <WarningFilled color="red"></WarningFilled>
            </el-icon>
            以下必填信息不能为空
        </span>
    </div>
    <el-form
        ref="formRef"
        :model="states"
        label-width="80px"
        :disabled="props.updateType == 'read'"
        label-position="top"
        
    >
        <el-table
            ref="tableRef"
            :data="states.tableData"
            border
            height="250"
            row-key="id"
            highlight-current-row
            @selection-change="handleSelectionChange"
            @row-click="rowClick"
            v-loading="states.loading"
        >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column type="index" label="序号" width="55"></el-table-column>
            <el-table-column prop="rotationCode" label="班次编码" min-width="180">
                <template #header> <span class="require-star">*&nbsp;&nbsp;</span>班次编码 </template>
                <template v-slot="{ row, $index }">
                    <el-form-item
                       
                        :prop="`tableData[${$index}].rotationCode`"
                        :rules="e_rule('required', '规则类型不能为空')"
                    >
                        <el-select v-model="row.rotationCode" @change="changeRotationCode($event, $index)" @visible-change="rotationShow">
                            <el-option
                                v-for="item of states.rotationCodeList"
                                :key="item.id"
                                :value="item.id"
                                :label="item.rotationCode"
                                :disabled="
                                    !Boolean(item.status) ||
                                    states.tableData.map(x => x.rotationCode).includes(item.rotationCode)
                                "
                            >
                                <span>{{ `${item.rotationCode}(${item.rotationName})` }}</span>
                            </el-option>
                        </el-select>
                    </el-form-item>
                  
                </template>
            </el-table-column>
            <el-table-column prop="rotationName" label="班次名称" min-width="180" show-overflow-tooltip></el-table-column>
            <el-table-column prop="workHour" label="工作时间(小时)" min-width="150" show-overflow-tooltip></el-table-column>
            <el-table-column prop="workTimeStart" label="工作开始时间" min-width="150" show-overflow-tooltip>
                <template v-slot="{ row }">
                    <span>{{ row.workTimeStart ? row.workTimeStart + row.workTimeStartUnit : '' }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="workTimeEnd" label="工作结束时间" min-width="150">
                <template v-slot="{ row }">
                    <span>{{ row.workTimeEnd ? row.workTimeEnd + row.workTimeEndUnit : '' }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="restStr" label="休息时段" min-width="180" show-overflow-tooltip>
                <template v-slot="{ row }">
                    <span v-html="row.restStr"></span>
                </template>
            </el-table-column>
            <el-table-column prop="extraRemovalTime" label="额外扣除时长(分钟)" width="150"></el-table-column>
        </el-table>
    </el-form>
</template>

<script setup lang="tsx">
import { reactive, ref, watch } from 'vue'
import { e_rule } from '@/utils/require-rule/index'
   import { E_Msg } from '@/utils/message/index'
import { WarningFilled } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import RotationDescApi from '@/api/basic/rotation-desc-api'
import ShiftSystemApi from '@/api/basic/shift-system-api'
const emits = defineEmits(['getHours'])
const props = defineProps({
    updateType: String,
})

const states = reactive({
    tableData: [],
    multipleSelection: [],
    nowId: undefined,
    warningTextShow: false,
    saveStartDate: undefined,
    saveEndDate: undefined,
    rotationCodeList: [], //班次编码列表
    loading:false
})

watch(
    () => states.tableData,
    () => {
        if (states.warningTextShow) {
            states.warningTextShow = !!states.tableData.find(x => !x.rotationCode)
        }
    },
    { deep: true },
)

watch(
    () => states.nowId,
    () => {
        checkDataSetEdit()
    },
)

const formRef = ref()
const tableRef = ref()
//班组编码下拉
const getRotationCodeList = () => {
    RotationDescApi.list({}).then(res => {
        if (res.code == 0) {
            res.data.forEach(item => {
                item.restStr = ''
                item?.restList?.forEach(e => {
                    item.restStr += `${e.restTimeStart + e.restTimeStartUnit}~${e.restTimeEnd}${e.restTimeEndUnit}<br>`
                })
            })
            states.rotationCodeList = res.data
        }
    })
}
const rotationShow = val=>{
    if(val){
        getRotationCodeList()
    }
}
//获取工作时长
const getWorkHour = () => {
    let hours = 0
    states.tableData.forEach(e => {
        hours += Number(e.workHour)
    })
    // 保留两位小数
    hours = Number(hours.toFixed(2))
    return hours
}
getRotationCodeList()
//change班次编码
const changeRotationCode = (e, index) => {
    let params = JSON.parse(JSON.stringify(states.rotationCodeList.find(t => t.id == e)))
    params.basicRotationDescId = params.id
    params.id = states.tableData[index].id
    params.edit = states.tableData[index].edit
    params.isAdd = states.tableData[index].isAdd
    states.tableData[index] = params
    let hours = getWorkHour()
    emits('getHours', hours)
}
const addColumn = () => {
    // 没勾选添加在最后面
    if (!states.multipleSelection.length) {
        states.tableData.push({
            id: dayjs().valueOf(),
            rotationCode: undefined, // 编码
            rotationName: undefined,
            workHour: undefined,
            workTimeStart: undefined,
            workTimeEnd: undefined,
            extraRemovalTime: undefined,
            address: undefined,
            RestList: [],
            isAdd: 1,
            edit: true,
        })
    } else {
        // 计算下勾选的最大的index
        const indexList = []
        states.multipleSelection.map(x => {
            indexList.push(
                states.tableData.findIndex(y => {
                    return x.id == y.id
                }),
            )
        })
        const index = indexList.sort((x, y) => y - x)[0]
        states.tableData.splice(index + 1, 0, {
            id: dayjs().valueOf(),
            rotationCode: undefined, // 编码
            rotationName: undefined,
            workHour: undefined,
            workTimeStart: undefined,
            workTimeEnd: undefined,
            extraRemovalTime: undefined,
            address: undefined,
            RestList: [],
            isAdd: 1,
            edit: true,
        })
    }
}
const delteColumn = () => {
    if (!states.multipleSelection.length) {
        E_Msg.warn('未选择要删除的数据')
        return
    }
    const deleteList = states.multipleSelection.map(x => x.id)
    states.tableData = states.tableData.filter(x => !deleteList.includes(x.id))
    let hours = getWorkHour()
    emits('getHours', hours)
}

const startEdit = data => {
    states.loading = true
    ShiftSystemApi.get({ id: data.id }).then(res => {
        if (res.code == 0) {
            res.data.rotationList.forEach(item => {
                item.restStr = ''
                item?.restList?.forEach(e => {
                    item.restStr += `${e.restTimeStart + e.restTimeStartUnit}~${e.restTimeEnd}${e.restTimeEndUnit}<br>`
                })
            })
            states.tableData = res.data.rotationList
            setTableId()
        }
    }).finally(()=>{
        states.loading = false 
    })
}

const rowClick = row => {
    if (row.id == states.nowId) {
        states.nowId = undefined
        tableRef.value.setCurrentRow()
    } else {
        states.nowId = row.id
        tableRef.value.setCurrentRow(row)
        if (props.updateType != 'read') {
            row.edit = true
        }
    }
}
// 设置表格id
const setTableId = () => {
    let unix = dayjs().valueOf()
    states.tableData.map(x => {
        if (!x.id) {
            x.id = unix
            unix++
        }
    })
}
// 已经填了必填项的并且不是当前选择的数据关闭选中状态
const checkDataSetEdit = () => {
    states.tableData.map(x => {
        if (x.rotationCode && states.nowId != x.id) {
            x.edit = false
        }
    })
}

const handleSelectionChange = val => {
    states.multipleSelection = val
}
// 返回表格数据
// 其实也可以在下面的formValidate方法里在method直接传进去，但是感觉怪怪的，还是这样返回到外面吧
const getFormData = () => {
    return states.tableData
}
// 把外面的校验和保存方法传进来  一起进行校验和保存
const formValidate = (outValid, method) => {
    return formRef.value.validate(valid => {
        if (!valid) {
            states.warningTextShow = true
        } else if (outValid) {
            // if (hasOverlap(states.tableData)) {
            //     E_Msg.warn('班次信息时间不能交叉，请确认！')
            //     return
            // } else
            if ([...new Set(states.tableData.map(x => x.rotationCode))].length != states.tableData.length) {
                E_Msg.warn('班次编码不能重复')
                return
            } else {
                method()
            }
        }
    })
}
// const hasOverlap = timeRanges => {
//     for (let i = 0; i < timeRanges.length; i++) {
//         const range1 = timeRanges[i]
//         for (let j = 0; j < timeRanges.length; j++) {
//             if (i === j) continue
//             const range2 = timeRanges[j]
//             //1.开始时间和结束时间都是当日或次日，2.开始时间都为当日，结束时间1当日1次日 3.开始时间都为当日，结束时间都为次日
//             if (
//                 range1.workTimeStartUnit == range2.workTimeStartUnit &&
//                 range1.workTimeEndUnit == range2.workTimeEndUnit
//             ) {
//                 if (range1.workTimeStart < range2.workTimeEnd && range1.workTimeEnd > range2.workTimeStart) {
//                     return true
//                 }
//             } else if (
//                 range1.workTimeStartUnit == range2.workTimeStartUnit &&
//                 range1.workTimeEndUnit != range2.workTimeEndUnit
//             ) {
//                 if (range2.workTimeStart < range1.workTimeStart && range1.workTimeStart < range2.workTimeEnd) {
//                     return true
//                 }
//             }
//         }
//     }
//     return false
// }
const clearTable = () => {
    states.tableData = []
}

defineExpose({ startEdit, formRef, getFormData, formValidate, clearTable })
</script>
<style lang="scss" scoped>
.title-item {
    font-weight: 800;
    font-size: 14px;

    p {
        display: inline-block;
    }
}

.el-icon {
    width: 2em;
}

.number-width {
    width: 100px;
}

.unit-width {
    width: 60px;
}

.require-star {
    color: red;
}

:deep(.el-form-item) {
    margin-bottom: 0;
}

.warning-text {
    display: inline-block;
    margin-left: 12px;
    color: red;
}

.warning-text :deep(.el-icon) {
    width: 1em;
    font-size: 18px;
    position: relative;
    top: 4px;
    left: 3px;
}
</style>
