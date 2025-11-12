<template>
    <el-tree-select
        ref="selectRef"
        v-model="props.modelValue"
        :data="states.options"
        v-focus="loadMore"
        clearable
        filterable
        remote
        :disabled="props.disabled"
        remote-show-suffix
        :filter-method="handleSearch"
        :props="props.prop"
        @change="selectChange"
        :placeholder="props.disabled ? ' ' : '请选择'"
        popper-class="scroll-load-select-tree"
        :cache-data="states.cacheData"
    >
        <template #default="{ data }">
            <span class="select-class"> {{ data[props.prop.label] }}</span>
        </template>
    </el-tree-select>
</template>

<script setup lang="ts">
import { reactive, ref, nextTick, watch, onMounted } from 'vue'

const props = defineProps({
    // 绑定值
    modelValue: String,
    // 接口
    api: Object,
    // 分页页码，就是滚动到最底部一次加载多少条，默认10。
    pageSize: {
        type: Number,
        default: 10,
    },
    // 缓存名称，修改查看时需要传入，可在没加载到对应下拉数据时显示在框内，不传会显示id
    cachedName: String,
    // 跟随接口一起请求的参数，会拼到接口上
    apiParams: {
        type: Object,
        default: () => {},
    },
    // label，value的绑定值
    prop: {
        type: Object,
        default: () => {
            return { label: 'unitName', value: 'id' }
        },
    },
    // 禁用数据组。如果接口不方便过滤，可以传入一个由prop.value组成的list，组件会将下拉数据中prop.value能对应到的数据禁用
    disabledList: {
        type: Array,
        default: () => [],
    },
    // 主要搜索入参名，会拼到接口上
    searchKey: {
        type: String,
        default: '',
    },
    // 是否禁用下拉
    disabled: {
        type: Boolean,
        default: false,
    },
})

const states = reactive({
    // 下拉数据
    options: [],
    // 初始化标识
    initFlag: false,
    // 加载标识
    loading: false,
    pageNumber: 1,
    // 是否全部加载标识
    isTotal: false,
    // 搜索值
    searchValue: '',
    cacheData: [],
    saveDomId: undefined,
})

// 监听缓存名
watch(
    () => props.cachedName,
    v => {
        nextTick(() => {
            if (v) {
                const obj = {}
                obj[props.prop.label] = props.cachedName
                obj[props.prop.value] = props.modelValue
                states.cacheData = [obj]
            }
        })
    },
)

// 监听禁用数组，有变化时重新处理数据
watch(
    () => props.disabledList,
    () => {
        states.options = states.options.map(x => {
            x.disabled = props.disabledList.includes(x[props.prop.value])
            return x
        })
    },
)

onMounted(() => {
    if (props.cachedName) {
        const obj = {}
        obj[props.prop.label] = props.cachedName
        obj[props.prop.value] = props.modelValue
        states.cacheData = [obj]
    }
})

const selectRef = ref()

const emits = defineEmits(['change', 'update:modelValue'])

// 指令
const vFocus = {
    mounted(el, binding) {
        el.querySelector('.select-trigger').addEventListener('click', () => {
            if (states.initFlag) {
                return
            }
            if (el.querySelector('.is-disabled')) {
                return
            }
            loadMore()
            nextTick(() => {
                setTimeout(() => {
                    const onlyId = el.querySelector('.select-trigger').getAttribute('aria-describedby')
                    const SELECTWRAP = document.querySelector(
                        `#${onlyId}` + ' .el-select-dropdown .el-select-dropdown__wrap',
                    )
                    if (SELECTWRAP) {
                        states.saveDomId = onlyId
                        SELECTWRAP.addEventListener('scroll', function () {
                            // scrollTop 这里可能因为浏览器缩放存在小数点的情况，导致了滚动到底部时
                            // scrollHeight 减去滚动到底部时的scrollTop ，依然大于clientHeight 导致无法请求更多数据
                            // 这里将scrollTop向上取整 保证滚到底部时，触发调用
                            const CONDITION = this.scrollHeight - Math.ceil(this.scrollTop) <= this.clientHeight
                            // el.scrollTop !== 0 当输入时，如果搜索结果很少，以至于没看到滚动条，那么此时的CONDITION计算结果是true，会执行bind.value()，此时不应该执行，否则搜索结果不匹配
                            if (CONDITION && this.scrollTop !== 0) {
                                binding.value()
                            }
                        })
                    }
                }, 1000)
            })

            states.initFlag = true
        })
    },
}

const loadMore = t => {
    if (states.loading || states.isTotal) {
        return
    }
    states.loading = true
    const params = {
        pageSize: props.pageSize,
        pageNumber: states.pageNumber,
        key: Math.random(),
        ...props.apiParams,
    }
    params[props.searchKey] = states.searchValue || undefined
    props.api.listPage(params).then(res => {
        if (t) {
            states.options = []
        }
        states.options = states.options.concat(res.data.records).map(x => {
            x.disabled = props.disabledList.includes(x[props.prop.value])
            return x
        })
        if (res.data.total == states.options.length) {
            states.isTotal = true
        }
        states.pageNumber++
        states.loading = false
    })
}

const handleSearch = value => {
    const dom = document.querySelector(`#${states.saveDomId}`)
    if (!dom || dom.getAttribute('aria-hidden') == 'true') {
        return
    }
    states.searchValue = value
    states.pageNumber = 1
    states.isTotal = false
    // states.options = []
    loadMore(true)
}

const selectChange = v => {
    emits('update:modelValue', v)
    emits(
        'change',
        v,
        states.options.find(x => x[props.prop.value] == v)
            ? states.options.find(x => x[props.prop.value] == v)[props.prop.label]
            : undefined,
    )
}
</script>
<style scoped>
.select-class {
    font-size: var(--el-font-size-base);
    padding: 0 32px 0 20px;
    position: relative;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    height: 34px;
    line-height: 34px;
    box-sizing: border-box;
    cursor: pointer;
}
</style>
<style>
.scroll-load-select-tree .el-tree-select__popper .el-select-dropdown__item {
    height: 34px;
}
.scroll-load-select-tree .el-tree-node__content {
    height: 34px;
}
.scroll-load-select-tree .el-tree-node__expand-icon {
    display: none;
}
</style>
