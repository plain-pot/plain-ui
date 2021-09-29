import {eTableOptionSettingView, iTableOptionSettingInnerUser} from "./use.setting.utils";
import {computed, reactive} from "plain-design-composition";
import {FilterConfig, iFilterOption, iFilterQuery, iFilterTargetOption} from "../../../PlFilter/FilterConfig";
import PlButton from "../../../PlButton";
import PlDropdown from "../../../PlDropdown";
import {tTableOptionHooks} from "../use.hooks";
import {tPlc} from "../../../PlTable/plc/utils/plc.type";
import PlIcon from "../../../PlIcon";
import PlDropdownMenu from "../../../PlDropdownMenu";
import PlDropdownOption from "../../../PlDropdownOption";
import {createFilterOptionByPlc} from "../filter/use.filter.utils";
import PlFilter from "../../../PlFilter";
import {tTableOptionMethods} from "../use.methods";
import './use.setting.filter.senior.scss'
import PlCheckbox from "../../../PlCheckbox";
import PlInput from "../../../PlInput";
import PlTable from "../../../PlTable";
import {PlcIndex} from "../../../PlcIndex";
import {Plc} from "../../../Plc";
import {tTableOptionCache} from "../use.cache";
import {tTableOptionFilter} from "../use.filter.state";
import {toArray} from "plain-utils/utils/toArray";

interface iSeniorFilterData extends iFilterOption {
    id: string
}

interface iSeniorFilterTargetData extends Omit<iFilterTargetOption, 'option'> {
    option: iSeniorFilterData,
}

interface iSeniorFilterCacheData {
    data: Omit<iSeniorFilterData, 'filterConfig' | 'plc'>[],
    expression: null | string,
    isCustomExpression: boolean,
}

const ExpressionJoins = ['&&', '||', 'and', 'or', '并且', '或者']

export function useTableOptionSettingSeniorFilter(
    {
        useTableOptionSettingInner,
        hooks,
        getSourceFlatPlcList,
        methods,
        cache,
        filterState,
    }: {
        useTableOptionSettingInner: iTableOptionSettingInnerUser,
        hooks: tTableOptionHooks,
        getSourceFlatPlcList: () => tPlc[],
        methods: tTableOptionMethods,
        cache: tTableOptionCache,
        filterState: tTableOptionFilter,
    }) {

    const DEFAULT_EXPRESSION_JOIN = '或者'

    const utils = {
        nextId: (() => {
            let count = 1
            return () => `F_${count++}`
        })(),
        resetOperator: () => {
            edit.state.expression = edit.defaultExpression.value
        },
        copyData: (data: iSeniorFilterData[]) => {
            return data.map(i => ({...i}))
        },
        createState: () => {
            const state = reactive({
                data: [] as iSeniorFilterData[],
                expression: null as null | string,
                isCustomExpression: false,
            })
            const ftoArr = computed(() => state.data.map(i => FilterConfig.getTargetOption(i)).filter(Boolean) as iSeniorFilterTargetData[])

            const defaultExpression = computed(() => state.data.map(i => i.id).join(` ${DEFAULT_EXPRESSION_JOIN} `))
            return {
                state, ftoArr, defaultExpression,
            }
        },
    }

    /**
     * 查询的时候的数据
     * @author  韦胜健
     * @date    2021/7/22 21:05
     */
    const query = (() => {
        const {state, ftoArr, defaultExpression} = utils.createState()

        const apply = () => {
            state.data = utils.copyData(edit.state.data)
            state.expression = edit.state.expression
            state.isCustomExpression = edit.state.isCustomExpression
            methods.pageMethods.reload()
        }

        return {
            state,
            defaultExpression,
            apply,
            ftoArr,
        }
    })()

    /**
     * 编辑的时候的数据
     * @author  韦胜健
     * @date    2021/7/22 21:05
     */
    const edit = (() => {
        const {state, ftoArr, defaultExpression} = utils.createState()

        const add = (plc: tPlc) => {
            const id = utils.nextId()

            if (state.data.length === 0) {
                state.expression = id
            } else {
                state.expression += ` ${DEFAULT_EXPRESSION_JOIN} ${id}`
            }

            state.data.push({id, ...createFilterOptionByPlc(plc)})
        }

        const remove = (fto: iFilterTargetOption, index: number) => {
            const isMatchDefaultOperator = !!state.expression && state.expression.trim() === defaultExpression.value
            state.data.splice(index, 1)
            if (isMatchDefaultOperator) {state.expression = defaultExpression.value}
        }

        const clear = () => {
            state.data = []
            state.expression = null
            query.apply()
        }

        return {
            state,
            ftoArr,
            defaultExpression,
            add,
            remove,
            clear,
        }
    })()

    cache.registry<iSeniorFilterCacheData>({
        cacheKey: 'filter-state-senior',
        applyCache: ({plcList, cacheData}) => {
            query.state.isCustomExpression = !cacheData ? false : cacheData.isCustomExpression
            query.state.expression = !cacheData ? null : cacheData.expression
            query.state.data = !cacheData ? [] : cacheData.data.map(item => {
                const plc = plcList.find(i => i.props.title === item.label && i.props.field === item.field)
                if (!plc) {return null}
                return {
                    ...item,
                    filterConfig: plc.props.filterConfig,
                    plc: plc,
                }
            }).filter(Boolean) as iSeniorFilterData[]
        },
        getCache: () => {
            return {
                expression: query.state.expression,
                data: query.state.data.map(({filterConfig, plc, ...left}) => left),
                isCustomExpression: query.state.isCustomExpression,
            }
        },
    })

    useTableOptionSettingInner({
        key: eTableOptionSettingView.seniorFilter,
        title: '高级筛选',
        seq: 1,
        beforeOpen: () => {
            edit.state.data = utils.copyData(query.state.data)
            edit.state.expression = query.state.expression
            edit.state.isCustomExpression = query.state.isCustomExpression
        },
        render: () => <>
            <div class="pl-table-pro-setting-senior-filter">
                <div class="pl-table-pro-setting-senior-filter-button">
                    <div>
                        <PlButton label="应用" onClick={query.apply}/>
                        <PlDropdown v-slots={{
                            reference: ({open}) => (
                                <PlButton style={{marginBottom: '16px'}}>
                                    <span>新增筛选</span>
                                    <PlIcon icon={'el-icon-arrow-down'} style={{transition: 'transform 200ms linear', transform: `rotateX(${open ? 180 : 0}deg)`,}}/>
                                </PlButton>
                            ),
                            popper: () => <PlDropdownMenu>
                                {getSourceFlatPlcList().filter(i => !!i.props.field && !!i.props.title).map((plc, index) => (
                                    <PlDropdownOption label={plc.props.title} key={index} onClick={(e) => {
                                        e.stopPropagation()
                                        e.preventDefault()
                                        edit.add(plc)
                                    }}/>
                                ))}
                            </PlDropdownMenu>
                        }}/>
                        <PlCheckbox label="自定义查询表达式" v-model={edit.state.isCustomExpression} onChange={utils.resetOperator}/>
                    </div>
                    <PlButton label="清空" mode="stroke" status="error" onClick={edit.clear}/>
                </div>
                <div class="pl-table-pro-setting-senior-filter-list">

                    <PlTable data={edit.ftoArr.value} showRows={Math.max(5, edit.ftoArr.value.length)}>
                        <PlcIndex/>
                        <Plc title="编号" width="80" align="center" v-slots={{normal: ({row}) => row.option.id}}/>
                        <Plc title="标题" width="100" align="center" v-slots={{normal: ({row}) => row.option.label}}/>
                        <Plc title="查询条件" fit v-slots={{
                            normal: ({node}) => (
                                <PlFilter
                                    fto={node.data as any}
                                    key={node.data.filter.filterName + node.data.handler.handlerName}
                                    hideSearchButton
                                    block
                                />
                            )
                        }}/>
                        <Plc width="50" v-slots={{
                            normal: ({node}) => <PlButton label="删除" mode="text" status="error" onClick={() => edit.remove(node.data as any, node.index)}/>
                        }}/>
                    </PlTable>
                </div>
                <div>
                    <h3>自定义表达式 :</h3>
                    <PlInput textarea v-model={edit.state.expression} block disabled={!edit.state.isCustomExpression}/>
                </div>
            </div>
        </>
    })

    hooks.onCollectFilterData.use((prev) => {
        if (query.ftoArr.value.length === 0) {return prev}
        let expression = !query.state.isCustomExpression || !query.state.expression ? query.defaultExpression.value : query.state.expression
        /*处理空格*/
        expression = expression.replace(/\s*(\|\||&&|或者|并且)\s*/gi, ' $1 ').replace(/\s+/, ' ')

        const queries: iFilterQuery[] = []
        const id2Senior = query.ftoArr.value.reduce((prev, item) => {
            prev[item.option.id] = item
            return prev
        }, {} as Record<string, iSeniorFilterTargetData | undefined>)
        expression = expression.replace(/\w+/g, (input) => {

            if (ExpressionJoins.indexOf(input) > -1) {return input}

            const senior = id2Senior[input]
            if (!senior) {return input}

            let itemQueries = FilterConfig.formatToQuery(senior)
            if (!itemQueries) {return input}

            if (!Array.isArray(itemQueries)) {
                itemQueries.id = input
                queries.push(itemQueries)
                return input
            }
            if (itemQueries.length === 1) {
                itemQueries[0].id = input
                queries.push(...itemQueries)
                return input
            }

            const itemQueryIds: string[] = []
            toArray(itemQueries).forEach((i, idx) => {
                const itemId = `${input}-${idx + 1}`
                itemQueryIds.push(itemId)
                queries.push({
                    ...i,
                    id: itemId,
                })
            })

            return `(${itemQueryIds.join(' 并且 ')})`
        })

        if (queries.length === 0) {return prev}
        return [...prev, {queries, expression: expression}]
    })

    /*只显示激活的筛选条件*/
    filterState.useState<any>({
        seq: Infinity,
        key: 'senior-filter',
        title: '高级查询',
        applyCache: () => null,
        getCache: () => null,
        getDisplay: () => () => null,
        clear: () => null,
        getActiveFilterCount: () => query.state.data.length
    })
}
