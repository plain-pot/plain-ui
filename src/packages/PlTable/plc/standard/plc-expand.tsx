import {TableNode} from "../../table/use/useTableNode";
import {SimpleObject} from "../../../../shims";
import {, computed, designComponent, onBeforeUnmount, reactive} from "plain-ui-composition";

import {injectPlainTable} from "../../index";
import PlDropdown from "../../../PlDropdown";
import PlButton from "../../../PlButton";
import PlDropdownMenu from "../../../PlDropdownMenu";
import PlDropdownOption from "../../../PlDropdownOption";
import {createPlcPropOptions, PlcEmitsOptions} from "../utils/plc.utils";
import {PlcScopeSlotsOptions} from "../utils/plc.scope-slots";
import {useExternalPlc} from "../core/useExternalPlc";

export default designComponent({
    props: {
        ...createPlcPropOptions({
            autoFixedLeft: true,
            order: -9997,
            width: 60,
            align: 'center',
            noPadding: true,
            hideInForm: true,
        }),
        toggleOnClickRow: {type: Boolean},                      // 是否在点击行的时候触发点击动作
        summaryExpand: {type: Boolean},
    },
    emits: PlcEmitsOptions,
    scopeSlots: {
        ...PlcScopeSlotsOptions,
        expand: (scope: { node: TableNode, row: SimpleObject }) => null,
    },
    setup({props, slots, scopeSlots, event}) {

        const table = injectPlainTable()
        /*告诉 table，不能启用虚拟滚动*/
        table.hooks.onDisabledVirtual.use(() => true)
        /*拦截渲染行的动作*/
        table.hooks.onRenderRow.use((scope) => {
            const {content, node, row} = scope
            if (!isExpand(node)) {return scope}
            return {
                ...scope,
                content: <>
                    {content}
                    <tr class="plt-row plt-expand-row" key={`expand_${node.key}`}>
                        <td class="plt-cell" rowSpan={1} colSpan={totalSpan.value}>
                            <div class="plt-expand-body" style={{width: `${table.plcData.value!.tableWidth - 20}px`}}>
                                {scopeSlots.expand({node, row})}
                            </div>
                        </td>
                    </tr>
                </>
            }
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
            table.event.on.onClickCell(toggle)
            onBeforeUnmount(() => table.event.off.onClickRow(toggle))
        }
        const methods = {
            expandAll: () => {
                state.expandKeys = {}
                Object.values(table.state.nodeMap).forEach(node => expand(node))
            },
            collapseAll: () => {
                state.expandKeys = {}
            },
        }

        const {refer, render} = useExternalPlc({
            props, scopeSlots, slots, event, defaultScopeSlots: {
                head: () => (
                    <PlDropdown
                        {...{placement: "bottom-center"}}
                        default={() => <PlButton icon="el-icon-menu" mode="text"/>}
                        popper={() => <PlDropdownMenu>
                            <PlDropdownOption label="全部展开" onClick={methods.expandAll} icon="el-icon-zoom-full"/>
                            <PlDropdownOption label="全部收起" onClick={methods.collapseAll} icon="el-icon-zoom-scale"/>
                        </PlDropdownMenu>}
                    />
                ),
                normal: ({node}) => {
                    return (!node.isSummary || props.summaryExpand) && (<PlButton{...{
                        icon: 'el-icon-arrow-down',
                        mode: 'text',
                        class: ([
                            'plc-expand-icon',
                            {'plc-expand-icon-active': isExpand(node)},
                        ]),
                        onClick: (e: MouseEvent) => toggle(node)
                    }}/>)
                }
            }
        })

        return {
            refer: {
                ...refer,
                methods,
            },
            render,
        }
    },
})
