import {computed, designComponent, onBeforeUnmount, PropType, reactive, watch} from "plain-design-composition";
import {createPlcPropOptions, PlcEmitsOptions} from "../PlTable/plc/utils/plc.utils";
import {PlcScopeSlotsOptions} from "../PlTable/plc/utils/plc.scope-slots";
import {injectPlainTable} from "../PlTable";
import {CheckboxStatus} from "../../utils/constant";
import {useExternalPlc} from "../PlTable/plc/core/useExternalPlc";
import PlCheckbox from "../PlCheckbox";
import PlDropdown from "../PlDropdown";
import PlDropdownMenu from "../PlDropdownMenu";
import PlDropdownOption from "../PlDropdownOption";

import {PlainObject} from "../createUseTableOption/createUseTableOption.utils";
import {TableNode} from "../PlTable/table/use/useTableNode";

export const PlcCheckRow = designComponent({
    name: 'plc-check-row',
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
        isCheckable: Function as PropType<(row: PlainObject) => boolean>,// 是否可选
        selected: {type: Array as PropType<PlainObject[]>},
    },
    scopeSlots: PlcScopeSlotsOptions,
    emits: PlcEmitsOptions,
    setup({props, slots, scopeSlots, event}) {

        const table = injectPlainTable()
        const keyField = table.props.keyField!
        if (!keyField) {throw new Error('PlTable need props.keyField when using PlcCheckRow.')}

        const state = reactive({
            selected: props.selected || [],
        })
        watch(() => props.selected, val => state.selected = val || [])

        const selectedKeys = computed(() => state.selected.map(item => item[keyField]))
        const status = computed(() => {
            if (state.selected.length === 0) return CheckboxStatus.uncheck
            if (table.flatNodes.value.every((item) => selectedKeys.value.indexOf(item.key) > -1)) {
                return CheckboxStatus.check
            } else {
                return CheckboxStatus.minus
            }
        })
        const isCheckable = (row: PlainObject) => !props.isCheckable || (props.isCheckable(row) !== false)
        const isCheck = (row: PlainObject) => selectedKeys.value.indexOf(row[keyField]) > -1
        const toggle = (row: PlainObject) => {
            const index = selectedKeys.value.indexOf(row[keyField])
            index > -1 ? state.selected.splice(index, 1) : state.selected.push(row)
        }
        const handler = {
            onClickCheckbox: (row: PlainObject) => isCheckable(row) && toggle(row),
        }
        const methods = {
            getSelected: () => state.selected,
            clearAll: () => state.selected = [],
            checkAll: () => {
                const availableSelectItems = table.flatNodes.value
                    .filter(node => isCheckable(node.data))
                    .map((node: TableNode) => node.data)

                if (state.selected.length === availableSelectItems.length) {
                    state.selected = []
                } else {
                    state.selected = availableSelectItems
                }
            },
            reverse: () => {
                state.selected = table.flatNodes.value
                    .filter(node => isCheckable(node.data) && selectedKeys.value.indexOf(node.key) === -1)
                    .map(i => i.data)
            },
        }
        if (props.toggleOnClickRow) {
            const onClickCell = (node: TableNode) => handler.onClickCheckbox(node.data)
            table.event.on.onClickCell(onClickCell)
            onBeforeUnmount(() => table.event.off.onClickCell(onClickCell))
        }

        const {refer, render} = useExternalPlc({
            props, scopeSlots, event, slots, defaultScopeSlots: {
                summary: () => null,
                normal: ({node}) => <PlCheckbox
                    customReadonly
                    modelValue={isCheck(node.data)}
                    onClick={() => handler.onClickCheckbox(node.data)}
                    disabled={!isCheckable(node.data)}
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
                isCheck,
                toggle,
                ...methods,
            },
            render,
        }
    },
})

export default PlcCheckRow
