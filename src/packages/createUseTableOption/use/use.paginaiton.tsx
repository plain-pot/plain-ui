import {computed, nextTick, reactive} from "plain-design-composition";
import {tTableOptionConfig} from "../createUseTableOption.utils";
import PlPagination from "../../PlPagination";

import {tTableOptionHooks} from "./use.hooks";

export function useTableOptionPagination({tableState, config, hooks, onPrev, onNext, onJump, onSizeChange}: {
    tableState: { list: any[] },
    config: tTableOptionConfig,
    hooks: tTableOptionHooks,

    onPrev: () => void,
    onNext: () => void,
    onJump: (page: number) => void,
    onSizeChange: (size: number) => void,
}) {

    const pageState = reactive({
        page: 0,
        size: config.showRows || config.defaultShowRow,
        hasNext: false,
        total: null as null | number,
    })

    const update = (data: { page: number, size: number, hasNext: boolean, list: any[] }) => {
        pageState.page = data.page
        pageState.size = data.size
        pageState.hasNext = data.hasNext
        if (pageState.hasNext === false) {
            pageState.total = pageState.page * pageState.size + data.list.length
        }
    }

    const updateTotal = (total: null | number) => {
        pageState.total = total
    }

    const total = computed(() => {
        if (pageState.total != null) {
            return pageState.total
        }
        if (!pageState.hasNext) {
            return pageState.page * pageState.size + tableState.list.length
        } else {
            return (pageState.page + 1) * pageState.size + 1
        }
    })

    config.showRows != null && (() => {
        if (config.pageSizeOptions.indexOf(config.showRows) === -1) {
            config.pageSizeOptions = [config.showRows, ...config.pageSizeOptions]
        }
    })()

    /**
     * 如果页面设置了自动填充高度，这里设置第一次加载数据之前，
     * @author  韦胜健
     * @date    2021/8/3 10:13
     */
    config.fill && hooks.onInit.use(async () => {
        const [maxLevel, baseTableHeight] = await Promise.all([
            new Promise<number>((resolve) => {
                const eject = hooks.onCollectPlcData.use((plcData) => {
                    resolve(plcData.maxLevel)
                    eject()
                })
            }),
            new Promise<number>((resolve) => {
                const eject = hooks.onRefTable.use((baseTable) => {
                    /*nextTick 为适配plain-ui，否则此时 el.offsetHeight 高度为0*/
                    nextTick().then(() => resolve(baseTable.refs.el!.offsetHeight))
                    eject()
                })
            })
        ])
        const headHeight = config.headRowHeight * maxLevel
        const showRows = Math.floor((baseTableHeight - headHeight + 1) / config.bodyRowHeight)
        pageState.size = showRows
        config.showRows = showRows
        config.pageSizeOptions.indexOf(showRows) === -1 && (config.pageSizeOptions = [showRows, ...config.pageSizeOptions])
    })

    hooks.onTableRender.use(prev => [
        ...prev,
        {
            seq: 11,
            render: () => {
                return (
                    <div class="pl-table-pro-pagination">
                        <PlPagination
                            layout="loading,sizes,pager,prev,next,jumper"
                            size="mini"
                            pageSize={pageState.size}
                            currentPage={pageState.page + 1}
                            total={total.value}
                            limitJumpPageByTotalPage={false}
                            pageSizes={config.pageSizeOptions}

                            onJump={val => onJump(val - 1)}
                            onCurrentChange={val => onJump(val - 1)}
                            onSizeChange={onSizeChange}
                        />
                    </div>
                )
            }
        }
    ])

    return {pageState, update, updateTotal}
}

export type tTablePagination = ReturnType<typeof useTableOptionPagination>
