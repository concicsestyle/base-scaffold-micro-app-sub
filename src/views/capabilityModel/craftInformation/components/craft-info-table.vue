<!--
 * @Description:
 * @Author: 张春蕾
 * @Date: 2023-01-11 14:03:29
 * @LastEditors: 王瑶
 * @LastEditTime: 2025-09-09 17:34:26
-->
<template>
    <span class="title-item">
        <p class="tab-content"></p>
        <p class="tab-title">资质信息</p>
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
            v-loading="states.loading"
        >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column type="index" label="序号" width="70"></el-table-column>
            <el-table-column prop="qualificationId" label="人员资质" min-width="180">
                <template #header> <span class="require-star">*&nbsp;&nbsp;</span>人员资质 </template>
                <template #default="{ row, $index }">
                    <el-form-item
                       
                        class="tableSelect"
                        :prop="`tableData[${$index}].qualificationId`"
                        :rules="e_rule('required', '人员资质不能为空')"
                    >
                        <el-select
                            v-model.trim="row.qualificationId"
                            placeholder="请选择"
                            @click="changeClickId(row)"
                            @change="qualificationsIdChange(row)"
                        >
                            <el-option
                                v-for="item in states.qualificationStrList"
                                :key="item.id"
                                :value="item.id"
                                :label="item.qualificationsName"
                                :disabled="!item.useStatus"
                            >
                                <span v-if="item.useStatus">{{ item.qualificationsName }}</span>
                                <span v-else>{{ item.qualificationsName }}(停用)</span>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <!-- <span v-else>{{
                        states.qualificationStrList.find(x => x.id == row.qualificationId)?.qualificationsName
                    }}</span> -->
                </template>
            </el-table-column>

            <el-table-column prop="qualificationLevelId" label="资质水平" min-width="180">
                <template #header> <span class="require-star">*&nbsp;&nbsp;</span>资质水平 </template>
                <template #default="{ row, $index }">
                    <el-tooltip
                        :disabled="row.isCheckd != 1"
                        content="已经被业务使用,不能修改,请确认!"
                        placement="bottom"
                        effect="light"
                    >
                        <el-form-item
                            class="tableSelect"
                            :prop="`tableData[${$index}].qualificationLevelId`"
                            
                        >
                        <!-- :rules="e_rule('required', '资质水平不能为空')" -->
                            <el-select
                                :disabled="row.isCheckd == 1"
                                v-model.trim="row.qualificationLevelId"
                                placeholder="请选择"
                                @click="changeClickId(row)"
                            >
                                <el-option
                                    v-for="item of row.qualificationsDetailIdList"
                                     :key="item.id"
                                    :value="item.id"
                                    :label="item.qualificationsLevel"
                                    :disabled="
                                        !Boolean(item.useStatus) ||
                                        (states.checkData &&
                                            states.checkData.map(x => x.qualificationLevelId).includes(item.id))
                                    "
                                >
                                    <span v-if="item.useStatus">{{ item.qualificationsLevel }}</span>
                                    <span v-else>{{ item.qualificationsLevel }}(停用)</span>
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <!-- <span v-else>{{
                            row.qualificationsDetailIdList.find(x => x.id == row.qualificationLevelId)
                                ?.qualificationsLevel
                        }}</span> -->
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
    </el-form>
</template>

<script setup lang="tsx">
import { e_rule } from '@/utils/require-rule/index'
import { reactive, ref, watch, onMounted } from 'vue'
import QualificationsDescApi from '@/api/basic/qualifications-desc-api'
import { WarningFilled } from '@element-plus/icons-vue'
import WorkTypeQuaDescApi from '@/api/basic/base-work-type-qua-desc-api'
// import { WorkTypeQuaDescApi } from '@/base/consts/api/basic'
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { qualifications_level } = toRefs<any>(proxy?.useDict('qualifications_level'));
import dayjs from 'dayjs'
import { E_Msg } from '@/utils/message/index'
const props = defineProps({
    updateType: String,
    dialogVisible: Boolean,
})

const states = reactive({
    tableData: [], // 表格数据
    multipleSelection: [], // 所选数据
    qualificationStrList: [], // 人员资质选项
    detailList: [], // 选择人员资质的资质水平
    qualificationsLevelList: [], // 资质水平选项
    nowId: undefined,
    warningTextShow: false,
    checkData: [],
    loading:false,
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
// watch(
//     () => states.nowId,
//     () => {
//         checkDataSetEdit()
//     },
// )
const tableRef = ref()
const formRef = ref()
onMounted(() => {
    if (props.updateType == 'add') {
        getPersonnelQualifications().then(() => {
            console.log('qualificationStrList',qualifications_level.value)
            let list=states.qualificationStrList.filter(x => x.useStatus);
            list.forEach(one=>{
                one.qualificationsDetailList.forEach(child=>{
                let value='';
                qualifications_level.value.forEach(element => {
                    if(element.value==child.qualificationsLevel){
                            value=element.label
                    }
                })
                child.qualificationsLevel=value
                })
            })
            states.qualificationStrList = list
        })
    }
})
// 获取资质建模树--人员资质选项
const getPersonnelQualifications = () => {
    return QualificationsDescApi.listPage({ pageNumber: 1, pageSize: 9999, qualificationsGroupId: -1 }).then(res => {
        states.qualificationStrList = res.data.records //人员资质
    })
}
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
        E_Msg.newMessage('未选择要删除的数据','warning');
        return
    }
    let tags = ''
    states.multipleSelection.forEach((el, index) => {
        if (el.isCheckd == 1) {
            tags += `${Number(index + 1)},`
        }
    })
    if (tags) {
        E_Msg.newMessage(`第${tags.substring(0, tags.lastIndexOf(','))}行已经被业务使用，不能删除，请确认！`,'warning');
        return
    }
    const deleteList = states.multipleSelection.map(x => x.id)
    states.tableData = states.tableData.filter(x => !deleteList.includes(x.id))
}
const startEdit = data => {
    states.loading = true
    WorkTypeQuaDescApi.getById({ workTypeDescId: data.id }).then(res => {
        getPersonnelQualifications().then(() => {
            // 人员资质
            states.qualificationStrList = states.qualificationStrList.filter(x => {
                return x.useStatus || res.data.find(y => y.qualificationId == x.id)
            })
            for (const i in res.data) {
                res.data[i].qualificationsDetailIdList = states.qualificationStrList.find(
                    x => x.id == res.data[i].qualificationId,
                ).qualificationsDetailList
            
                res.data[i].qualificationsDetailIdList.forEach(child=>{
                let value='';
                qualifications_level.value.forEach(element => {
                    if(element.value==child.qualificationsLevel){
                            value=element.label
                    }
                })
                child.qualificationsLevel=value
                })
            }
            states.tableData = res.data
            setTableId()
        }).finally(()=>{
            states.loading = false
        })
    }).catch(()=>{
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
    console.log(111111)
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
