import {computed, designComponent, onBeforeUnmount, PropType, reactive} from "plain-ui-composition";
import {createPlcPropOptions, PlcEmitsOptions} from "../utils/plc.utils";
import {TableNode} from "../../table/use/useTableNode";
import {PlcScopeSlotsOptions} from "../utils/plc.scope-slots";
import {injectPlainTable} from "../../index";
import {PlainObject} from "../../../PlForm/form.validate";
import {useExternalPlc} from "../core/useExternalPlc";

import PlRadio from "../../../PlRadio";

export default designComponent({
    name: 'plc-pick',
    props: {
        ...createPlcPropOptions({
            autoFixedLeft: true,
            order: -9998,
            width: 40,
            align: 'center',
            noPadding: true,
            hideInForm: true,
            title: ' ',
        }),
        toggleOnClickRow: {type: Boolean},                      // 是否在点击行的时候触发点击动作
        isCheckable: Function as PropType<(node: TableNode) => boolean>,// 是否可选
        selected: {type: Object as PropType<PlainObject>},       // 已经选中的数据
    },
    scopeSlots: PlcScopeSlotsOptions,
    emits: PlcEmitsOptions,
    setup({props, slots, scopeSlots, event}) {
        const table = injectPlainTable()

        const state = reactive({
            selectRow: props.selected,
        })

        const selectKey = computed(() => {
            return !!state.selectRow && table.props.keyField ? state.selectRow[table.props.keyField] : null
        })
        const isCheckable = (node: TableNode) => !props.isCheckable || (props.isCheckable(node) !== false)
        const isCheck = (node: TableNode) => selectKey.value === node.key

        const toggle = (node: TableNode) => {
            if (selectKey.value !== node.key) {
                state.selectRow = node.data
            }
        }
        const handler = {
            onClickRadio: (node: TableNode) => isCheckable(node) && toggle(node),
        }
        const methods = {
            getSelected: () => state.selectRow,
            select: (key: string | number) => {
                state.selectRow = table.state.nodeMap[key]
            },
            clear: () => {
                state.selectRow = undefined
            }
        }
        if (props.toggleOnClickRow) {
            table.event.on.onClickCell(handler.onClickRadio)
            onBeforeUnmount(() => table.event.off.onClickCell(handler.onClickRadio))
        }

        const {refer, render} = useExternalPlc({
            props, scopeSlots, event, slots, defaultScopeSlots: {
                summary: () => null,
                normal: ({node}) => <PlRadio
                    customReadonly
                    modelValue={isCheck(node)}
                    onClick={() => handler.onClickRadio(node)}
                    disabled={!isCheckable(node)}
                />,
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
