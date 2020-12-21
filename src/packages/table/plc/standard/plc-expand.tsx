import {designPlc} from "../core/designPlc";
import {reactive, computed} from 'vue';
import {injectPlainTable} from "../../table";
import {TableNode} from "../../core/useTableNode";

export default designPlc({
    name: 'plc-expand',
    standardProps: {
        autoFixedLeft: {default: true},
        order: {default: -9997},
        width: {default: 60},
        align: {default: 'center'},
        notFitVirtual: {default: true},
        noPadding: {default: true},
    },
    externalProps: {
        toggleOnClickRow: {type: Boolean},                      // 是否在点击行的时候触发点击动作
    },
    render: {
        summary: () => null,
        head: () => '<>',
        default: (scope) => {
            // console.log(scope.refer.sayHello())
            return (<pl-button{...{
                icon: 'el-icon-arrow-down',
                mode: 'text',
                class: [
                    'plc-expand-icon',
                    // {'plc-expand-icon-active': plcInstance.expandPlc.isExpand(tableRenderData.rowData.key)},
                ],
            }}/>)
        }
    },
    setup(props) {
        /*const table = injectPlainTable()
        const state = reactive({
            expandKeys: {} as Record<string, boolean>,
        })
        const totalSpan = computed(() => !table.plcData.value ? 1 : table.plcData.value.flatPlcList.length)
        const isExpand = (node: TableNode) => state.expandKeys[node.key]
        const toggle = (node: TableNode) => isExpand(node) ? close(node) : expand(node)
        const expand = (node: TableNode) => state.expandKeys[node.key] = true
        const close = (node: TableNode) => state.expandKeys[node.key] = false
        return {
            totalSpan,
            isExpand,
            toggle,
        }*/
        return {
            sayHello: () => {
                console.log('hello')
            }
        }
    },
})