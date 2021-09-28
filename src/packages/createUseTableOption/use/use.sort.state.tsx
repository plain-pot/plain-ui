import {computed, reactive} from "plain-design-composition";
import {tTableOptionMethods} from "./use.methods";
import {tTableOptionHooks} from "./use.hooks";
import {tTableOptionCache} from "./use.cache";
import {deepcopy} from "plain-utils/object/deepcopy";

/**
 * 排序参数（用来显示的排序参数数据结构）
 * @author  韦胜健
 * @date    2021/7/18 10:10
 */
export interface iTableOptionSortData {
    field: string,
    title: string,
    desc: boolean,
    seq: number,
}

export function useTableOptionSortState({hooks, methods, cache}: { hooks: tTableOptionHooks, methods: tTableOptionMethods, cache: tTableOptionCache }) {

    const state = reactive({
        data: [] as iTableOptionSortData[],
    })

    cache.registry<iTableOptionSortData[]>({
        cacheKey: 'sort-state',
        getCache: () => {
            return deepcopy(state.data)
        },
        applyCache: ({cacheData}) => {
            state.data = cacheData || []
        },
    })

    const seqData = computed(() => state.data.reduce((prev, item) => {
        prev.max = Math.max(prev.max, item.seq)
        prev.min = Math.min(prev.min, item.seq)
        return prev
    }, {max: 1, min: 1}))

    const toggleSort = ({field, title, desc}: Omit<iTableOptionSortData, 'seq'>, config?: { first?: boolean, reload?: boolean }) => {

        config = config || {}

        const existIndex = state.data.findIndex(i => i.title === title && i.field === field)
        const exist = state.data[existIndex]
        if (!!exist) {
            if (exist.desc === desc) {
                state.data.splice(existIndex, 1)
            } else {
                exist.desc = desc
            }
        } else {
            state.data.push({title, field, desc, seq: config.first ? seqData.value.min : seqData.value.max})
        }

        config.reload !== false && (methods.pageMethods.reload())
    }

    const setSort = (data: iTableOptionSortData[]) => {
        state.data = data
        methods.pageMethods.reload()
    }

    const get = ({field, title}: { title: string, field: string }): iTableOptionSortData | undefined => state.data.find(i => i.field === field && i.title === title)

    const sortStateData = computed(() => state.data.sort((a, b) => a.seq - b.seq))
    hooks.onCollectSortData.use((prev) => [...(sortStateData.value.map(i => ({field: i.field, desc: i.desc}))), ...prev,])
    const sortQueryData = computed(() => hooks.onCollectSortData.exec([]))

    return {
        get,
        setSort,
        toggleSort,
        sortStateData,
        sortQueryData,
        seqData,
    }
}

export type tTableOptionSort = ReturnType<typeof useTableOptionSortState>
