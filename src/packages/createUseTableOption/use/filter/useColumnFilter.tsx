import {tTableOptionHooks} from "../use.hooks";
import {computed, reactive} from "plain-design-composition";
import {tPlc} from "../../../PlTable/plc/utils/plc.type";
import {FilterConfig, iFilterOption, iFilterQuery, iFilterTargetOption} from "../../../PlFilter/FilterConfig";
import useContextmenu from "../../../useContextmenu";
import {toArray} from 'plain-utils/utils/toArray'

import {tTableOptionMethods} from "../use.methods";
import PlButton from "../../../PlButton";
import './column.filter.scss'
import PlFilter from "../../../PlFilter";
import PlIcon from "../../../PlIcon";
import {ContextmenuServiceOption} from "../../../useContextmenu/PlContextMenuService";
import {useTableOptionDistinctFilter} from "./useDistinctFilter";
import {iTableProConfig, tTableOptionConfig} from "../../createUseTableOption.utils";
import PlButtonGroup from "../../../PlButtonGroup";
import {tTableOptionSort} from "../use.sort.state";
import {tTableOptionFilter} from "../use.filter.state";
import {iFilterCacheDataMap, iFilterStateDataMap, renderFtoForm} from "./use.filter.utils";

export function useTableOptionColumnFilter({hooks, methods, customConfig, sortState, filterState, config}: { hooks: tTableOptionHooks, methods: tTableOptionMethods, customConfig: iTableProConfig, sortState: tTableOptionSort, filterState: tTableOptionFilter, config: tTableOptionConfig }) {

    const distinct = useTableOptionDistinctFilter({customConfig, methods, hooks, filterState, config})

    const $contextmenu = useContextmenu()

    const getColumnKey = (plc: tPlc) => plc.props.field! + (plc.props.title || '#_#')

    const state = reactive({
        data: {} as iFilterStateDataMap
    })

    filterState.useState<iFilterCacheDataMap>({
        seq: 2,
        key: 'column-filter',
        title: '列查询',
        applyCache: ({plcList, cacheData}) => {
            const oldData = state.data
            state.data = plcList.reduce((prev, plc) => {
                const key = getColumnKey(plc)
                if (!!oldData[key]) {
                    prev[key] = {...oldData[key]}
                } else {
                    if (!!cacheData && !!cacheData[key]) {
                        prev[key] = {
                            ...cacheData[key],
                            filterConfig: plc.props.filterConfig,
                            plc,
                        }
                    } else {
                        prev[key] = {
                            label: plc.props.title!,
                            field: plc.props.field!,
                            value: null,
                            filterName: plc.props.filterName,
                            handlerName: plc.props.filterHandler,
                            filterConfig: plc.props.filterConfig,
                            plc,
                        }
                    }
                }
                return prev
            }, {} as Record<string, iFilterOption>)
        },
        getActiveFilterCount: (): number => {
            return Object.values(columnFilterTargetDataMap.value).reduce((prev, fto) => {
                const queries = FilterConfig.formatToQuery(fto)
                return prev + (!!queries && toArray(queries).length > 0 ? 1 : 0)
            }, 0)
        },
        getDisplay: () => {
            const showFtoArr: iFilterTargetOption[] = Object.values(columnFilterTargetDataMap.value).filter(fto => {
                const queries = FilterConfig.formatToQuery(fto)
                return !!queries && toArray(queries).length > 0
            })
            const formData = computed(() => showFtoArr.reduce((prev, item, index) => {
                prev[index] = item.option.value
                return prev
            }, {} as Record<number, any>))
            return () => renderFtoForm({
                ftoArr: showFtoArr,
                formData: formData.value,
                onConfirm: methods.pageMethods.reload,
                formAttrs: {column: 1, labelAlign: 'left', width: "100%", contentWidth: 400},
            })
        },
        clear: () => {
            Object.values(state.data).forEach(i => {
                i.value = undefined
                i.filterName = i.plc!.props.filterName
            })
        },
        getCache: () => {
            const s = state.data
            return Object.entries(s).reduce((prev, [key, {filterConfig, plc, ...left}]) => {
                prev[key] = left
                return prev
            }, {} as iFilterCacheDataMap)
        },
    })

    /*列目标筛选配置信息对象*/
    const columnFilterTargetDataMap = computed(() => Object.entries(state.data).reduce((prev, [columnKey, option]) => {
        const fto = FilterConfig.getTargetOption(option)
        !!fto && (prev[columnKey] = fto)
        return prev
    }, {} as Record<string, iFilterTargetOption>))

    /*查询的时候被收集筛选条件*/
    hooks.onCollectFilterData.use((data) => {

        /*普通筛选条件*/
        const ftoArr = Object.values(columnFilterTargetDataMap.value)
        const queries = ftoArr.reduce((prev, fto) => {
            const queries = fto.handler.transform(fto)
            if (!!queries) {
                prev.push(...toArray(queries))
            }
            return prev
        }, [] as iFilterQuery[])

        return !!queries && queries.length > 0 ? [...data, {queries: toArray(queries),}] : data
    })

    hooks.onClickHead.use(({plc, e}) => {
        /*分组表头不做处理, 仅处理列表头*/
        if (plc.group || !plc.props.field) {return}
        const menuOpt: ContextmenuServiceOption = {} as any

        $contextmenu(e.currentTarget, () => {
            const columnKey = getColumnKey(plc)
            const fto = columnFilterTargetDataMap.value[columnKey]
            if (!fto) {return;}

            const {field, label: title} = fto.option
            const {desc} = sortState.get({field, title}) || {desc: null}

            return <>
                <div onClick={e => e.stopPropagation()} class="pro-column-filter-container">
                    <div class="pro-column-filter-sort-container">
                        <div class={[
                            'pro-column-filter-sort-item',
                            {'pro-column-filter-sort-item-active': desc !== null && !desc}
                        ]} onClick={() => sortState.toggleSort({field, desc: false, title})}>
                            <PlIcon icon="el-icon-upload1"/>
                            <span>升序</span>
                        </div>
                        <div class={[
                            'pro-column-filter-sort-item',
                            {'pro-column-filter-sort-item-active': desc !== null && !!desc}
                        ]} onClick={() => sortState.toggleSort({field, desc: true, title})}>
                            <PlIcon icon="el-icon-download"/>
                            <span>降序</span>
                        </div>
                    </div>
                    <div>
                        <PlFilter block fto={fto} hideSearchButton onConfirm={methods.pageMethods.reload}/>
                    </div>
                    <div>
                        <PlButtonGroup>
                            <PlButton mode="stroke" icon="el-icon-thumb" label="关闭" onClick={() => menuOpt.hide!()}/>
                            <PlButton icon="el-icon-s-tools" label="应用" onClick={() => methods.pageMethods.reload()}/>
                            <PlButton icon="el-icon-search" label="去重筛选" onClick={() => {
                                menuOpt.hide!()
                                distinct.open(fto.option.plc!)
                            }}/>
                            <PlButton icon="el-icon-close" onClick={() => distinct.clear(fto.option.plc!)}/>
                        </PlButtonGroup>
                    </div>
                </div>
            </>
        }, menuOpt)
    })
}
