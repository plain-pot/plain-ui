import {iTableOptionState, iTableProConfig, iTableProDefaultConfig, tTableOptionConfig} from "./createUseTableOption.utils";
import {useTableOptionPagination} from "./use/use.paginaiton";
import {useTableOptionMethods} from "./use/use.methods";
import {useTableOptionHooks} from "./use/use.hooks";
import {computed, onBeforeUnmount, reactive} from "plain-design-composition";
import {useTableOptionCheck} from "./use/check/use.check";
import {eTableProStatus, useTableOptionConfirm} from "./use/use.confirm";
import {useTableOptionCommand} from "./use/use.command";
import {useTableOptionButtons} from "./use/use.buttons";
import {useTableOptionSetting} from "./use/setting/use.setting";
import {useTableOptionFilter} from "./use/filter/use.filter";
import {useTableOptionBaseTable} from "./use/use.base-table";
import {useTableOptionPermit} from "./use/use.permit";
import {iFilterData} from "../PlFilter/FilterConfig";
import {useTableOptionSortState} from "./use/use.sort.state";
import {useTableOptionFilterState} from "./use/use.filter.state";
import {useTableOptionCache} from "./use/use.cache";
import {toArray} from "plain-utils/utils/toArray";
import {PlcIndex} from "../PlcIndex";

export function createUseTableOption<D = any>(defaultConfig: iTableProDefaultConfig) {
    return (customConfig: iTableProConfig<D>) => {

        const config: tTableOptionConfig = {
            ...defaultConfig,
            ...customConfig,
        }

        /*内部状态*/
        const tableState: iTableOptionState = reactive({
            list: [] as any[],
            editingWhenAddRow: false,
            selectRows: [],
            currentKey: null,
            tableGetter: () => null,
        })

        /*当前高亮节点*/
        const currentNode = computed(() => {
            const table = tableState.tableGetter()
            if (!table) {return null}
            if (!tableState.currentKey) {return }
            return table.getNode(tableState.currentKey)
        })

        /*钩子函数*/
        const hooks = useTableOptionHooks({config})

        /*指令（键盘快捷键）*/
        const command = useTableOptionCommand({hooks})

        /*确认动作*/
        const confirm = useTableOptionConfirm({hooks})

        /*多选*/
        const check = useTableOptionCheck({config, hooks, confirm, command})

        /*分页*/
        const pagination = useTableOptionPagination({
            tableState,
            config,
            hooks,
            onPrev: () => pageMethods.prev(),
            onNext: () => pageMethods.next(),
            onJump: (page) => pageMethods.jump(page),
            onSizeChange: size => pageMethods.reload({size}),
        })

        /*排序的数据*/
        const sortData = computed(() => hooks.onCollectSortData.exec(!!config.sort ? [] : []))

        /*权限控制*/
        const permit = useTableOptionPermit({config, hooks})

        /*方法*/
        const methods = useTableOptionMethods({config, pagination, hooks, tableState, currentNode, check, confirm, getSortData: () => sortData.value})

        /*结构的方法*/
        const {pageMethods, editMethods} = methods

        const cache = useTableOptionCache({config, hooks, reload: () => pageMethods.reload()})

        /*排序数据管理*/
        const sortState = useTableOptionSortState({methods, hooks, cache})

        const filterState = useTableOptionFilterState({hooks, methods, cache})

        /*设置弹框*/
        const setting = useTableOptionSetting({hooks, methods, sortState, filterState, cache, check, tableState})

        /*按钮*/
        const buttons = useTableOptionButtons({hooks, methods, command, setting, config, permit, confirm})

        /*筛选查询*/
        const filter = useTableOptionFilter({hooks, methods, customConfig, sortState, filterState, setting, config})

        /*基础表格渲染*/
        useTableOptionBaseTable({config, hooks, pagination, tableState, sortState, cache})

        /*执行初始化逻辑，init一定要放在所有hook之后执行*/
        const init = (() => {
            const state = reactive({isInitialized: false,})
            const promise = Promise.all(hooks.onInit.getListeners().map(i => i(undefined))).finally(() => state.isInitialized = true)
            hooks.onBeginLoad.use(async () => {await promise})
            hooks.onLoading.use((prev) => !state.isInitialized ? true : prev)
            return {state, promise}
        })()

        /*查询完毕之后更新列表数据*/
        hooks.onLoaded.use(rows => {
            tableState.list = rows
            methods.editMethods.selectCurrent(rows.length > 0 ? rows[0][config.keyField] : null)
        })
        hooks.onClickCell.use((selectNode) => {
            if (tableState.currentKey === selectNode.key) {return}
            methods.editMethods.selectCurrent(selectNode.key)
        })
        /*获取base table的引用*/
        hooks.onRefTable.use(table => tableState.tableGetter = (() => table) as any)
        /*config.sort作为默认的排序参数*/
        hooks.onCollectSortData.use(prev => {
            if (!config.sort) {return prev}
            return [...prev, ...toArray(config.sort)]
        })
        /*收集筛选参数*/
        hooks.onCollectFilterData.use(async prev => {
            if (!config.filterParam) {return prev}
            const filterParam = toArray(typeof config.filterParam === "function" ? await config.filterParam() : config.filterParam).filter(Boolean) as iFilterData[]
            if (!!filterParam) {
                return [...prev, ...filterParam]
            }
            return prev
        })
        /*收集config.render中的列信息*/
        hooks.onColumns.use((prev) => {
            return <>
                <PlcIndex start={pagination.pageState.page * pagination.pageState.size}/>
                {prev}
                {!!config.render && config.render()}
            </>
        })

        const ret = {
            customConfig,
            tableState,
            config,
            confirm,
            pagination,
            pageMethods,
            editMethods,
            hooks,
            currentNode,
            check,
            buttons,
            filter,
            init,
            cache,
        }

        const {parentOption, parentMap} = config as { parentOption?: (typeof ret), parentMap?: Record<string, string> }
        if (!!parentOption && parentMap) {
            /*自己不加载数据，等父表选中数据之后再加载*/
            config.loadOnStart = false

            /*父表切换选中行之后，重新加载数据*/
            onBeforeUnmount(parentOption.hooks.onSelectChange.use(async (selectNode) => {
                const noParent = !selectNode || (() => {
                    const {data} = selectNode
                    return Object.values(parentMap).every(parentKey => data[parentKey] == null)
                })()

                if (noParent) {
                    /*父表没有值，则清空行数据*/
                    let rows: any[] = []
                    rows = await hooks.onAfterLoad.exec(rows)
                    rows = await hooks.onLoaded.exec(rows)
                    tableState.list = rows
                    pagination.updateTotal(null)
                    pagination.update({page: 1, size: pagination.pageState.size, hasNext: false, list: rows})
                } else {
                    methods.pageMethods.reload()
                }
            }))
            /*子表查询之前，带上父表的查询参数*/
            onBeforeUnmount(hooks.onCollectFilterData.use(prev => {
                return [
                    ...prev,
                    {
                        queries: Object.entries(parentMap).map(([childKey, parentKey]) => ({
                            field: childKey,
                            value: parentOption.currentNode.value!.data[parentKey],
                            operator: '='
                        }))
                    }
                ]
            }))
            /*子表新建数据的时候，从父表拿到关联字段的值*/
            onBeforeUnmount(hooks.onHandleNewRow.use(row => {
                const {value: parentNode} = parentOption.currentNode
                if (!parentNode) {
                    console.log(parentOption)
                    throw new Error('TableOption: parent option has no current node when create new record in child option!')
                }
                const {data} = parentNode
                Object.entries(parentMap).forEach(([childKey, parentKey]) => {
                    row[childKey] = data[parentKey]
                })
            }))

            onBeforeUnmount(hooks.onGetEnable.use((enable) => {
                const parents: (typeof ret)[] = []
                let option = parentOption
                while (!!option) {
                    parents.push(option)
                    option = option.config.parentOption as any
                }
                if (parents.some(i => i.confirm.state.status !== eTableProStatus.normal)) {
                    enable.insert = false
                    enable.update = false
                    enable.delete = false
                } else {
                    return
                }
            }))
        }

        return ret
    }
}

export type tUseTableOption = ReturnType<typeof createUseTableOption>

export type tTableOption = ReturnType<tUseTableOption>

export default createUseTableOption
