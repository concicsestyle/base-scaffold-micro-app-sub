<template>
    <div class="vue-calendar__container">
        <div class="container__months" :class="{ 'hide-weekend': hideWeekend, 'hide-sunday': hideSunday }">
            <month-calendar class="container__month"
                            v-for="n in 12"
                            :key="`month-${n}`"
                            :year="states.activeYear"
                            :month="n"
                            :activeDates="monthParams[n]"
                            :activeClass="activeClass"
                            @toggleDate="toggleDate"
                            :lang="lang"
                            :prefixClass="prefixClass"
                            @monthClickEvent="monthClick"></month-calendar>
        </div>
    </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { computed, reactive } from 'vue'
import MonthCalendar from './month-calendar.vue'
const emits = defineEmits(['toggleDate', 'activeDates', 'monthClick'])
const props = defineProps({
    showYearSelector: {
        type: Boolean,
        default: () => true,
    },
    activeDates: {
        type: Array,
        default: () => [],
    },
    value: {
        type: [String, Number],
        default: dayjs().year(),
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
    hideWeekend: {
        type: Boolean,
        default: false,
    },
    hideSunday: {
        type: Boolean,
        default: false,
    },
})

const states = reactive({
    isUsingString: true,
    activeYear: dayjs().year(),
})
states.isUsingString = props.activeDates.length && typeof props.activeDates[0] === 'string'
const monthParams = computed(() => {
    const month = {}
    props.activeDates.forEach(date => {
        let oDate

        if (typeof date === 'string') {
            oDate = {
                date: date,
                className: props.activeClass,
            }
        } else {
            // 若 activeDate 裡的物件少了 className 屬性，就自動填入空字串。否則會變成undefined
            oDate = {
                date: date.date,
                className: date.className || '',
            }
        }
        // if (dayjs(oDate.date).year() !== parseInt(props.value)) return // 讓2020年1月的資料，不會放到 2019年的1月資料裡
        let m = (dayjs(oDate.date).month() + 1).toString()
        if (!month[m]) month[m] = []
        month[m].push(oDate)
    })

    return month
})
const checkActiveYear = e => {
    states.activeYear = e
}
const toggleDate = dateObj => {
    const activeDate = dayjs()
        .set('year', props.value)
        .set('month', dateObj.month - 1)
        .set('date', dateObj.date)
        .format('YYYY-MM-DD')
    emits('toggleDate', {
        date: activeDate,
        selected: dateObj.selected,
        className: dateObj.className,
    })

    let dateIndex
    let newDates

    if (states.isUsingString) {
        dateIndex = props.activeDates.indexOf(activeDate)
        newDates = modifiedActiveDates(dateIndex, activeDate)
    } else {
        let oDate = {
            date: activeDate,
            className: dateObj.className,
        }

        dateIndex = props.activeDates.indexOf(props.activeDates.find(i => i.date === activeDate))
        newDates = modifiedActiveDates(dateIndex, oDate)
    }

    emits('update:activeDates', newDates)
}
const modifiedActiveDates = (dateIndex, activeDate) => {
    let newDates = [...props.activeDates]
    if (dateIndex === -1) {
        newDates.push(activeDate)
    } else {
        newDates.splice(dateIndex, 1)
    }
    return newDates
}
const monthClick = monthYearInfo => {
    emits('monthClick', monthYearInfo)
}
defineExpose({ checkActiveYear })
</script>

<style lang="scss" scoped>
.vue-calendar__container {
    height: 90%;

    .container__year {
        user-select: none;
        height: 65px;
        background-color: #fff;
        font-size: 24px;
        flex: 100%;
        text-align: center;
        display: flex;
    }

    .year__chooser {
        height: 100%;
        flex: 1;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: rgba(black, 0.9);

        &:hover {
            background-color: rgba(#666, 0.1);
        }

        &:nth-child(4n-3) {
            color: rgba(black, 0.3);
        }

        &:nth-child(2n) {
            color: rgba(black, 0.6);
        }

        &:nth-child(3) {
            box-shadow: inset 0px -3px #4792bd;
        }
    }

    .container__months {
        flex-wrap: wrap;
        display: flex;
        height: 90%;
    }

    .container__month {
        padding: 8px;
        flex: 24.66%;

        .p-0 {
            padding: 0px;
        }

        .container__months.hide-sunday .calendar__day:nth-of-type(7n) {
            display: none;
        }

        .calendar__day {
            flex: 16.66%;
        }

        .container__months.hide-weekend .calendar__day:nth-of-type(7n),
        .calendar__day:nth-of-type(7n-1) {
            display: none;
        }

        .calendar__day {
            flex: 19%;
        }
    }
}
</style>
