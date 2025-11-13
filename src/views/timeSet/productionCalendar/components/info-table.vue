<template>
    <el-card class="bt-view__card--layout-full card" :body-style="{ height: '95%' }">
        <el-space style="margin: 10px 0 10px 0">
            <el-button
                type="primary"
                @click="addCalendar"
                :disabled="states.isSynchronizeHolidays"
                v-hasPermi="['production:calendar:add']"
            >
                新&nbsp;增
            </el-button>
            <el-button
                type="success"
                plain
                @click="editCalendar"
                :disabled="states.isSynchronizeHolidays || !states.ischeckCalendar?.id"
                v-hasPermi="['production:calendar:edit']"
            >
                修&nbsp;改
            </el-button>
            <el-button
                type="danger"
                plain
                :disabled="!states.ischeckCalendar?.id"
                @click="deleteCalendar"
                v-hasPermi="['production:calendar:del']"
            >
                删&nbsp;除
            </el-button>
            <el-button
                type="primary"
                plain
                @click="synchronizeHolidays"
                v-hasPermi="['production:calendar:sync']"
            >
                同步节假日
            </el-button>
        </el-space>
        <el-form ref="formRef"  label-width="80px">
        <el-row style="height: 80px;">
                    <el-col :span="6">
                        <el-form-item label="年度:"  label-width="40px" class="flex-row flex-a-center">
                        <el-select
                            v-model="states.year"
                            class="m-2"
                            placeholder="请选择"
                            filterable
                            @change="changeYear"
                        >
                            <el-option
                                v-for="item in states.yearList"
                                :key="item"
                                :label="item"
                                :value="item"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    </el-col>
                    <el-col :span="7">
                        <el-form-item label="默认日历:"  label-width="80px" class="flex-row flex-a-center">
                        <el-select
                            v-model="states.defaultCalendar"
                            class="m-2"
                            placeholder="请选择"
                            filterable
                            @change="saveDefaultCalendar"
                        >
                            <el-option
                                v-for="item in states.defaultCalendarList"
                                :key="item.id"
                                :label="item.calendarName"
                                :value="item.id"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="使用状态:" class="flex-row flex-a-center">
                        <span style="margin: 8px;">{{ states.ischeckCalendar?.status == 1 ? '启用' : '停用' }}</span>
                    </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        <template #footer v-if="states.isSynchronizeHolidays">
            <el-space class="bt-space">
                <el-button @click="cancelSynchronizeHolidays"  :loading="states.saveLoading">
                    取&nbsp;消
                </el-button>
                <el-button type="primary"  @click="saveSynchronizeHolidays"  :loading="states.saveLoading">
                    保&nbsp;存
                </el-button>
            </el-space>
        </template> 
        <!-- 日历组件 -->
        <YearCalendar
            ref="yearCalendarRef"
            v-if="states.isCheck"
            v-model="states.year"
            v-model:activeDates="states.activeDates"
            lang="tw"
            :showYearSelector="states.showYearSelector"
        ></YearCalendar>
    </el-card>
     <!-- 操作日历 -->
     <calendarOperation ref="calendarOperationRef" @success="success"></calendarOperation>
</template>

<script setup lang="ts">
import { ref, reactive,onMounted,nextTick } from 'vue'
import axios from 'axios'
import {format} from '@/utils/times/index'
import { E_Msg } from '@/utils/message/index'
import CalendarApi from '@/api/basic/basic-calendar-api'
import YearCalendar from './year-calendar.vue'
import CalendarSettingApi from '@/api/basic/basic-calendar-setting-api'
const emits = defineEmits(['refreshCalendar', 'deleteCalendar', 'setCurrentKey'])
import calendarOperation from './calendar-operation.vue'
const states = reactive({
    year: 2025,
    effectiveDateYear: 2025,
    expiringDateYear: 2025,
    activeDates: [],
    showYearSelector: true,
    saveLoading: false, //同步节假日保存load
    yearList: [], //年份下拉
    isCheck: true,
    isSynchronizeHolidays: false, //是否点击了同步节假日
    ischeckCalendar: undefined, //点击的日历data
    holiday: [], //当前同步的节假日所有数据集合
    //默认日历
    defaultCalendar: undefined,
    //默认日历下拉
    defaultCalendarList: [],
})
const yearCalendarRef = ref()
const calendarOperationRef = ref()

//同步节假日
const synchronizeHolidays = () => {
    if (states.year > Number(format(new Date(), 'yyyy'))) {
        E_Msg.warn('可同步的节假日不能大于当前年份！')
        return
    }
    axios.get(`http://timor.tech/api/holiday/year/${states.year}`).then(res => {
        let data = JSON.parse(res.request.response)
        if (data.code == 0) {
            let list = []
            for (const key in data.holiday) {
                list.push(data.holiday[key])
            }
            states.holiday = list
            states.activeDates = list.filter(t => t.holiday == true)
            states.isSynchronizeHolidays = true
            E_Msg.success('同步成功')
        }
    })
}

//刷新数据
const success = () => {
    if (states.yearList[0]) {
        yearCalendarRef.value.checkActiveYear(states.yearList[0])
    }
    emits('refreshCalendar')
    getCalendarList(states.ischeckCalendar)
}
//获取年份下拉
const yearList = () => {
    let list = []
    for (let i = states.effectiveDateYear; i <= states.expiringDateYear; i++) {
        list.push(i)
    }
    states.yearList = list
    //如果当前年份在LIST中 默认当前年份
    if (states.yearList.includes(states.year)) {
        states.year = Number(format(new Date(), 'yyyy'))
    }
    //判断选择日期在不在 日历日期范围内
    if (states.year < states.yearList[0] || states.year > states.yearList[states.yearList.length - 1]) {
        states.year = states.effectiveDateYear
    }
}
// 设置默认日历
const setDefaultCalendar = async list => {
    states.defaultCalendarList = list
    if (Array.isArray(list) && list.length > 0) {
        //查询默认选中的日历
        states.defaultCalendar = list[0].id
        // 如果只有一条数据，并且该日历不是默认日历则默认该日历为默认日历（用于解决日历下拉只有一条，无法触发change事件的问题）
        if (list.length == 1 && !list[0].isDefault) {
            await CalendarApi.getDefaultCalendar({
                id: states.defaultCalendar,
                isDefault: 1,
                t: new Date().getTime(),
            })
            //刷新树，同时选中当前节点
            emits('refreshCalendar')
          
        }
        let item = states.defaultCalendarList.find(e => e.id == states.defaultCalendar)
        //更新点击的日历
        groupClick(item)
        //刷新数据
        if (states.yearList[0]) {
            yearCalendarRef.value.checkActiveYear(states.yearList[0])
        }
        //选中节点
        emits('setCurrentKey', states.defaultCalendar)
    }
}
//保存默认日历
const saveDefaultCalendar = id => {
    //保存日历
    CalendarApi.getDefaultCalendar({
        id,
        isDefault: 1,
        t: new Date().getTime(),
    }).then(() => {
        E_Msg.newMessage('设置成功');
        let item = states.defaultCalendarList.find(e => e.id == id)
        //更新点击的日历
        groupClick(item)
        //刷新数据
        if (states.yearList[0]) {
            yearCalendarRef.value.checkActiveYear(states.yearList[0])
        }
      //刷新树，同时选中当前节点
      emits('refreshCalendar')
    })
}
// 点击日历
const groupClick = data => {
    states.ischeckCalendar = data
    if (!data.id) {
        return
    }
    //获得有效年份和过期年份
    states.effectiveDateYear = new Date(data.effectiveDate).getFullYear()
    states.expiringDateYear = new Date(data.expiringDate).getFullYear()
    states.defaultCalendar = data.id
    yearList()
   setTimeout(() => {
        getCalendarList(data)
    },600)
}
//加载日历
const getCalendarList = data => {
    if (!data || !data?.id) {
        return
    }
    CalendarApi.getCalendar({ id: data.id, year: states.year })
        .then(res => {
            if (res.code == 0) {
                let calenrdarList = res.data.filter(e => e.dateType == 'ItemDateWeek').map(t => t.calendarDate)
                states.activeDates = calenrdarList
                yearCalendarRef.value.checkActiveYear(states.year)
            }
        })
}
//删除日历
const deleteCalendar = () => {
    emits('deleteCalendar', states.ischeckCalendar.id)
}
//新增日历
const addCalendar = () => {
    calendarOperationRef.value.startAdd()
}
//修改
const editCalendar = () => {
    calendarOperationRef.value.startEdit(states.ischeckCalendar)
}
//年份下拉change
const changeYear = e => {
    states.year = e
    states.activeDates = []
    // yearCalendarRef.value.checkActiveYear(e)
    if (states.ischeckCalendar) {
        getCalendarList(states.ischeckCalendar)
    }
}

const clear = () => {
    states.activeDates = []
    yearCalendarRef.value.checkActiveYear(states.year)
}
//取消同步节假日
const cancelSynchronizeHolidays = () => {
    states.saveLoading = false
    states.isSynchronizeHolidays = false
    groupClick(states.ischeckCalendar)
}
//同步节假日保存
const saveSynchronizeHolidays = () => {
    let holidayList = []
    states.holiday.forEach(e => {
        holidayList.push({ date: e.date, dateType: e.holiday ? 'ItemDateWeek' : 'ItemDateWork' })
    })
    // 保存方法
    const params: any = {
        basicCalendarId: states.ischeckCalendar.id,
        holidayList: holidayList,
    }
    states.saveLoading = true
   CalendarSettingApi.syncHoliday(params)
        .then(() => {
            E_Msg.newMessage('保存成功');
            getCalendarList(states.ischeckCalendar)
            states.saveLoading = false
            states.isSynchronizeHolidays = false
        })
        .catch(() => {
            states.saveLoading = false
            states.isSynchronizeHolidays = false
        })
}
defineExpose({ groupClick, clear, setDefaultCalendar })
</script>
<style scoped>

::v-deep.bt-table .header-left {
    margin: 0px;
}
.card {
    display: flex !important;
    flex-direction: column !important;
}
/* ::v-deep .el-card__body{
    height: 100% !important;
} */
</style>
