import {designPlc} from "../core/designPlc";
import {computed, onBeforeUnmount, PropType, reactive} from 'vue';
import {TableNode} from "../../core/useTableNode";
import {injectPlainTable} from "../../table";
import {CheckboxStatus} from "../../../../utils/constant";
import {toArray} from "../../../../utils/toArray";

export default designPlc({
    name: 'plc-check',
    standardProps: {
        autoFixedLeft: {default: true},
        order: {default: -9998},
        width: {default: 40},
        align: {default: 'center'},
        noPadding: {default: true},
    },
    externalProps: {
        toggleOnClickRow: {type: Boolean},                      // 是否在点击行的时候触发点击动作
        isCheckable: Function as PropType<(node: TableNode) => boolean>,// 是否可选
    },
    setup(props, ctx) {
        const table = injectPlainTable()
        const proxy = ctx.proxy!
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
            onClickHeadCheckbox: () => {
                if (status.value === CheckboxStatus.check) {
                    state.selected = []
                } else {
                    const availableSelectItems = table.flatNodes.value
                        .filter(isCheckable)
                        .map((item: TableNode) => item)
                    if (state.selected.length === availableSelectItems.length) {
                        state.selected = []
                    } else {
                        state.selected = availableSelectItems
                    }
                }
            },
        }
        const methods = {
            getSelected: () => state.selected,
            clearSelected: () => state.selected = [],
            addSelected: (key: string | string[]) => {
                const keys = toArray(key)
                const nodes = keys.map(k => table.state.nodeMap[k]).filter(Boolean)
                state.selected = [...state.selected, ...nodes]
            },
            removeSelected: (key: string | string[]) => {
                const keys = toArray(key)
                state.selected = state.selected.filter(node => keys.indexOf(node.key) === -1)
            },
        }
        if (props.toggleOnClickRow) {
            table.event.on.onClickCell(handler.onClickCheckbox)
            onBeforeUnmount(() => table.event.off.onClickRow(handler.onClickCheckbox))
        }
        Object.assign(proxy, methods)
        return {
            state,
            selectedKeys,
            status,
            handler,
            isCheck,
            isCheckable,
        }
    },
}, {
    summary: () => null,
    default: ({refer, node}) => <pl-checkbox
        customReadonly
        modelValue={refer.isCheck(node)}
        onClick={() => refer.handler.onClickCheckbox(node)}
        disabled={!refer.isCheckable(node)}
    />,
    head: ({refer}) => <pl-checkbox
        checkStatus={refer.status.value}
        onClick={refer.handler.onClickHeadCheckbox}
    />
})