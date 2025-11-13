<template>
    <el-dialog v-model="states.dialogVisible" :title="states.title" :close-on-click-modal="false" draggable width="60%"
        :before-close="handleClose">
        <el-form ref="formRef" :model="states.formData" label-width="80px" label-position="top"
            class="ml-4 standard-form" :disabled="states.updateType == 'read'">
            <el-row :gutter="32">
                <!-- <el-col :span="6">
                    <el-form-item label="创建组织" prop="branchCompanyName" :rules="e_rule('required', '创建组织不能为空')">
                        <el-input v-model.trim="states.formData.branchCompanyName" disabled clearable
                            placeholder=""></el-input>
                    </el-form-item>
                </el-col> -->
                <el-col :span="6">
                    <!-- <el-form-item v-if="states.typeCodeStatus" label="班次编码" prop="rotationCode">
                        <el-input v-model.trim="states.formData.rotationCode" disabled clearable
                            placeholder="根据编码规则自动生成"></el-input>
                    </el-form-item>
                    <el-form-item v-else label="班次编码" prop="rotationCode" :rules="e_rule('required', '班次编码不能为空')">
                        <el-input maxlength="60" :show-word-limit="false" v-model.trim="states.formData.rotationCode"
                            :disabled="states.updateType == 'edit'" clearable
                            :placeholder="states.updateType != 'read' ? '请输入' : ' '"></el-input>
                    </el-form-item> -->
                    <el-form-item  label="班次编码" prop="rotationCode">
                        <el-input v-model.trim="states.formData.rotationCode" disabled clearable
                            :placeholder="'根据编码规则自动生成'"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="班次类别" prop="basicRotationTypeId" :rules="e_rule('required', '班次类别不能为空')">
                        <el-select v-model="states.formData.basicRotationTypeId" clearable placeholder="请选择" filterable>
                            <el-option v-for="item in states.shiftTypeList" :key="item.id" :value="item.id"
                                :label="item.rotationTypeName">
                                <span>{{ item.rotationTypeCode + '(' + item.rotationTypeName + ')' }}</span>
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="班次名称" prop="rotationName" :rules="e_rule('required', '班次名称不能为空')">
                        <el-input v-model.trim="states.formData.rotationName" clearable placeholder="请输入"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="32">
                <el-col :span="6">
                    <el-form-item label="工作时段" prop="workStartTime" :rules="e_rule('required', '工作开始时间不能为空')">
                            <el-select v-model="states.formData.workStartTime" style="width: 100%"
                                placeholder="请选择" clearable @change="workStartTimeChange">
                                <el-option v-for="(item, index) in states.workStartTimeList" :key="item.completeTime"
                                    :label="`${item.time} ${getTimeUnit(item.completeTime)}`" :value="item.completeTime"
                                    :disabled="index == states.workStartTimeList.length - 1">
                                    <span>{{ `${item.time} ${getTimeUnit(item.completeTime)}` }}</span>
                                </el-option>
                            </el-select>
                            <span style="position: absolute;right: -15px;"> ~ </span>
                    </el-form-item>
                </el-col>
                <el-col :span="6" class="work-endtime">
                    <el-form-item label="''" prop="workEndTime" :rules="e_rule('required', '工作结束时间不能为空')">
                        <el-select v-model="states.formData.workEndTime" style="width: 100%"
                            placeholder="请选择" clearable ref="workEndTimeRef" @change="workEndTimeChange">
                            <el-option v-for="(item, index) in states.workEndTimeList" :key="item.completeTime"
                                :label="`${item.time} ${getTimeUnit(item.completeTime)}`" :value="item.completeTime"
                                :disabled="index == 0">
                                <span>{{ `${item.time} ${getTimeUnit(item.completeTime)}` }}</span>
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="32">
                <el-col :span="24">
                    <el-form-item label="休息时段" prop="restList" style="width: 100%">
                        <div class="span_box"  v-for="(row, index) in states.formData.restList" :key="index">
                            <el-select v-model="row.startTime" filterable style="width: calc( 25% - 27px )"
                                :placeholder="states.updateType != 'read' ? '请选择' : ' '"
                                @change="restStartTimeChange(row, index)">
                                <el-option v-for="(item, index) in row.restStartTimelist" :key="item.completeTime"
                                    :label="`${item.time} ${getTimeUnit(item.completeTime)}`" :value="item.completeTime"
                                    :disabled="index == 0 || index == row.restStartTimelist.length - 1">
                                    <span>{{ `${item.time} ${getTimeUnit(item.completeTime)}` }}</span>
                                </el-option>
                            </el-select>
                            <span style="padding:0 5px 0 13px"> ~ </span>
                            <el-select v-model="row.endTime" filterable style="width: calc( 25% - 27px );margin-left: 12px;"
                                :placeholder="states.updateType != 'read' ? '请选择' : ' '"
                                @change="restEndTimeChange(row, index)">
                                <el-option v-for="(item, index) in row.restEndTimeList" :key="item.completeTime"
                                    :label="`${item.time} ${getTimeUnit(item.completeTime)}`" :value="item.completeTime"
                                    :disabled="index == 0 || index == row.restEndTimeList.length - 1">
                                    <span>{{ `${item.time} ${getTimeUnit(item.completeTime)}` }}</span>
                                </el-option>
                            </el-select>
                            <span class="icon_box" v-if="states.updateType != 'read'">
                                <span class="span-icon">
                                    <el-icon>
                                        <Plus :size="50" color="#5C84F2" v-if="
                                                            states.formData.workEndTime && states.formData.workEndTime
                                                        " @click="addRestTime(index)"></Plus>
                                    </el-icon>
                                </span>
                                <span class="span-icon">
                                    <el-icon v-if="index != 0">
                                        <Delete :size="50" color="#5C84F2" @click="deleteRestTime(index)"></Delete>
                                        <!-- <Minus :size="50" color="#5C84F2" @click="deleteRestTime(index)"></Minus> -->
                                    </el-icon>
                                    <el-icon v-if="
                                                        index == 0 &&
                                                        states.formData.workEndTime &&
                                                        states.formData.workEndTime
                                                    ">
                                        <Delete :size="50" color="#5C84F2" @click="resetRestTime"></Delete>
                                    </el-icon>
                                </span>
                            </span>
                            <br />
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="32">
                <el-col :span="6">
                    <el-form-item label="额外扣除时长(分钟)" prop="extraRemovalTime">
                        <el-input-number v-model="states.formData.extraRemovalTime" style="width: 100%" :step="1" :min="0" v-bt-noe
                            :max="1440" :controls="false" :precision="0" @blur="calculateWorkTime"></el-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="工作时间(小时)" prop="workHour">
                        <el-input-number v-model="states.formData.workHour" style="width: 100%" :min="0" :max="24" v-bt-noe
                            :controls="false" :precision="2" disabled></el-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="备注" prop="remark">
                        <el-input v-model.trim="states.formData.remark" clearable maxlength="255" type="textarea"
                            show-word-limit placeholder="请输入"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <template v-if="states.updateType != 'read'" #footer>
            <el-button @click="handleClose">取&nbsp;消</el-button>
            <el-button type="primary" :loading="states.saveLoading" @click="saveData">保&nbsp;存</el-button>
        </template>
    </el-dialog>

</template>

<script setup lang="ts">
   import { e_rule } from '@/utils/require-rule/index'
   import { E_Msg } from '@/utils/message/index'
   import { reactive, ref, nextTick, watch, onMounted } from 'vue'
   import {createTimeList} from '@/utils/times/index'
   import RotationTypeApi from '@/api/basic/rotation-type-api'
   import RotationRestApi from '@/api/basic/rotation-rest-api'
   import RotationDescApi from '@/api/basic/rotation-desc-api'
   import { getUserProfile } from '@/api/infra/admin/adminUser';
   import dayjs from 'dayjs'
   const emits = defineEmits(['success'])

   const states = reactive({
       dialogVisible: false,  //显示隐藏
       title: '',//弹窗标题
    //表单
    formData: {
        //班次类型id
        basicRotationTypeId: undefined,
        //创建组织id
        branchCompanyId:undefined,
        branchCompanyName: undefined,
        //班次编码
        rotationCode: undefined,
        //班次名称
        rotationName: undefined,
        //工作开始、结束时间
        workStartTime: undefined,
        workEndTime: undefined,
        //休息时段列表
        restList: [
            {
                id: undefined, // 修改时有则传，没有则不传
                isAdd: 1, // 1表示新增的
                startTime: undefined,
                endTime: undefined,
                restStartTimelist: [],
                restEndTimeList: [],
            },
        ] as any,
        //额外扣除时间，默认0
        extraRemovalTime: 0,
        //工作时间
        workHour: undefined,
        //备注
        remark: undefined,
        id: undefined,
    },
  
    //按钮load
    saveLoading: false,
    //操作类型
    updateType: 'add',
    //是否存在编码规则
    typeCodeStatus: false,
    //班次类别下拉
    shiftTypeList: [],
    //工作开始时间列表
    workStartTimeList: createTimeList(
        `${dayjs().format('YYYY-MM-DD')} 00:00`,
        `${dayjs().add(1, 'day').format('YYYY-MM-DD')} 00:00`,
    ),
    //工作结束时间
    workEndTimeList: [],
    //休息时段时间间隔，间隔是10分钟
    restTimeInterval: 10,
    branchCompanyList: [],
    //loading
    loading: false,
   })
   const formRef = ref()
   
   // 新增数据
   const startAddData = (typeCode) => {
       nextTick(()=>{
           states.title = '班次新增'
           states.dialogVisible = true
           states.updateType = 'add'
        //    获取班次类别
           getTree()
        //  获取用户信息
           getUser()
           states.formData.id = undefined
            states.formData.basicRotationTypeId = typeCode||""
            states.workStartTimeList = createTimeList(
            `${dayjs().format('YYYY-MM-DD')} 00:00`,
            `${dayjs().add(1, 'day').format('YYYY-MM-DD')} 00:00`,
        )
       })
   
      
   }
   // 修改数据
   const startEditData = ( data,type) => {
    nextTick(() => {
        states.title = type == 'edit' ? '班次修改' : '班次查看'
        states.dialogVisible = true
        // states.loading = true
        states.updateType = type
        states.formData.id = data.id
        // 创建组织
        states.formData.branchCompanyId = data.branchCompanyId
        states.formData.branchCompanyName = data.branchCompanyName
        getTree()
        //班次类别
        states.formData.basicRotationTypeId = data.basicRotationTypeId
        //班次编码
        states.formData.rotationCode = data.rotationCode
        //班次名称
        states.formData.rotationName = data.rotationName
        //额外扣除时间
        states.formData.extraRemovalTime = data.extraRemovalTime
        //工作时间
        states.formData.workHour = data.workHour
        //备注
        states.formData.remark = data.remark
        // 工作开始时间
        states.formData.workStartTime = `${dayjs().format('YYYY-MM-DD')} ${data.workTimeStart}`
        states.formData.workStartTime = dayjs(states.formData.workStartTime).format('YYYY-MM-DD HH:mm')
        //工作结束时间
        states.formData.workEndTime =
            data.workTimeEndUnit == '当日'
                ? `${dayjs().format('YYYY-MM-DD')} ${data.workTimeEnd}`
                : `${dayjs().add(1, 'day').format('YYYY-MM-DD')} ${data.workTimeEnd}`
        states.formData.workEndTime = dayjs(states.formData.workEndTime).format('YYYY-MM-DD HH:mm')
        // 工作开始时间列表,0点到工作结束时间
        states.workStartTimeList = createTimeList(`${dayjs().format('YYYY-MM-DD')} 00:00`, states.formData.workEndTime)

        //工作结束时间列表，工作开始时间 到工作开始时间加一天
        states.workEndTimeList = createTimeList(
            states.formData.workStartTime,
            dayjs(states.formData.workStartTime).add(1, 'day').format('YYYY-MM-DD HH:mm'),
        )

        //查询休息时段详情
        RotationRestApi.list({
            basicRotationDescId: data.id,
        }).then(res => {
            if (Array.isArray(res.data) && res.data.length > 0) {
                states.formData.restList = res.data.map(e => {
                    return {
                        startTime:
                            e.restTimeStartUnit == '当日'
                                ? dayjs(`${dayjs().format('YYYY-MM-DD')} ${e.restTimeStart}`).format('YYYY-MM-DD HH:mm')
                                : dayjs(`${dayjs().add(1, 'day').format('YYYY-MM-DD')} ${e.restTimeStart}`).format(
                                      'YYYY-MM-DD HH:mm',
                                  ),
                        endTime:
                            e.restTimeEndUnit == '当日'
                                ? dayjs(`${dayjs().format('YYYY-MM-DD')} ${e.restTimeEnd}`).format('YYYY-MM-DD HH:mm')
                                : dayjs(`${dayjs().add(1, 'day').format('YYYY-MM-DD')} ${e.restTimeEnd}`).format(
                                      'YYYY-MM-DD HH:mm',
                                  ),
                        orderNum: e.orderNum,
                        id: e.id,
                        isAdd: undefined,
                    }
                })
                states.formData.restList.forEach(e => {
                    // 休息开始时间下拉
                    e.restStartTimelist = createRestTimeOfEdit('start', e, states.formData.restList)
                    //休息结束时间下拉
                    e.restEndTimeList = createRestTimeOfEdit('end', e, states.formData.restList)
                })
            } else {
                //没填休息时段，则显示空框
                workEndTimeChange()
            }
            // states.loading = false
        })
    })
      
   }
   // 修改时生成休息时段下拉，用于修改时回显
const createRestTimeOfEdit = (type, obj, list) => {
    if (type == 'start') {
        // 开始时间列表，开始时间是工作开始时间或上一个时间段的结束时间，结束时间是当前时段的结束时间
        let startTime = obj.orderNum == 0 ? states.formData.workStartTime : list[obj.orderNum - 1].endTime
        return createTimeList(startTime, obj.endTime)
    } else {
        // 结束时间列表，开始时当前时段的开始时间，结束是下一个时段的开始时间或工作结束时间
        let endTime = obj.orderNum + 1 == list.length ? states.formData.workEndTime : list[obj.orderNum + 1].startTime
        return createTimeList(obj.startTime, endTime)
    }
}
   /**
 * 获取用户信息
 */
const getUser = async () => {
  const res = await getUserProfile();
  states.formData.branchCompanyName = res.data.user.deptName
  states.formData.branchCompanyId = res.data.user.deptId
};
   const getTree = () => {
    RotationTypeApi.listPage({
        pageNumber: 1,
        pageSize: 999,
    }).then(res => {
        states.shiftTypeList = res.data
    })
}
   //工作开始时间改变事件
const workStartTimeChange = time => {
    // 开始时间改变后，清空结束时间
    states.formData.workEndTime = undefined
    //获取结束时间列表
    states.workEndTimeList = createTimeList(time, dayjs(time).add(1, 'day').format('YYYY-MM-DD HH:mm'))
    //清空休息时间
    states.formData.restList = [
        {
            startTime: undefined,
            endTime: undefined,
            restStartTimelist: [],
            restEndTimeList: [],
            isAdd: 1,
            id: undefined,
        },
    ]
}
// 工作结束时间改变事件
const workEndTimeChange = () => {
    //清空休息时间
    states.formData.restList = [
        {
            startTime: undefined,
            endTime: undefined,
            restStartTimelist: [],
            restEndTimeList: [],
            isAdd: 1,
            id: undefined,
        },
    ]
    //重新生成第一条数据的休息时段
    states.formData.restList[0].restStartTimelist = createTimeList(
        states.formData.workStartTime,
        states.formData.workEndTime,
    )
    //计算工作时间
    calculateWorkTime()
}
// 休息时段开始时间改变事件
const restStartTimeChange = (row, index) => {
    // 修改时段开始时间改变，修改上一条时段的结束时间列表，生成当条休息时段的结束时间列表
    if (index - 1 >= 0) {
        //修改上一条时段的结束时间列表 ，结束时间列表的开始是上一条的开始时间，结束是当条休息时段的开始
        let last = states.formData.restList[index - 1]
        last.restEndTimeList = createTimeList(last.startTime, row.startTime)
    }
    //生成当条时段的结束时间列表，结束时间开始是该条的开始时间，结束时间是下一条的开始或工作结束时间
    let endTime =
        index + 1 == states.formData.restList.length
            ? states.formData.workEndTime
            : states.formData.restList[index + 1].startTime
    row.restEndTimeList = createTimeList(row.startTime, endTime)
}
// 计算工作时间
const calculateWorkTime = () => {
    let workTimeMinute = timeDifferenceOfMinute(states.formData.workStartTime, states.formData.workEndTime)
    states.formData.restList.forEach(e => {
        if (e.startTime && e.endTime) {
            workTimeMinute -= timeDifferenceOfMinute(e.startTime, e.endTime)
        }
    })
    // 减去额外扣除时间
    workTimeMinute -= states.formData.extraRemovalTime || 0

    states.formData.workHour = parseFloat((workTimeMinute / 60).toFixed(2))
}
//休息时段结束时间改变事件
const restEndTimeChange = (row, index) => {
    // 休息时段结束时间的改变，影响该条数据的开始时间列表
    // 开始时间是上一条的结束时间或工作开始时间
    let startTime = index == 0 ? states.formData.workStartTime : states.formData.restList[index - 1].endTime
    //结束时间是该条数据的结束时间
    row.restStartTimelist = createTimeList(startTime, row.endTime)
    //计算工作时间
    calculateWorkTime()
}
// 新增休息时段
const addRestTime = index => {
    if (
        states.formData.restList.length == 1 &&
        (!states.formData.restList[index].startTime || !states.formData.restList[index].endTime)
    ) {
        E_Msg.warn(`请先维护好第${index + 1}条休息时段再进行新增`)
    } else {
        //已经最少存在1条数据
        let startTimeStr = ''
        let endTimeStr = ''

        if (index == states.formData.restList.length - 1) {
            // 该条数据下没有数据，下一条数据开始时间是该条结束时间加上时间间隔，结束时间是工作结束时间
            startTimeStr = dayjs(states.formData.restList[index].endTime).format('YYYY-MM-DD HH:mm')
            endTimeStr = states.formData.workEndTime
        } else {
            //该条数据下有数据，下一条开始时间是该条结束时间，结束时间是下一条数据开始时间
            startTimeStr = dayjs(states.formData.restList[index].endTime).format('YYYY-MM-DD HH:mm')
            endTimeStr = dayjs(states.formData.restList[index + 1].startTime).format('YYYY-MM-DD HH:mm')
        }
        // 插入新的休息时段
        states.formData.restList.splice(index + 1, 0, {
            startTime: undefined,
            endTime: undefined,
            restStartTimelist: createTimeList(startTimeStr, endTimeStr),
            restEndTimeList: [],
            isAdd: 1,
            id: undefined,
        })
    }
}

//删除休息时段
const deleteRestTime = index => {
    // 删除休息时段，影响上一条的结束时间列表，下一条的开始时间列表

    // 上一条结束时间列表，结束时间开始是上一条的开始时间，结束时间是下一条数据的开始或工作结束时间
    let last = states.formData.restList[index - 1] // index 最小是1
    let endTime =
        index + 1 == states.formData.restList.length
            ? states.formData.workEndTime
            : states.formData.restList[index + 1].startTime
    last.restEndTimeList = createTimeList(last.startTime, endTime)

    // 下一条开始时间列表，开始时间是上一条结束时间，结束时间是下一条的结束时间
    if (index + 1 != states.formData.restList.length) {
        let next = states.formData.restList[index + 1]
        next.restStartTimelist = createTimeList(last.endTime, next.endTime)
    }

    states.formData.restList.splice(index, 1)
    //计算工作时间
    calculateWorkTime()
}
// 第一个休息时段重置事件
const resetRestTime = () => {
    E_Msg.confirm('提示', '确定要清空所有休息时段吗？').then(() => {
        states.formData.restList = [
            {
                startTime: undefined,
                endTime: undefined,
                restStartTimelist: [],
                restEndTimeList: [],
                isAdd: 1,
                id: undefined,
            },
        ]
        //重新生成第一条数据的休息时段
        states.formData.restList[0].restStartTimelist = createTimeList(
            states.formData.workStartTime,
            states.formData.workEndTime,
        )
        //计算工作时间
        calculateWorkTime()
    })
}

// 获取两个时间段直接的时间差，返回值是分钟
const timeDifferenceOfMinute = (startTime, endTime) => {
    return parseFloat(((new Date(endTime).getTime() - new Date(startTime).getTime()) / 60000).toFixed(1))
}
// 获取时间单位是当日还是次日
const getTimeUnit = time => {
    return dayjs(time).format('YYYY-MM-DD') > dayjs().format('YYYY-MM-DD') ? '次日' : '当日'
}
   // 计划类型改变事件
   const planTypeChange = (val, flog) => {
       // resourceRef.value.clearTableCode(val, flog)
   }
   // 保存方法
   const saveData = () => {
       formRef.value.validate(valid => {
          if(valid){
             //如果休息时段维护了开始时间，那么必须维护结束时间
             let lastRest = states.formData.restList[states.formData.restList.length - 1]
            if (lastRest.startTime && !lastRest.endTime) {
                E_Msg.warn('请先正确维护好休息时段')
                return false
            }
            let rotationRestList = []
            if (lastRest.startTime && lastRest.endTime) {
                //休息时段列表
                rotationRestList = states.formData.restList.map((e, index) => {
                    return {
                        restTimeStartUnit: getTimeUnit(e.startTime),
                        restTimeStart: dayjs(e.startTime).format('HH:mm:ss'),
                        restTimeEndUnit: getTimeUnit(e.endTime),
                        restTimeEnd: dayjs(e.endTime).format('HH:mm:ss'),
                        //休息时段的序号
                        orderNum: index,
                        isAdd: e?.isAdd,
                        id: e?.id,
                    }
                })
            }
            // 工作时长计算
            calculateWorkTime()
            const params = {
                // 班次类型id
                basicRotationTypeId: states.formData.basicRotationTypeId,
                //创建组织
                branchCompanyId: states.formData.branchCompanyId,
                //额外扣除时间
                extraRemovalTime: states.formData.extraRemovalTime,
                //备注
                remark: states.formData.remark,
                //班次编码
                rotationCode: states.formData.rotationCode,
                //班次名称
                rotationName: states.formData.rotationName,
                //休息时段列表
                rotationRestList: rotationRestList,
                //工作时长
                workHour: states.formData.workHour,
                //工作结束时间
                workTimeEnd: dayjs(states.formData.workEndTime).format('HH:mm:ss'),
                //工作时段结束单位
                workTimeEndUnit: getTimeUnit(states.formData.workEndTime),
                //工作开始时间
                workTimeStart: dayjs(states.formData.workStartTime).format('HH:mm:ss'),
                // 工作时段开始单位
                workTimeStartUnit: '当日',
                id: states.formData?.id,
            }
            const methods = states.updateType == 'add' ? 'save' : 'update'
            if(!states.saveLoading){
                states.saveLoading = true
                RotationDescApi[methods](params)
                .then(() => {
                    E_Msg.newMessage('操作成功')
                    emits('success')
                    handleClose()
                }).finally(() => {
                    states.saveLoading = false
                })
            }
          
          }
       })
   }
   
   
   
   const handleClose = () => {
       states.dialogVisible = false
       formRef.value.resetFields()
    states.formData.workEndTime = undefined

   }

   defineExpose({ startAddData, startEditData })
   </script>
<style scoped lang="scss">
.unit-convert-box {
    display: flex;

    .unit-convert-box_input_column {
        width: 150px;
        padding: 0 10px;
    }

    .unit-convert-box_star_column {
        width: 20px;
        padding: 0 10px;
    }
}

.collapse-style {
    height: calc(100vh - 370px);
    overflow-y: hidden;
    overflow-x: hidden;
}

.span-icon {
    font-size: 16px;
    margin-left: 10px;
    padding-top: 3px;
    font-weight: 600;
    cursor: pointer;
}
.span_box{
    width: 100%;
    display: flex;
    align-items: center;
}
.icon_box{
    padding-top: 5px;
}
.work-endtime {
    // margin-left: -26px;

    :deep(.el-form-item__label) {
        opacity: 0;
    }
}
</style>