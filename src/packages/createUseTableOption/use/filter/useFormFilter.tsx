import {computed, reactive} from "plain-ui-composition";
import {tPlc} from "../../../PlTable/plc/utils/plc.type";
import {FilterConfig, iFilterOption, iFilterQuery, iFilterTargetOption} from "../../../PlFilter/FilterConfig";
import {tTableOptionHooks} from "../use.hooks";
import {tTableOptionMethods} from "../use.methods";

import {tTableOptionFilter} from "../use.filter.state";
import {createFilterOptionByPlc, iFilterCacheData, renderFtoForm} from "./use.filter.utils";
import {getPlcKey} from "../../../PlTable/plc/utils/usePropsState";
import {toArray} from "plain-utils/utils/toArray";

export function useTableOptionFormFilter({hooks, methods, filterState}: { hooks: tTableOptionHooks, methods: tTableOptionMethods, filterState: tTableOptionFilter }) {

    const state = reactive({
        getSourceFlatPlcList: null as null | (() => tPlc[]),
        isShow: false,
        data: [] as iFilterOption[],
    })

    filterState.useState<Record<string, iFilterCacheData>>({
        seq: 3,
        key: 'form-filter',
        title: '表单查询',
        applyCache({plcList, cacheData}) {
            state.getSourceFlatPlcList = () => plcList
            cacheData = cacheData || {}
            state.data = plcList.map(plc => {
                const key = getPlcKey(plc)
                if (!!cacheData && !!cacheData[key]) {
                    return {...cacheData[key]!, plc, filterConfig: plc.props.filterConfig}
                } else {
                    return createFilterOptionByPlc(plc)
                }
            })
        },
        getActiveFilterCount: () => {
            if (ftoArr.value.length === 0) {return 0}
            return ftoArr.value.reduce((prev: number, fto: iFilterTargetOption) => {
                const queries = FilterConfig.formatToQuery(fto)
                return prev + (!!queries && toArray(queries).length > 0 ? 1 : 0)
            }, 0)
        },
        getDisplay: () => {
            const showFtoArr = ftoArr.value.filter(i => {
                const queries = FilterConfig.formatToQuery(i)
                return !!queries && toArray(queries).length > 0
            })
            return () => renderFtoForm({
                ftoArr: showFtoArr,
                formData: formData.value,
                onConfirm: methods.pageMethods.reload,

                formAttrs: {column: 1, labelAlign: 'left', width: "100%", contentWidth: 400},
            })
        },
        clear: () => {
            if (!state.data || state.data.length === 0) {return}
            state.data.forEach(fo => FilterConfig.clearFoValue(fo))
        },
        getCache: () => {
            if (!state.data || state.data.length === 0) {return {}}
            return state.data.reduce((prev, fo) => {
                const key = getPlcKey(fo.plc!)
                const {plc, filterConfig, ...left} = fo
                prev[key] = left
                return prev
            }, {} as Record<string, iFilterCacheData>)
        },
    })

    const ftoArr = computed((): iFilterTargetOption[] => state.data.map(i => FilterConfig.getTargetOption(i)).filter(Boolean) as iFilterTargetOption[])

    hooks.onCollectFilterData.use(async data => {
        if (ftoArr.value.length === 0) {return data}
        const queries = ftoArr.value.reduce((prev, fto) => {
            const queries = fto.handler.transform(fto)
            if (!!queries) {
                prev.push(...toArray(queries))
            }
            return prev
        }, [] as iFilterQuery[])
        return !!queries && queries.length > 0 ? [...data, {queries: toArray(queries),}] : data
    })

    const filterMethods = {
        expand: () => state.isShow = true,
        collapse: () => state.isShow = false,
        toggle: () => state.isShow = !state.isShow,
    }

    const formData = computed(() => ftoArr.value.reduce((prev, item, index) => {
        prev[index] = item.option.value
        return prev
    }, {} as Record<number, any>))

    hooks.onTableRender.use(prev => [
        ...prev,
        {
            seq: 9,
            render: () => {
                if (!state.isShow) {return null}
                return renderFtoForm({
                    ftoArr: ftoArr.value,
                    formData: formData.value,
                    onConfirm: methods.pageMethods.reload,
                })
            }
        }
    ])

    return {
        ...filterMethods,
        state,
    }
}
