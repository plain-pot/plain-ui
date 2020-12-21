import {designPlc} from "../core/designPlc";
import {reactive, computed, ComputedRef, PropType, onBeforeUnmount} from 'vue';
import {injectPlainTable} from "../../table";
import {TableNode} from "../../core/useTableNode";
import {SimpleObject, VNodeChild} from "../../../../shims";
import {Plc, TableRenderScope} from "../core/plc.type";
import {useScopedSlots} from "../../../../use/useScopedSlots";

interface ExpandRefer {
    isExpand: (node: TableNode) => boolean,
    totalSpan: ComputedRef<number>,
    state: { expandKeys: Record<string, boolean> },
    toggle: (node: TableNode) => void,
    scopedSlots: {
        expand: ((scope: TableRenderScope, vnode: VNodeChild) => VNodeChild)
    },
}

export default designPlc(
    {
        name: 'plc-expand',
        standardProps: {
            autoFixedLeft: {default: true},
            order: {default: -9997},
            width: {default: 60},
            align: {default: 'center'},
            notFitVirtual: {default: true},
            noPadding: {default: true},
            renderAfterRow: {
                default: ({plc, node, row}: { plc: Plc & { externalRefer: () => ExpandRefer }, node: TableNode, row: SimpleObject }) => {
                    const refer = plc.externalRefer()
                    if (!refer.isExpand(node)) {return null}
                    return (
                        <tr class="plt-row plt-expand-row">
                            <td class="plt-cell" rowspan={1} colspan={refer.totalSpan.value}>
                                {refer.scopedSlots.expand({node, plc, row})}
                            </td>
                        </tr>
                    )
                }
            },
        },
        externalProps: {
            toggleOnClickRow: {type: Boolean},                      // 是否在点击行的时候触发点击动作
            summaryExpand: {type: Boolean},                         // 合计行是否可以展开
        },
        setup: (props) => {
            const table = injectPlainTable()
            const {scopedSlots} = useScopedSlots({
                expand: {node: Object as PropType<TableNode>, plc: Object as PropType<Plc>, row: Object as PropType<SimpleObject>},
            })
            const state = reactive({
                expandKeys: {} as Record<string, boolean>,
            })
            const totalSpan = computed(() => !table.plcData.value ? 1 : table.plcData.value.flatPlcList.length)
            const isExpand = (node: TableNode) => state.expandKeys[node.key]
            const toggle = (node: TableNode) => isExpand(node) ? close(node) : expand(node)
            const expand = (node: TableNode) => state.expandKeys[node.key] = true
            const close = (node: TableNode) => state.expandKeys[node.key] = false
            if (props.toggleOnClickRow) {
                table.event.on.onClickRow(toggle)
                onBeforeUnmount(() => table.event.off.onClickRow(toggle))
            }
            const refer: ExpandRefer = {
                state,
                totalSpan,
                isExpand,
                toggle,
                scopedSlots,
            }
            return refer
        }
    },
    {
        head: () => '',
        default: ({refer, node, props}) => {
            return (!node.isSummary || props.summaryExpand) && (<pl-button{...{
                icon: 'el-icon-arrow-down',
                mode: 'text',
                class: [
                    'plc-expand-icon',
                    {'plc-expand-icon-active': refer.isExpand(node)},
                ],
                onClick: (e: MouseEvent) => refer.toggle(node)
            }}/>)
        }
    },
)