import {designComponent} from "../../use/designComponent";
import {useSlots} from "../../use/useSlots";
import './table.scss'
import {TableHoverPart, TableProps} from "./table.utils";
import PlcCollector from './plc-core/plc-collector'
import {useRefs} from "../../use/useRefs";
import {computed, onMounted, reactive} from 'vue';
import {formatPlc} from "./plc-format/formatPlc";
import {useNumber} from "../../use/useNumber";
import {PltHead} from "./table-core/head/head";
import {TableNode, useTableNode} from "./table-core/node";
import {SimpleObject} from "../../shims";
import {PltBody} from "./table-core/body/body";
import {PlainScroll} from "../scroll/scroll";
import {hasClass} from "plain-utils/dom/hasClass";

const Table = designComponent({
    name: 'pl-table',
    props: {
        ...TableProps,
    },
    provideRefer: true,
    emits: {
        onScrollLeft: (e: Event, part: TableHoverPart) => true,
        onUpdateData: (data?: SimpleObject[]) => true,
        onClickRow: (node: TableNode, e: MouseEvent) => true,
        onDblclickRow: (node: TableNode, e: MouseEvent) => true,
        onClickCell: (node: TableNode, e: MouseEvent) => true,
        onDblclickCell: (node: TableNode, e: MouseEvent) => true,
    },
    setup({props, event: {emit, on}}) {

        /*---------------------------------------base-------------------------------------------*/

        const {slots} = useSlots()
        const {refs} = useRefs({
            collector: PlcCollector,
            el: HTMLDivElement,
        })

        /*---------------------------------------state-------------------------------------------*/

        const freeState = {
            hoverPart: null as null | TableHoverPart,
        }
        const state = reactive({
            tableWidth: null as null | number,                  // mounted的时候表格的宽度
            current: null as null | TableNode,                  // 当前选中的节点
        })
        const {numberState} = useNumber(props, ['bodyRowHeight', 'headRowHeight'])

        // todo getValidate
        const node = useTableNode({props, event: {emit}, getValidate: () => {return {} as any}})

        /*---------------------------------------computed-------------------------------------------*/

        /**
         * 表体渲染所需要的的列信息
         * @author  韦胜健
         * @date    2020/8/13 22:31
         */
        const bodyPlcList = computed(() => {
            if (!plcData.value) return []
            return plcData.value.flatPlcList
        })

        /**
         * 总的列宽度
         * @author  韦胜健
         * @date    2020/8/13 22:33
         */
        const totalContentWidth = computed(() => {
            if (!bodyPlcList.value) return
            return bodyPlcList.value.reduce((ret, plc) => {
                return ret + (plc.props.width as number)
            }, 0)
        })

        /**
         * 收集得到的列数据
         * @author  韦胜健
         * @date    2020/12/17 16:38
         */
        const plcData = computed(() => {
            if (!state.tableWidth) {
                return null
            }
            return formatPlc({
                plcList: refs.collector!.children,
                config: props.config,
                tableWidth: state.tableWidth!,
                bodyRowHeight: numberState.bodyRowHeight,
                headRowHeight: numberState.headRowHeight,
            })
        })

        /**
         * 是否可以开启表格的虚拟滚动功能
         * @author  韦胜健
         * @date    2020/8/13 22:35
         */
        const isDisabledVirtualScroll = computed(() => {
            if (!plcData.value) {
                return true
            }
            if (plcData.value.notFitVirtualPlcList.length > 0) {
                return true
            }
            return !props.virtual
        })

        /*---------------------------------------utils-------------------------------------------*/

        /**
         * 表头表体横向联动滚动
         * @author  韦胜健
         * @date    2020/12/17 15:07
         */
        const bindScroll = ({part, update,}: { part: TableHoverPart, update: (scrollLeft: number, part: TableHoverPart) => void, }) => {
            on.onScrollLeft((e, part) => update((e.target as HTMLElement).scrollLeft, part))
            return {
                onMouseenter: () => freeState.hoverPart = part,
                onScroll: (e: Event) => freeState.hoverPart === part && emit.onScrollLeft(e, part)
            }
        }

        /*---------------------------------------handler-------------------------------------------*/
        const handler = {
            headMousewheel: (e: MouseEvent, scroll: PlainScroll) => {
                e.preventDefault();

                const {deltaX, deltaY} = e as any
                // @ts-ignore
                emit.scrollLeft({target: {scrollLeft: scroll.state.wrapperScrollLeft + (deltaX || deltaY)}}, null)
            },
            clickRow: (e: MouseEvent, node: TableNode) => {
                methods.setCurrent(node)
                emit.onClickRow(node, e)
                if (hasClass(e.target as HTMLElement, ['plt-inner-cell', 'plt-cell'])) {
                    emit.onClickCell(node, e)
                }
            },
            dblclickRow: (e: MouseEvent, node: TableNode) => {
                emit.onDblclickRow(node, e)
                if (hasClass(e.target as HTMLElement, ['plt-inner-cell', 'plt-cell'])) {
                    emit.onDblclickCell(node, e)
                }
            },
        }

        /*---------------------------------------methods-------------------------------------------*/

        const methods = {
            setCurrent: (keyOrNode: string | TableNode | null) => {
                state.current = !keyOrNode ? null : node.methods.getNode(keyOrNode)
            },
            getCurrent: () => {
                return state.current
            }
        }

        /*---------------------------------------lifecycle-------------------------------------------*/

        onMounted(() => {
            state.tableWidth = refs.el.offsetWidth
        })

        const refer = reactive({
            props,
            numberState,
            plcData,
            totalContentWidth,
            bodyPlcList,
            node,
            bindScroll,
            isDisabledVirtualScroll,
            handler,
            methods,
            state,
        })

        return {
            refer,
            render: () => {
                return (
                    <div class="pl-table" ref="el">
                        <PlcCollector ref="collector">{slots.default()}</PlcCollector>
                        {!!refer.plcData && (
                            <>
                                <PltHead/>
                                <PltBody/>
                            </>
                        )}
                    </div>
                )
            }
        }
    },
})

export function injectTable() {
    return Table.use.inject()
}

export default Table