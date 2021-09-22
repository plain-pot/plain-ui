import {tPlc} from "../../../PlTable/plc/utils/plc.type";
import {iTableProConfig, PlainObject, tTableOptionConfig} from "../../createUseTableOption.utils";
import {computed, designPage, reactive, useRefs} from "plain-ui-composition";
import PlTablePro from "../../../PlTablePro";
import useDialog, {DialogServiceFormatOption} from "../../../useDialog";
import PlcCheckRow from "../../../PlcCheckRow";
import {iFilterQuery} from "../../../PlFilter/FilterConfig";
import {tTableOptionHooks} from "../use.hooks";
import {tTableOptionMethods} from "../use.methods";
import {tPlTable} from "../../../PlTable";
import {findRreactElement} from "../../../../utils/findReactElement";
import {tTableOptionFilter} from "../use.filter.state";
import PlButton from "../../../PlButton";
import {TableNode} from "../../../PlTable/table/use/useTableNode";
import {renderBodyCell} from "../../../PlTable/plc/utils/render";
import {TreeNodeCheckStatus} from "../../../PlTree/utils/tree-constant";
import './distinct.filter.scss'
import {getPlcKey} from "../../../PlTable/plc/utils/usePropsState";
import useObjectOption from "../../../useObjectOption";
import {defer} from "plain-utils/utils/defer";
import {toArray} from "plain-utils/utils/toArray";

/**
 *在打开去重筛选弹框的时候，需要获取一遍当前表格的查询参数，在获取的同时要排除掉这个列的去重筛选条件参数
 * @author  韦胜健
 * @date    2021/7/17 19:04
 */
let excludePlcListWhenCollectFilterData: tPlc[] = []

export type tFilterDistinctValue = string | number

interface iFilterTypeData {
    values: tFilterDistinctValue[] | undefined,
    rows: PlainObject[] | undefined,
}

interface iDistinctDataInAllFilter {
    plc: tPlc,
    nodes: TableNode[],
}

export function useTableOptionDistinctFilter({hooks, methods, customConfig, filterState, config}: { hooks: tTableOptionHooks, methods: tTableOptionMethods, customConfig: iTableProConfig, filterState: tTableOptionFilter, config: tTableOptionConfig }) {

    const $dialog = useDialog()

    const {refs, onRef} = useRefs({check: PlcCheckRow})

    const freezeState = {
        getSourceFlatPlcList: null as null | (() => tPlc[]),
        baseTableRef: () => null as null | tPlTable,
    }

    const state = reactive({
        data: new Map() as Map<tPlc, iFilterTypeData | undefined>
    })

    const distinctFilterInAll = (() => {
        const displayState = reactive({
            distinctData: [] as iDistinctDataInAllFilter[],
        })
        const resetDistinctData = () => {
            displayState.distinctData = Array.from(state.data.entries()).reduce((prev, [plc, filterTypeData]) => {
                if (!!filterTypeData) {
                    const {rows, values} = filterTypeData
                    if (!!rows && rows.length > 0 && !!values && values.length > 0) {
                        prev.push({
                            plc, nodes: rows.map((r, ri) => createTableNode(r, {keyField: plc.props.field!, index: ri}))
                        })
                    }
                }
                return prev
            }, [] as iDistinctDataInAllFilter[])
        }
        const onClickButton = (e: MouseEvent, plc: tPlc) => {
            e.stopPropagation()
            clear(plc)
            displayState.distinctData = displayState.distinctData.filter(i => i.plc !== plc)
        }

        const pickInAllFilter = async (plc: tPlc) => {
            await open(plc)
            resetDistinctData()
        }

        const getDisplay = () => {
            resetDistinctData()
            return () => displayState.distinctData.map(({plc, nodes}, dIdx) => (
                <div key={dIdx} class="pl-table-pro-distinct-filter-item">
                    <div class="pl-table-pro-distinct-filter-item-button">
                        <PlButton icon="el-icon-minus" mode="text" status="error" size="mini" onClick={e => onClickButton(e, plc)}/>
                    </div>
                    <div class="pl-table-pro-distinct-filter-item-title">{plc.props.title}</div>
                    <span>包含</span>
                    <div class="pl-table-pro-distinct-filter-item-tags" onClick={() => pickInAllFilter(plc)}>
                        {nodes.map((node, nodeIndex) => (
                            <div key={nodeIndex}>
                                {renderBodyCell({node, plc, formEdit: false}).body}
                            </div>
                        ))}
                    </div>
                </div>
            ))
        }

        return {getDisplay}
    })();

    filterState.useState<Record<string, iFilterTypeData | undefined>>({
        seq: 4,
        key: 'distinct-filter',
        title: '去重筛选',
        applyCache: ({plcList, cacheData}) => {
            freezeState.getSourceFlatPlcList = () => plcList
            const map = new Map<tPlc, iFilterTypeData>()
            if (!!cacheData) {
                Object.entries(cacheData).forEach(([key, filterTypeData]) => {
                    const plc = flatPlcListMap.value[key]
                    if (!!plc && !!filterTypeData) {
                        map.set(plc, filterTypeData)
                    }
                })
            }
            state.data = map
        },
        getActiveFilterCount: (): number => {
            return Array.from(state.data.values()).reduce((prev, filterTypeData) => prev + (!filterTypeData || !filterTypeData.values || filterTypeData.values.length === 0 ? 0 : 1), 0)
        },
        getDisplay: distinctFilterInAll.getDisplay,
        clear: () => {
            state.data.clear()
        },
        getCache: () => {
            return Array.from(state.data.entries()).reduce((prev, [plc, fd]) => {
                const key = getPlcKey(plc)
                prev[key] = fd
                return prev
            }, {} as Record<string, iFilterTypeData | undefined>)
        },
    })

    const flatPlcListMap = computed((): Record<string, tPlc | undefined> => !freezeState.getSourceFlatPlcList ? {} : freezeState.getSourceFlatPlcList().reduce((prev, plc) => {
        prev[getPlcKey(plc)] = plc
        return prev
    }, {} as Record<string, tPlc | undefined>))

    hooks.onRefTable.use(table => {freezeState.baseTableRef = () => table})

    /*查询的时候被收集筛选条件*/
    hooks.onCollectFilterData.use((prev) => {
        let queries: iFilterQuery[] = Array.from(state.data.entries()).reduce((prev, [plc, filterTypeData]) => {
            if (!filterTypeData || !filterTypeData.values || filterTypeData.values.length == 0) {
                return prev
            }
            if (excludePlcListWhenCollectFilterData.indexOf(plc) > -1) {
                return prev
            }
            prev.push({field: plc.props.field!, operator: "in", value: filterTypeData.values})
            return prev
        }, [] as iFilterQuery[])


        return !!queries && queries.length > 0 ? [...prev, {queries: toArray(queries),}] : prev
    })

    const pick = async ({plc}: {
        plc: tPlc,
    }): Promise<void> => {

        const dfd = defer<void>()

        /*表格中已经存在的筛选参数，但是要排除当前列的去重查询参数*/
        excludePlcListWhenCollectFilterData.push(plc)
        const existFilterDataExcludePlcDistinctFilterValue = await hooks.onCollectFilterData.exec([])
        excludePlcListWhenCollectFilterData.splice(0, 1)

        /*表格中使用的排序参数*/
        const sortData = await hooks.onCollectSortData.exec([])

        const tableSlots = freezeState.baseTableRef()!.slots.default()
        const findVueNode = findRreactElement(tableSlots, ({props: {title, field}}) => title === plc.props.title && field === plc.props.field)
        // console.log({tableSlots, findVueNode,})

        const Content = designPage(() => {
            const tableOption = useObjectOption({
                ...customConfig,
                keyField: plc.props.field,
                sort: sortData,
                buttons: [],
                queryParams: {
                    distinctFields: [plc.props.field]
                },
                filterParam: existFilterDataExcludePlcDistinctFilterValue,
            })

            return () => <>
                <PlTablePro option={tableOption}>
                    <PlcCheckRow toggleOnClickRow ref={onRef.check} selected={state.data.get(plc)?.rows}/>
                    {findVueNode}
                </PlTablePro>
            </>
        })

        const dlgOpt: Partial<DialogServiceFormatOption> = {
            title: plc.props.title,
            status: null,
            render: () => <Content/>,
            dialogProps: {
                closeOnConfirm: false,
                width: '75vw',
                vertical: 'center',
                wrapperPadding: false,
            },
            confirmButton: true,
            cancelButton: true,
            onConfirm: () => {
                const checked = refs.check?.getSelected();
                (!!checked && checked.length > 0) ? state.data.set(plc, {
                    rows: checked,
                    values: checked.map((i) => i[plc.props.field!]),
                }) : state.data.delete(plc)


                onRef.check(null)
                dlgOpt.close!()
                dfd.resolve()
            },
            onCancel: async () => {
                onRef.check(null)
                dlgOpt.close!()
                dfd.reject('cancel')
            },
        }

        $dialog(dlgOpt)

        return dfd.promise
    }

    /**
     * 打开去重筛选弹框
     * @author  韦胜健
     * @date    2021/7/17 19:06
     */
    const open = async (plc: tPlc) => {
        /**
         * 获取去重筛选条件的值
         * @author  韦胜健
         * @date    2021/7/17 19:06
         */
        await pick({plc})
        await methods.pageMethods.reload()
    }

    const clear = (plc: tPlc) => {
        state.data.delete(plc)
        methods.pageMethods.reload()
    }

    return {
        open,
        clear,
    }
}

const createTableNode = (() => {
    const publicAttrs = {
        level: 0,
        parentRef: () => null as any,
        selfRef: () => null as any,
        children: [],
        expand: false,
        check: false,
        loading: false,
        loaded: false,
        childrenData: [],
        checkStatus: TreeNodeCheckStatus.uncheck,
        isCheckable: true,
        isLeaf: true,
        isVisible: true,
        isSummary: false,
        edit: false,
        validateErrors: null,
        openEdit: () => {},
        closeEdit: () => {},
        enableEdit: () => {},
        cancelEdit: () => {},
        validate: (() => {}) as any,
        saveEdit: (() => {}) as any,
    }
    return (row: PlainObject, {keyField, index}: { keyField: string, index: number }): TableNode => {
        return {
            ...publicAttrs,
            key: row[keyField],
            data: row,
            editRow: row,
            index,
        }
    }
})()
