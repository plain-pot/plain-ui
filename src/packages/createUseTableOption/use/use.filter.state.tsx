import {tTableOptionHooks} from "./use.hooks";
import {tPlc} from "../../PlTable/plc/utils/plc.type";
import {reactive, VueNode} from "plain-ui-composition";
import {tTableOptionMethods} from "./use.methods";
import {tTableOptionCache} from "./use.cache";
import {iTableOptionApplyCacheParam, iTableOptionGetCacheParam} from "./use.cache.utils";

export interface FilterStateInitialization<CacheData> {
    seq: number,                                                                    // 在filter all中的显示顺序
    key: string,                                                                    // 每个筛选类型自己的唯一标识
    title: string,                                                                  // 在filter all中的显示标题
    applyCache: (param: iTableOptionApplyCacheParam<CacheData>) => void,            // 应用缓存
    getCache: (param: iTableOptionGetCacheParam) => any,                            // 获取缓存
    getActiveFilterCount: () => number,                                             // 显示当前有多少激活的筛选条件
    getDisplay: () => (() => VueNode),                                            // 在【所有筛选】面板中展示
    clear: () => void,                                                              // 清空筛选条件
}

export function useTableOptionFilterState({hooks, methods, cache}: {
    hooks: tTableOptionHooks,
    methods: tTableOptionMethods,
    cache: tTableOptionCache,
}) {

    const state = reactive({
        getSourceFlatPlcList: null as null | (() => tPlc[]),                        // 原始列信息对象
        plcKeyString: '',                                                           // 表格的唯一标识
        filters: [] as FilterStateInitialization<any>[],                                 // 已经注册的筛选类型
        activeCount: 0,
    })

    cache.registry<Record<string, any>>({
        cacheKey: 'filter-state',
        applyCache: ({sourceList, plcList, cacheData}) => {
            cacheData = cacheData || {}
            state.filters.forEach(filter => {
                filter.applyCache({
                    plcList,
                    sourceList,
                    cacheData: !cacheData ? undefined : cacheData[filter.key],
                })
            })
        },
        getCache: (param) => {
            return state.filters.reduce((prev, item) => {
                prev[item.key] = item.getCache(param)
                return prev
            }, {} as Record<string, any>)
        },
    })

    hooks.onBeforeLoad.use(() => {
        state.activeCount = state.filters.reduce((prev, i) => prev + i.getActiveFilterCount(), 0)
    })

    function useState<CacheData = any>(initialization: FilterStateInitialization<CacheData>): void {
        const data = reactive(initialization)
        state.filters = [data, ...state.filters].sort((a, b) => a.seq - b.seq)
        return data as any
    }

    const clearAll = () => {
        state.filters.forEach(i => i.clear())
        methods.pageMethods.reload()
    }

    const clearFilter = (filter: FilterStateInitialization<any>) => {
        filter.clear()
        methods.pageMethods.reload()
    }

    return {useState, state, clearAll, clearFilter}
}

export type tTableOptionFilter = ReturnType<typeof useTableOptionFilterState>
