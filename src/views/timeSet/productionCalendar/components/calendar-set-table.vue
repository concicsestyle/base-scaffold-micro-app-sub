<template>
    <span class="title-item">
        <p class="tab-content"></p>
        <p class="tab-title">工作日设置</p>
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
        class="mr-4"
    >
        <el-table
            ref="tableRef"
            :data="states.tableData"
            border
            row-key="id"
            highlight-current-row
            height="330px"
            @selection-change="handleSelectionChange"
            @row-click="rowClick"
        >
            <el-table-column type="selection" width="55" :selectable="selectEnable"></el-table-column>
            <el-table-column type="index" label="序号" width="55"></el-table-column>
            <el-table-column prop="date" label="规则类型" width="150">
                <template #header> <span class="require-star">*&nbsp;&nbsp;</span>规则类型 </template>
                <template v-slot="{ row, $index }">
                    <el-form-item
                        v-if=" row.ruleType != 'week'"
                        :prop="`tableData[${$index}].ruleType`"
                        :rules="e_rule('required', '规则类型不能为空')"
                    >
                        <el-select v-model="row.ruleType">
                            <el-option
                                v-for="item of date_rule_type"
                                :key="item.value"
                                :value="item.value"
                                :label="item.label"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <span v-else>{{
                        row.ruleType == 'week' ? '周' : date_rule_type.find(x => x.value == row.ruleType)?.label
                    }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="DateType" label="日期类型" width="180">
                <template #header> <span class="require-star">*&nbsp;&nbsp;</span>日期类型 </template>
                <template v-slot="{ row, $index }">
                    <el-form-item
                       
                        :prop="`tableData[${$index}].dateType`"
                        :rules="e_rule('required', '日期类型不能为空')"
                    >
                        <el-select v-model="row.dateType">
                            <el-option
                                v-for="item of date_type"
                                :key="item.value"
                                :value="item.value"
                                :label="item.label"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- <span v-else>{{ date_type.find(x => x.value == row.dateType)?.label }}</span> -->
                </template>
            </el-table-column>
            <el-table-column prop="weekName" label="周" width="150"></el-table-column>
            <el-table-column prop="date" label="日期" width="200">
                <template v-slot="{ row, $index }">
                    <el-form-item
                        v-if=" row.ruleType == 'ItemRuleTypeDate'"
                        :prop="`tableData[${$index}].date`"
                        :rules="e_rule('required', '日列不能为空')"
                    >
                        <el-date-picker
                            v-model="row.date"
                            type="date"
                            placeholder="年/月/日"
                            value-format="YYYY-MM-DD"
                        ></el-date-picker>
                    </el-form-item>
                    <div v-else>
                        {{ row.date }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="month" label="月" min-width="120">
                <template v-slot="{ row, $index }">
                    <el-form-item
                        v-if="row.ruleType != 'week' && row.ruleType == 'ItemRuleTypeYear'"
                        :prop="`tableData[${$index}].month`"
                        :rules="e_rule('required', '日列不能为空')"
                    >
                        <el-select filterable v-model="row.month">
                            <el-option v-for="item of 12" :key="item" :value="item" :label="item"></el-option>
                        </el-select>
                    </el-form-item>
                    <div v-else>
                        {{ row.month }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="day" label="日" min-width="120">
                <template v-slot="{ row, $index }">
                    <el-form-item
                        v-if="
                           
                                row.ruleType != 'week' &&
                                (row.ruleType == 'ItemRuleTypeMonth' || row.ruleType == 'ItemRuleTypeYear')
                        "
                        :prop="`tableData[${$index}].day`"
                        :rules="e_rule('required', '日列不能为空')"
                    >
                        <el-select filterable v-model="row.day">
                            <el-option v-for="item of 31" :key="item" :value="item" :label="item"></el-option>
                        </el-select>
                    </el-form-item>
                    <div v-else>
                        {{ row.day }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="basicShiftSystemId" label="班制" width="170">
                <template v-slot="{ row, $index }">
                    <el-form-item :prop="`tableData[${$index}].basicShiftSystemId`">
                        <el-select filterable v-model="row.basicShiftSystemId">
                            <el-option
                                v-for="item of states.basicShiftSystemList"
                                :key="item.id"
                                :value="item.id"
                                :label="item.shiftSystemName"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- <div v-else>
                        {{ states.basicShiftSystemList.find(t => t.id == row.basicShiftSystemId)?.shiftSystemName }}
                    </div> -->
                </template>
            </el-table-column>
        </el-table>
    </el-form>
</template>

<script setup lang="tsx">
import { reactive, ref, watch } from 'vue'
import { e_rule } from '@/utils/require-rule/index'
   import { E_Msg } from '@/utils/message/index'
import { WarningFilled } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
// import { BtUseAppStore } from 'beeboat-ui/es/core/store'
import CalendarSettingApi from '@/api/basic/basic-calendar-setting-api'
import ShiftSystemApi from '@/api/basic/shift-system-api'
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { date_type,date_rule_type } = toRefs<any>(proxy?.useDict('date_type','date_rule_type'));
// const appStore = BtUseAppStore()
const props = defineProps({
    updateType: String,
})

const states = reactive({
    tableData: [
        {
            id: dayjs().valueOf(),
            ruleType: 'week',
            dateType: 'ItemDateWeek',
            weekday: '7',
            weekName: '周日',
            basicShiftSystemId: undefined,
            edit: true,
        },
        {
            id: dayjs().valueOf(),
            ruleType: 'week',
            dateType: 'ItemDateWork',
            weekday: '1',
            weekName: '周一',
            basicShiftSystemId: undefined,
            edit: true,
        },
        {
            id: dayjs().valueOf(),
            ruleType: 'week',
            dateType: 'ItemDateWork',
            weekday: '2',
            weekName: '周二',
            basicShiftSystemId: undefined,
            edit: true,
        },
        {
            id: dayjs().valueOf(),
            ruleType: 'week',
            dateType: 'ItemDateWork',
            weekday: '3',
            weekName: '周三',
            basicShiftSystemId: undefined,
            edit: true,
        },
        {
            id: dayjs().valueOf(),
            ruleType: 'week',
            dateType: 'ItemDateWork',
            weekday: '4',
            weekName: '周四',
            basicShiftSystemId: undefined,
            edit: true,
        },
        {
            id: dayjs().valueOf(),
            ruleType: 'week',
            dateType: 'ItemDateWork',
            weekday: '5',
            weekName: '周五',
            basicShiftSystemId: undefined,
            edit: true,
        },
        {
            id: dayjs().valueOf(),
            ruleType: 'week',
            dateType: 'ItemDateWeek',
            weekday: '6',
            weekName: '周六',
            basicShiftSystemId: undefined,
            edit: true,
        },
    ],
    nowId: undefined,
    multipleSelection: [],
    warningTextShow: false,
    //规则类型下拉 appStore.getDictByParentCode('InnerDictRuleType')
    ruleTypeList: [],
    //日期类型下拉 appStore.getDictByParentCode('InnerDictDateType')
    dateTypeList: [],
    //班制下拉
    basicShiftSystemList: [],
})

watch(
    () => states.tableData,
    () => {
        if (states.warningTextShow) {
            states.warningTextShow = !!states.tableData.find(
                x =>
                    !x.ruleType ||
                    !x.dateType ||
                    (x.dateType == 'ItemRuleTypeDate' && !x.date) ||
                    (x.dateType == 'ItemRuleTypeMonth' && !x.day) ||
                    (x.dateType == 'ItemRuleTypeYear' && (!x.day || !x.month)),
            )
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
//设置禁用 如果是周的即禁用
const selectEnable = row => {
    // if (row.ruleType == 'week') {
    //     return false
    // } else {
    //     return true
    // }
    return row.ruleType != 'week'
}
//班制下拉
const getBasicShiftSystemList = () => {
    ShiftSystemApi.getList()
        .then(res => {
            states.basicShiftSystemList = res.data.filter(e => e.status == 1)
        })
}
getBasicShiftSystemList()
const addColumn = () => {
    if (!states.multipleSelection.length) {
        states.tableData.push({
            id: dayjs().valueOf(),
            ruleType: undefined, //规则类型
            day: undefined, //日
            month: undefined, //月
            date: undefined, //日期
            weekday: undefined, //week
            dateType: undefined, //日期类型
            basicShiftSystemId: undefined, //班制主表id
            edit: true,
            isAdd: 1, // 标识新增还是修改
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
            ruleType: undefined, //规则类型
            day: undefined, //日
            month: undefined, //月
            date: undefined, //日期
            weekday: undefined, //week
            dateType: undefined, //日期类型
            basicShiftSystemId: undefined, //班制主表id
            edit: true,
            isAdd: 1, // 标识新增还是修改
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
}
//修改时赋值数据
const setEditData = row => {
    CalendarSettingApi.getList({ basicCalendarId: row.id })
        .then(res => {
            if (res.code == 0) {
                states.tableData = res.data
            }
        })
}
const startEdit = data => {
    states.tableData = data.detailList.map(x => {
        x.isAdd = 0 // 标识新增还是修改
        return x
    })
    setTableId()
}

const rowClick = (row, column, event) => {
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
        //如果规则类型是week的校验规则类型与日期类型， 如果规则为固定日期校验规则类型与日期类型+日期，为月 多校验 日，为年 多校验年日
        switch (x.ruleType) {
            case 'week': {
                console.log('走的是这里吧',states.nowId,x.id)
                if (x.ruleType && x.dateType && states.nowId != x.id) {
                    x.edit = false
                }
                break
            }
            case 'ItemRuleTypeDate': {
                if (x.ruleType && x.dateType && x.date && states.nowId != x.id) {
                    x.edit = false
                }
                break
            }

            case 'ItemRuleTypeYear': {
                if (x.ruleType && x.dateType && x.day && x.month && states.nowId != x.id) {
                    x.edit = false
                }
                break
            }
            case 'ItemRuleTypeMonth': {
                if (x.ruleType && x.dateType && x.day && states.nowId != x.id) {
                    x.edit = false
                }
                break
            }
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
            method()
        }
    })
}

const clearTable = () => {
    states.tableData = [
        {
            id: dayjs().valueOf(),
            ruleType: 'week',
            dateType: 'ItemDateWeek',
            weekday: '7',
            weekName: '周日',
            basicShiftSystemId: undefined,
            edit: true,
        },
        {
            id: dayjs().valueOf(),
            ruleType: 'week',
            dateType: 'ItemDateWork',
            weekday: '1',
            weekName: '周一',
            basicShiftSystemId: undefined,
            edit: true,
        },
        {
            id: dayjs().valueOf(),
            ruleType: 'week',
            dateType: 'ItemDateWork',
            weekday: '2',
            weekName: '周二',
            basicShiftSystemId: undefined,
            edit: true,
        },
        {
            id: dayjs().valueOf(),
            ruleType: 'week',
            dateType: 'ItemDateWork',
            weekday: '3',
            weekName: '周三',
            basicShiftSystemId: undefined,
            edit: true,
        },
        {
            id: dayjs().valueOf(),
            ruleType: 'week',
            dateType: 'ItemDateWork',
            weekday: '4',
            weekName: '周四',
            basicShiftSystemId: undefined,
            edit: true,
        },
        {
            id: dayjs().valueOf(),
            ruleType: 'week',
            dateType: 'ItemDateWork',
            weekday: '5',
            weekName: '周五',
            basicShiftSystemId: undefined,
            edit: true,
        },
        {
            id: dayjs().valueOf(),
            ruleType: 'week',
            dateType: 'ItemDateWeek',
            weekday: '6',
            weekName: '周六',
            basicShiftSystemId: undefined,
            edit: true,
        },
    ]
}

defineExpose({ startEdit, getFormData, formValidate, clearTable, setEditData })
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

::v-deep.el-table--fit {
    height: 44%;
}
</style>
