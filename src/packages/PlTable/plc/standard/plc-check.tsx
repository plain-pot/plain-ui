import {TableNode} from "../../table/use/useTableNode";
import {CheckboxStatus} from "../../../../utils/constant";
import {computed, designComponent, getCurrentDesignInstance, onBeforeUnmount, PropType, reactive} from "plain-design-composition";
import {injectPlainTable} from "../../index";

import {PlCheckbox} from "../../../PlCheckbox";
import PlDropdown from "../../../PlDropdown";
import PlDropdownMenu from "../../../PlDropdownMenu";
import PlDropdownOption from "../../../PlDropdownOption";
import {createPlcPropOptions, PlcEmitsOptions} from "../utils/plc.utils";
import {PlcScopeSlotsOptions} from "../utils/plc.scope-slots";
import {useExternalPlc} from "../core/useExternalPlc";
import {toArray} from "plain-utils/utils/toArray";

export default designComponent({
    name: 'plc-check',
    props: {
        ...createPlcPropOptions({
            autoFixedLeft: true,
            order: -9998,
            width: 40,
            align: 'center',
            noPadding: true,
            hideInForm: true,
        }),
        toggleOnClickRow: {type: Boolean},                      // 是否在点击行的时候触发点击动作
        isCheckable: Function as PropType<(node: TableNode) => boolean>,// 是否可选
    },
    scopeSlots: PlcScopeSlotsOptions,
    emits: PlcEmitsOptions,
    setup({props, slots, scopeSlots, event}) {

        const table = injectPlainTable()
        const proxy = getCurrentDesignInstance().proxy!
        const state = reactive({
            selected: [] as TableNode[],
        })
        const selectedKeys = computed(() => {
            return state.selected.map(item => item.key)
        })
        const status = computed(() => {
            if (state.selected.length === 0) return CheckboxStatus.uncheck
            if (table.flatNodes.value.every((item) => selectedKeys.value.indexOf(item.key) > -1)) {
                return CheckboxStatus.check
            } else {
                return CheckboxStatus.minus
            }
        })
        const isCheckable = (node: TableNode) => !props.isCheckable || (props.isCheckable(node) !== false)
        const isCheck = (node: TableNode) => selectedKeys.value.indexOf(node.key) > -1
        const toggle = (node: TableNode) => {
            const index = selectedKeys.value.indexOf(node.key)
            index > -1 ? state.selected.splice(index, 1) : state.selected.push(node)
        }
        const handler = {
            onClickCheckbox: (node: TableNode) => isCheckable(node) && toggle(node),
        }
        const methods = {
            getSelected: () => state.selected,
            clearAll: () => state.selected = [],
            checkAll: () => {
                const availableSelectItems = table.flatNodes.value
                    .filter(isCheckable)
                    .map((item: TableNode) => item)
                if (state.selected.length === availableSelectItems.length) {
                    state.selected = []
                } else {
                    state.selected = availableSelectItems
                }
            },
            reverse: () => {
                state.selected = table.flatNodes.value
                    .filter(node => isCheckable(node) && selectedKeys.value.indexOf(node.key) === -1)
            },
            addSelected: (key: string | number | (string | number)[]) => {
                const keys = toArray(key)
                const nodes = keys.map(k => table.state.nodeMap[k]).filter(Boolean)
                state.selected = [...state.selected, ...nodes]
            },
            removeSelected: (key: string | number | (string | number)[]) => {
                const keys = toArray(key)
                state.selected = state.selected.filter(node => keys.indexOf(node.key) === -1)
            },
        }
        if (props.toggleOnClickRow) {
            table.event.on.onClickCell(handler.onClickCheckbox)
            onBeforeUnmount(() => table.event.off.onClickRow(handler.onClickCheckbox))
        }

        const {refer, render} = useExternalPlc({
            props, scopeSlots, event, slots, defaultScopeSlots: {
                summary: () => null,
                normal: ({node}) => <PlCheckbox
                    customReadonly
                    modelValue={isCheck(node)}
                    onClick={() => handler.onClickCheckbox(node)}
                    disabled={!isCheckable(node)}
                />,
                head: () => (
                    <PlDropdown
                        {...{placement: 'bottom-center'}}
                        v-slots={{
                            default: () => <PlCheckbox checkStatus={status.value}/>,
                            popper: () => <PlDropdownMenu>
                                <PlDropdownOption label="全部选中" icon="el-icon-check-bold" onClick={methods.checkAll}/>
                                <PlDropdownOption label="全部取消" icon="el-icon-close-bold" onClick={methods.clearAll}/>
                                <PlDropdownOption label="全部反选" icon="el-icon-refresh" onClick={methods.reverse}/>
                            </PlDropdownMenu>,
                        }}
                    />
                )
            }
        })

        return {
            refer: {
                ...refer,
                isCheckable,
                isCheck,
                toggle,
                ...methods,
            },
            render,
        }
    },
})
