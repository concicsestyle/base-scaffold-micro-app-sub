<template>
    <div class="c-wrapper">
        <div class="calendar">
            <div class="calendar__title">{{ monthTitle }}</div>
            <div class="calendar__body">
                <div v-for="(day, key) in 7"
                     :key="`title${day}`"
                     class="calendar__day day__weektitle"
                     :style="{ fontSize: weekTitleFontSizeAdjustLang }">
                    {{ showDayTitle(key) }}
                </div>
                <div v-for="(dayObj, key) in states.showDays" class="calendar__day" :key="`day${key}`">
                    <div class="day" :class="classList(dayObj)">
                        <span>{{ dayObj.value }}</span>
                        <span v-if="dayObj.active" class="week-content">休</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { computed, reactive, watch } from 'vue'
const props = defineProps({
    activeDates: {
        type: Array,
        default: () => [],
    },
    month: {
        type: [String, Number],
        default: () => dayjs().month() + 1,
    },
    year: {
        type: [String, Number],
        default: () => dayjs().year(),
    },
    lang: {
        type: String,
        default: 'en',
    },
    activeClass: {
        type: String,
        default: () => '',
    },
    prefixClass: {
        type: String,
        default: () => 'calendar--active',
    },
})
watch(
    () => props.activeDates,
    () => {
        initCalendar()
    },
)
watch(
    () => props.year,
    () => {
        initCalendar()
    },
)
const states = reactive({
    showDays: [],
    isMouseDown: false,
})
const weekTitleFontSizeAdjustLang = computed(() => {
    const fontSizeMapping = {
        tw: '12px',
    }
    return fontSizeMapping[props.lang]
})
const monthTitle = computed(() => {
    const monthMapping = {
        tw: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    }
    return monthMapping[props.lang][props.month - 1]
})
const initCalendar = () => {
    if (!props.year || !props.month) return []
    const activeMonth = dayjs()
        .set('date', 1)
        .set('year', props.year)
        .set('month', props.month - 1)
    let firstDay = activeMonth.startOf('month').day() - 1
    if (firstDay < 0) firstDay += 7
    const lastDate = activeMonth.endOf('month').date()
    const weekRow = firstDay >= 5 ? 6 : 5
    const WEEK = 7
    let day = 0
    const fullCol = Array.from(Array(weekRow * WEEK).keys()).map(i => {
        let value = firstDay <= i ? (day++ % lastDate) + 1 : ''
        return {
            value,
            active: false,
            isOtherMonth: firstDay > i || day > lastDate,
        }
    })
    states.showDays = fullCol
    // 把 toggleDate 的內容合併在 initCalendar 裡。
    props.activeDates.forEach(date => {
        let oDate

        if (typeof date === 'string') {
            oDate = {
                date: date,
                className: props.activeClass,
            }
        } else if (typeof date === 'object') {
            oDate = date
        }

        let dayjsObj = dayjs(oDate.date)
        if (dayjsObj.year() !== props.year) return
        let activeDate = dayjsObj.date()
        let row = Math.floor(activeDate / 7)
        let activeArrayKey = (activeDate % 7) - 1 + firstDay + 7 * row
        states.showDays[activeArrayKey].active = true // to array index
        states.showDays[activeArrayKey].className = oDate.className
    })
}
initCalendar()
const showDayTitle = day => {
    const dayMapping = {
        tw: ['一', '二', '三', '四', '五', '六', '日'],
    }
    return dayMapping[props.lang][day]
}
const classList = dayObj => {
    let oClassList = {
        'calendar__day--otherMonth': dayObj.isOtherMonth,
        [props.prefixClass]: dayObj.active,
    }
    if (dayObj.active) oClassList[dayObj.className] = true
    return oClassList
}
</script>

<style lang="scss" scoped>
.c-wrapper {
    padding: 10px;

    .calendar {
        background-color: #fff;
        height: 100%;
        text-align: center;
        color: rgba(#353c46, 0.8);
        border-radius: 2px;
        min-width: 0;
        position: relative;
        text-decoration: none;
        box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 1px 3px 0 rgba(0, 0, 0, 0.12);
        transition: transform 0.3s ease;
    }

    .calendar__title {
        font-weight: bold;
        border-bottom: 1px solid rgba(#c4c4c4, 0.3);
        font-size: 14px;
        margin-bottom: 5px;
        cursor: pointer;
    }

    .calendar__body {
        display: flex;
        flex-wrap: wrap;
        height: 80%;
        padding: 0px 20px;
        min-width: 194px;
    }

    .calendar__day {
        flex: 14.28%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 12px;
        height: 22px;
        color: #5db3d4;
    }

    .day__weektitle {
        color: rgba(#353c46, 0.8);
    }

    .day {
        font-size: 12px;
        cursor: pointer;
        user-select: none;
        width: 20px;
        height: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        border-radius: 5px;

        &:after {
            display: block;
            height: 10px;
            width: 10px;
            position: absolute;
            top: -5px;
            right: -5px;
            border-radius: 50%;
            z-index: 1;
            background-color: transparent;
        }

        &.calendar--active:after {
            background-image: url('../assets/baseline-remove_circle-24px.svg');
        }

        background-size: 100% 100%;

        &:not(.calendar__day--otherMonth):hover {
            background-color: rgba(#666, 0.1);
            border-radius: 5px;
        }
    }

    .calendar__day--otherMonth {
        color: #eaeaea;
        cursor: auto;
    }

    .week-content {
        position: relative;
        font-size: 12px;
        width: 10px;
        height: 33px;
        color: #ff524c;
    }
}
</style>
