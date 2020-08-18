import {definePlc} from "@/packages/table/plc-components/register";
import {PlcType, TableRenderData} from "@/packages/table/plc/plc";
import {computed, onUnmounted, reactive} from "@vue/composition-api";
import {TableNode} from "@/packages/table/table/TableNode";
import {injectTable} from "@/packages/table/table/table";

export default definePlc({
    name: 'plc-check',

    props: {
        // custom
        toggleOnClickRow: {type: Boolean},                      // 是否在点击行的时候触发点击动作

        //standard
        autoFixedLeft: {default: true},
        order: {default: -9998},
        width: {default: 40},
        align: {default: 'center'},
        summary: {
            type: Function,
            default: function () {return null}
        },
        head: {
            type: Function,
            default: function (plc: PlcType) {
                const plcInstance = plc.ctx as any
                return <pl-checkbox-indeterminate
                    size={'normal'}
                    status={plcInstance.checkPlc.status.value}
                    onClick={plcInstance.checkPlc.handler.onClickHeadCheckbox}/>
            }
        },
        default: {
            type: Function,
            default: function ({rowData, plc}: TableRenderData) {
                const plcInstance = plc.ctx as any
                return (
                    <pl-checkbox
                        readonly
                        value={plcInstance.checkPlc.utils.isChecked(rowData)}
                        size={'normal'}
                        onClick={() => plcInstance.checkPlc.handler.onClickCheckbox(rowData)}/>
                )
            }
        },
    },
    setup(props) {

        const table = injectTable()

        // @ts-ignore
        const {toggleOnClickRow} = props as { keyField: string, toggleOnClickRow: boolean }

        const state = reactive({
            selected: [] as TableNode[],
        })
        const selectedKeys = computed(() => {
            return state.selected.map(item => item.key)
        })
        const status = computed(() => {
            if (state.selected.length === 0) return 'uncheck'
            if (table.formatFlatTableData.value.every((item: TableNode) => selectedKeys.value.indexOf(item.key) > -1)) {
                return 'check'
            } else {
                return 'minus'
            }
        })

        const utils = {
            isChecked: (node: TableNode) => selectedKeys.value.indexOf(node.key) > -1,
            toggle: (node: TableNode) => {
                const index = selectedKeys.value.indexOf(node.key)
                if (index > -1) {
                    state.selected.splice(index, 1)
                } else {
                    state.selected.push(node)
                }
            }
        }

        const handler = {
            onClickCheckbox: (node: TableNode) => {
                // 因为table中对点击的target做了判断，点击checkbox的时候，不是plt-inner-cell，所以不会触发onClickCell事件
                /*if (toggleOnClickRow) {
                    return
                }*/
                utils.toggle(node)
            },
            onClickHeadCheckbox: () => {
                state.selected = status.value === 'check' ? [] : table.formatFlatTableData.value.map((item: TableNode) => item)
            },
            onClickCell: (node: TableNode, e: MouseEvent) => {
                utils.toggle(node)
            }
        }

        const methods = {
            getSelected: () => {
                return state.selected
            },
        }

        const checkPlc = {
            state,
            selectedKeys,
            status,
            utils,
            handler,
        }

        if (!!toggleOnClickRow) {
            table.on.clickCell(handler.onClickCell)
            onUnmounted(() => table.off.clickCell(handler.onClickCell))
        }

        return {
            ...methods,
            checkPlc,
        }
    },
})