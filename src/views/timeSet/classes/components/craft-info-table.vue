<!--
 * @Description:
 * @Author: 张春蕾
 * @Date: 2023-01-11 14:03:29
 * @LastEditors: 王瑶
 * @LastEditTime: 2025-06-27 10:10:54
-->
<template>
    <span class="title-item">
        <p class="tab-content"></p>
        <p class="tab-title"><span style="color: red">*</span>资质信息</p>
    </span>
    <div v-if="props.updateType != 'read'" class="mt-2 mb-2">
        <el-button type="primary" :disabled="states.multipleSelection.length > 1" @click="addColumn">
            添&nbsp;加</el-button
        >
        <el-button type="danger" :disabled="!states.multipleSelection.length" @click="delteColumn">
            删&nbsp;除</el-button
        >
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
            :data="states.tableData"
            ref="tableRef"
            border
            @selection-change="handleSelectionChange"
            @row-click="rowClick"
        >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column type="index" label="序号" width="70"></el-table-column>
            <el-table-column prop="date" label="资质水平" width="180">
                <template #header> <span class="require-star">*&nbsp;&nbsp;</span>资质水平 </template>
                <template v-slot="{ row, $index }">
                    <el-tooltip
                        :disabled="row.isCheckd != 1 || props.updateType != 'edit'"
                        content="已经被业务使用,不能修改,请确认!"
                        placement="bottom"
                        effect="light"
                    >
                        <el-form-item
                            v-if="row.edit"
                            :prop="`tableData[${$index}].qualificationsLevel`"
                            :rules="e_rule('required', '资质水平不能为空')"
                        >
                            <el-select
                                :disabled="row.isCheckd == 1"
                                v-model="row.qualificationsLevel"
                                @click="changeClickId(row)"
                            >
                                <!-- 停用的、已经选择了的禁用 -->
                                <el-option
                                    v-for="item of states.qualificationsLevelList"
                                    :key="item.id"
                                    :value="item.name"
                                    :label="item.name"
                                    :disabled="
                                        item.status == 0 ||
                                            states.tableData.map(x => x.qualificationsLevel).includes(item.value)
                                    "
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <span v-else>{{ row.qualificationsLevel }}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="有效周期" >
                <template v-slot="{ row }">
                    <div v-if="row.edit" style="display: flex;">
                        <el-input-number
                            v-model="row.activeCycleValue"
                            :min="1"
                            :max="Math.pow(10, 10)"
                            v-bt-noe
                            :step="1"
                            :precision="0"
                            controls-position="right"
                            placeholder="请输入"
                            class="number-width"
                            @click.stop="changeClickId(row)"
                        ></el-input-number>
                        <el-select v-model="row.activeCycleUnit" class="unit-width ml-2">
                            <el-option value="0" label="年"></el-option>
                            <el-option value="1" label="月"></el-option>
                            <el-option value="2" label="日"></el-option>
                        </el-select>
                    </div>
                    <div v-else>
                        {{ row.activeCycleValue }}
                        <span v-if="row.activeCycleValue">
                            {{ ['年', '月', '日'][row.activeCycleUnit] }}
                        </span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="address" label="复检周期" >
                <template v-slot="{ row }">
                    <div v-if="row.edit" style="display: flex;">
                        <el-input-number
                            v-model="row.recheckCycleValue"
                            :min="1"
                            :max="Math.pow(10, 10)"
                            v-bt-noe
                            :step="1"
                            :precision="0"
                            controls-position="right"
                            placeholder="请输入"
                            class="number-width"
                            @click.stop="changeClickId(row)"
                        ></el-input-number>
                        <el-select v-model="row.recheckCycleUnit" class="unit-width ml-2">
                            <el-option value="0" label="年"></el-option>
                            <el-option value="1" label="月"></el-option>
                            <el-option value="2" label="日"></el-option>
                        </el-select>
                    </div>

                    <div v-else>
                        {{ row.recheckCycleValue }}
                        <span v-if="row.recheckCycleValue">
                            {{ ['年', '月', '日'][row.recheckCycleUnit] }}
                        </span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="address" label="许可范围" width="120">
                <template v-slot="{ row }">
                    <el-input
                        v-if="row.edit"
                        maxlength="60"
                        :show-word-limit="false"
                        v-model.trim="row.licenseScope"
                        clearable
                        placeholder="请输入"
                        @click.stop="changeClickId(row)"
                    ></el-input>
                    <span v-else>{{ row.licenseScope }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="address" label="使用状态" width="150">
                <template #header> <span class="require-star">*&nbsp;&nbsp;</span>使用状态 </template>
                <template v-slot="{ row, $index }">
                    <el-form-item
                        v-if="row.edit"
                        :prop="`tableData[${$index}].useStatus`"
                        :rules="e_rule('required', '使用状态不能为空')"
                    >
                        <el-select v-model="row.useStatus" filterable clearable @click.stop="changeClickId(row)">
                            <el-option
                                v-for="item of states.qualificationsStatusList"
                                :key="item.id"
                                :value="item.value"
                                :label="item.name"
                            ></el-option>
                        </el-select>
                    </el-form-item>

                    <span v-else>{{
                        row.useStatus ? states.qualificationsStatusList.find(x => x.value == row.useStatus).name : ''
                    }}</span>
                </template>
            </el-table-column>
        </el-table>
    </el-form>
</template>

<script setup lang="tsx">
import { e_rule } from '@/utils/require-rule/index'
import { reactive, ref, watch, onMounted } from 'vue'
// import { QualificationsDescApi } from '@/base/consts/api/basic'
import { WarningFilled } from '@element-plus/icons-vue'
// import { WorkTypeQuaDescApi } from '@/base/consts/api/basic'
import dayjs from 'dayjs'
import { E_Msg } from '@/utils/message/index'
const props = defineProps({
    updateType: String,
    dialogVisible: Boolean,
})

const states = reactive({
    tableData: [
       
    ],
    multipleSelection: [],
    qualificationsLevelList:[], // 资质水平选项
    qualificationsStatusList: [], // 使用状态选项
    nowId: undefined,
    warningTextShow: false,
    //校验资质水平子表是否被业务使用
    isCheckList: [],
})
watch(
    () => states.tableData,
    () => {
        if (states.warningTextShow) {
            states.warningTextShow = !!states.tableData.find(x => !x.qualificationLevelId || !x.qualificationId)
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
const tableRef = ref()
const formRef = ref()
onMounted(() => {
    if (props.updateType == 'add') {
        // getPersonnelQualifications().then(() => {
        //     states.qualificationStrList = states.qualificationStrList.filter(x => x.useStatus)
        // })
    }
})
// 获取资质建模树--人员资质选项
// const getPersonnelQualifications = () => {
//     return QualificationsDescApi.listPage({ pageNumber: 1, pageSize: 9999, qualificationsGroupId: -1 }).then(res => {
//         states.qualificationStrList = res.data.records //人员资质
//     })
// }
const addColumn = () => {
    if (states.multipleSelection.length) {
        states.tableData.splice(states.multipleSelection[0].rowIndex + 1, 0, {
            id: dayjs().valueOf(),
            rowIndex: states.multipleSelection[0].rowIndex + 1,
            qualificationLevelId: undefined,
            qualificationId: undefined,
            edit: true,
        })
    } else {
        states.tableData.splice(states.tableData.length, 0, {
            id: dayjs().valueOf(),
            rowIndex: states.tableData.length,
            qualificationLevelId: undefined,
            qualificationId: undefined,
            edit: true,
        })
    }
}
// 人员资质修改
const qualificationsIdChange = row => {
    row.qualificationLevelId = undefined
    if (row.qualificationId) {
        if (row.rowIndex == undefined) {
            row.isAdd = 0
        } else {
            row.isAdd = 1
        }
        row.qualificationsDetailIdList = states.qualificationStrList.find(
            x => x.id == row.qualificationId,
        ).qualificationsDetailList
    } else {
        row.qualificationsDetailIdList = []
    }
}
const delteColumn = () => {
    if (!states.multipleSelection.length) {
        E_Msg.warn('未选择要删除的数据')
        return
    }
    let tags = ''
    states.multipleSelection.forEach((el, index) => {
        if (el.isCheckd == 1) {
            tags += `${Number(index + 1)},`
        }
    })
    if (tags) {
        E_Msg.warn('提示', `第${tags.substring(0, tags.lastIndexOf(','))}行已经被业务使用，不能删除，请确认！`)
        return
    }
    const deleteList = states.multipleSelection.map(x => x.id)
    states.tableData = states.tableData.filter(x => !deleteList.includes(x.id))
}
const startEdit = data => {
    // WorkTypeQuaDescApi.getById({ workTypeDescId: data.id }).then(res => {
    //     getPersonnelQualifications().then(() => {
    //         states.qualificationStrList = states.qualificationStrList.filter(x => {
    //             return x.useStatus || res.data.find(y => y.qualificationId == x.id)
    //         })
    //         for (const i in res.data) {
    //             res.data[i].qualificationsDetailIdList = states.qualificationStrList.find(
    //                 x => x.id == res.data[i].qualificationId,
    //             ).qualificationsDetailList
    //         }
    //         states.tableData = res.data
    //         setTableId()
    //     })
    // })
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
// 保存当前选择的id
const changeClickId = row => {
    states.detailList = []
    states.nowId = row.id
    tableRef.value.setCurrentRow(row)
    if (row.qualificationId) {
        states.checkData = states.tableData.filter(v => v.qualificationId == row.qualificationId)
        states.detailList = states.qualificationStrList.find(x => x.id == row.qualificationId).qualificationsDetailList
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
        if (x.qualificationLevelId && x.qualificationId && states.nowId != x.id) {
            x.edit = false
        }
    })
}
const handleSelectionChange = val => {
    states.multipleSelection = val
}

// 返回表格数据
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

defineExpose({ startEdit, formRef, getFormData, formValidate })
</script>
<style scoped lang="scss">

.el-icon {
    width: 2em;
}

.tableSelect {
    margin-bottom: 0px !important;
}

.require-star {
    color: red;
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
