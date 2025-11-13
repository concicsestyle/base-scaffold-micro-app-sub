import dayjs from 'dayjs'

/**
 * 初始化日期
 * @param planStartTime 开始日期
 * @param planEndTime 结束日期
 * @returns 日期表
 */
export const initDate = (planStartTime, planEndTime) => {
    const dataList = []
    let start = dayjs(planStartTime)
    const end = dayjs(planEndTime).add(1, 'day')
    while (start.isBefore(end)) {
        if (start.isBefore(end)) {
            const year = addYear(start, dataList)
            addMonth(year, start)
            addWeek(year, start)
            start = start.add(1, 'day')
        } else {
            break
        }
    }
    return dataList
}
/**
 * 添加年
 * @param date 日期
 * @param dataList 数据
 * @returns 年
 */
const addYear = (date, dataList: any) => {
    let year = null
    dataList.forEach(item => {
        if (item.id == date.year()) {
            year = item
        }
    })
    if (!year) {
        year = {
            id: date.format('YYYY'),
            label: `${date.format('YYYY')}年`,
            month: [],
            week: [],
            date: [],
        }
        dataList.push(year)
    }
    year.date.push({
        id: date.format('YYYY-MM-DD'),
        label: date.format('YYYY-MM-DD'),
    })
    return year
}
/**
 * 添加月
 * @param year 年
 * @param date 日期
 */
const addMonth = (year, date) => {
    let month = null
    year.month.forEach(item => {
        if (item.id == date.format('YYYY-MM')) {
            month = item
        }
    })
    if (!month) {
        month = {
            id: date.format('YYYY-MM'),
            label: `${date.month() + 1}月`,
            date: [],
        }
        year.month.push(month)
    }
    month.date.push({
        id: date.format('YYYY-MM-DD'),
        label: date.format('YYYY-MM-DD'),
    })
}

/**
 * 添加周
 * @param year 年
 * @param date 日期
 */
const addWeek = (year, date) => {
    let week = null
    year.week.forEach(item => {
        if (item.id == date.week()) {
            week = item
        }
    })
    if (!week) {
        week = {
            id: date.week(),
            label: `${date.week()}周`,
            date: [],
        }
        year.week.push(week)
    }
    week.date.push({
        id: date.format('YYYY-MM-DD'),
        label: date.format('YYYY-MM-DD'),
    })
}

const _getMixDate = (data1, data2) => {
    let perStart = null
    let perEnd = null

    const d1s = dayjs(data1.planStartTime)
    const d1e = dayjs(data1.planEndTime)
    const d2s = dayjs(data2.planStartTime)
    const d2e = dayjs(data2.planEndTime)

    if (d1s.isBefore(d2e) || d2s.isBefore(d1e)) {
        perStart = d1s.isBefore(d2s) ? d2s : d1s
        perEnd = d1e.isBefore(d2e) ? d1e : d2e

        return { planStartTime: perStart, planEndTime: perEnd }
    }
    return null
}

/**
 * 根据工作中心分组
 * @param dataList 数据
 * @returns 分组数据
 */
export const groupByCenter = (dataList,pageType) => {
    const groupedBy = {}
    if (pageType !== 'project') {
        for (const item of dataList) {
            if (groupedBy[item.workCenterId]) {
                groupedBy[item.workCenterId].push(item)
            } else {
                groupedBy[item.workCenterId] = [item]
            }
        }
    } else {
         for (const item of dataList) {
            if (groupedBy[item.projectName]) {
                groupedBy[item.projectName].push(item)
            } else {
                groupedBy[item.projectName] = [item]
            }
        }
    }
    return groupedBy
}
/**
 * 根据拆解的时间数组分解
 * @param dataList 拆解的时间数组
 * @returns
 */
const groupByDay = dataList => {
    const groupedBy = {}
    for (const item of dataList) {
        if (groupedBy[item.date]) {
            groupedBy[item.date].push(item)
        } else {
            groupedBy[item.date] = [item]
        }
    }
    return groupedBy
}

/**
 * 筛选超负荷的数据
 * @param groupData
 */
const filterOverLoadData = groupData => {
    const maskList = []
    // 遍历分组内每天的数据，过滤出超负荷的天
    for (const key in groupData) {
        // 当前内分组数据超过一条则超负荷？
        // 一条数据也有可能超负荷？
        // groupData[key]
        const _indexArr = []
        let _sum = 0
        groupData[key].forEach(item => {
            _indexArr.push(item.index)
            _sum += item.loadProportion
        })
        if (_sum > 1) {
            maskList.push({
                id: groupData[key][0].id,
                planStartTime: groupData[key][0].date,
                planEndTime: groupData[key][0].date,
                label: `${(_sum * 100).toFixed(0)}%`,
                load: (_sum * 100).toFixed(0),
                rowIndex: _indexArr,
                workCenterId: groupData[key][0].workCenterId,
                projectName: groupData[key][0].projectName,
            })
        }
    }
    return maskList
}
const maskGroupById = maskList => {
    const groupedBy = {}
    for (const item of maskList) {
        if (groupedBy[item.id]) {
            groupedBy[item.id].push(item)
        } else {
            groupedBy[item.id] = [item]
        }
    }
    return groupedBy
}
/**
 * 计算开始时间、结束时间间隔天数
 * @param planStartTime 开始时间
 * @param planEndTime 结束时间
 * @returns 相隔天数
 */
const diffDate = (planStartTime, planEndTime) => {
    return dayjs(planEndTime).diff(planStartTime, 'day')+1
}
/**
 * 分割组内数据
 * @param origin 原数据
 * @param arr
 */
const splitDate = (origin, arr) => {
    const dateArr = []
    arr.forEach(item => {
        // 当前分组内的时间分解
        const days = diffDate(item.planStartTime, item.planEndTime)
        for (let i = 0; i < days; i++) {
            const key = dayjs(item.planStartTime).add(i, 'day').format('YYYY-MM-DD')
            const _a = {}
            // _a[key] = item.totalLoadProportion
            _a['date'] = key
            _a['loadProportion'] = item.loadProportion
            // 获取分解后的数据在原始数据中的索引
            _a['index'] = origin.findIndex(oi => {
                return oi.id === item.id
            })
            _a['id'] = item.id
            _a['workCenterId'] = item.workCenterId
            _a['projectName'] = item.projectName
            dateArr.push(_a)
        }
    })
    // 对当前分组已分解好的数据进行再次分组
    // 过滤超负荷的数据
    return filterOverLoadData(groupByDay(dateArr))
}

export const concatMask = list => {
    const concatMaskList = []
    // 分组后的mask，还需要合并遮罩层
    for (const key in list) {
        const _maskList = list[key]
        let _mask = {
            planStartTime: _maskList[0].planStartTime,
            planEndTime: _maskList[0].planEndTime,
            label: _maskList[0].label,
            load: _maskList[0].load,
            rowIndex: _maskList[0].rowIndex,
            workCenterId: _maskList[0].workCenterId,
            projectName: _maskList[0].projectName,
            id: _maskList[0].id,
        }
        for (let i = 0; i < _maskList.length; i++) {
            if (i < _maskList.length - 1) {
                if (
                    _maskList[i].label == _maskList[i + 1].label &&
                    dayjs(_maskList[i].planEndTime).add(1, 'day').format('YYYY-MM-DD') ==
                        _maskList[i + 1].planStartTime
                ) {
                    // 把结束时间更新为同一负荷的最后一天
                    _mask.planEndTime = _maskList[i + 1].planEndTime
                } else {
                    _mask.planEndTime = _maskList[i].planEndTime
                    concatMaskList.push(_mask)
                    // 同时更新mask实例
                    _mask = {
                        planStartTime: _maskList[i + 1].planStartTime,
                        planEndTime: _maskList[i + 1].planEndTime,
                        label: _maskList[i + 1].label,
                        rowIndex: _maskList[i + 1].rowIndex,
                        workCenterId: _maskList[i + 1].workCenterId,
                        projectName: _maskList[i + 1].projectName,
                        load: _maskList[i + 1].load,
                        id: _maskList[i + 1].id,
                    }
                }
            } else {
                concatMaskList.push(_mask)
            }
        }
    }
    return concatMaskList
}

// TODO datalist可以穿入单个工作中心
export const handleGroupsData = (dataList, pageType) => {
    const data = groupByCenter(dataList, pageType)
    const centerMask = []
    for (const key in data) {
        centerMask.push(...splitDate(dataList, data[key]))
    }
    return concatMask(maskGroupById(centerMask))
}
export const handleMaxload = (dataList,pageType) => {
    const data = groupByCenter(dataList,pageType)
    const centerMask = []
    for (const key in data) {
        centerMask.push( ...splitDate(dataList, data[key]) )
    }
    const arr=[]
    const _concaMas = concatMask(maskGroupById(centerMask))
    for (let i = 0; i < _concaMas.length; i++) {
        if (arr.length) {
            const _exist = arr.findIndex(item => _concaMas[i].workCenterId == item.workCenterId)
            if (_exist != -1) {
                if (Number(arr[_exist].maxload) < Number(_concaMas[i].load)&&_concaMas[i].rowIndex.length!==1) {
                        arr[_exist].maxload = _concaMas[i].load
                }
            } else {
                arr.push({
                    workCenterId: _concaMas[i].workCenterId,
                    maxload: _concaMas[i].load,
                    rowIndex: _concaMas[i].rowIndex,
                })
            }
        } else {
            arr.push({
                workCenterId: _concaMas[i].workCenterId,
                maxload: _concaMas[i].load,
                rowIndex: _concaMas[i].rowIndex,
            })
        }
    }
    return arr

}
// 各个工作中心最大负荷
export const handleGroupsMaxload = (dataList,pageType) => {
    const data = groupByCenter(dataList,pageType)
    const centerMask = []
    for (const key in data) {
        centerMask.push( ...splitDate(dataList, data[key]) )
    }
    const _concaMas = concatMask(maskGroupById(centerMask))
    const arr = []
    if (pageType !== 'project') {
        // 获取各个工作中心的最大负荷数
        for (let i = 0; i < _concaMas.length; i++) {
            if (arr.length) {
                const _exist = arr.findIndex(item => _concaMas[i].workCenterId == item.workCenterId)
                if (_exist != -1) {
                    if (Number(arr[_exist].maxload) < Number(_concaMas[i].load)) {
                        arr[_exist].maxload = _concaMas[i].load
                    }
                } else {
                    arr.push({
                        workCenterId: _concaMas[i].workCenterId,
                        maxload: _concaMas[i].load,
                    })
                }
            } else {
                arr.push({
                    workCenterId: _concaMas[i].workCenterId,
                    maxload: _concaMas[i].load,
                })
            }
        }
    } else {
            for (let i = 0; i < _concaMas.length; i++) {
            if (arr.length) {
                const _exist = arr.findIndex(item => _concaMas[i].projectName == item.projectName)
                if (_exist != -1) {
                    if (Number(arr[_exist].maxload) < Number(_concaMas[i].load)) {
                        arr[_exist].maxload = _concaMas[i].load
                    }
                } else {
                    arr.push({
                        projectName: _concaMas[i].projectName,
                        maxload: _concaMas[i].load,
                    })
                }
            } else {
                arr.push({
                    projectName: _concaMas[i].projectName,
                    maxload: _concaMas[i].load,
                })
            }
        }
    }
    return arr
}
