import {definePlc} from "@/packages/table/plc-components/register";
import {PlcType, TableRenderData} from "@/packages/table/plc/plc";
import {reactive, set} from "@vue/composition-api";
import {TableNode} from "@/packages/table/table/TableNode";
import {PlcFixedType} from "@/packages/table/plc/plc-utils";

interface ExpandDataType {
    plc: PlcType,
    index: number,
    rowData: TableNode,
    fixed: PlcFixedType,
    isSummary: boolean
}

export default definePlc({
    name: 'plc-expand',
    props: {
        // custom
        toggleOnClickRow: {type: Boolean},                      // 是否在点击行的时候触发点击动作

        //standard
        autoFixedLeft: {default: true},
        order: {default: -9997},
        width: {default: 60},
        align: {default: 'center'},
        notFitVirtual: {type: Boolean, default: true},

        summary: {
            type: Function,
            default: function () {return null}
        },
        head: {
            type: Function,
            default: function (plc: PlcType) {
                return '展开'
            }
        },
        default: {
            type: Function,
            default: function (tableRenderData: TableRenderData) {
                const plcInstance = tableRenderData.plc.ctx as any
                return (
                    <pl-button icon="el-icon-arrow-down" mode="text" onClick={e => plcInstance.expandPlc.toggle(tableRenderData, e)}/>
                )
            }
        },
        renderAfterRow: {
            type: Function,
            default: function ({plc, index, rowData, fixed, isSummary}: ExpandDataType) {

                const ctx = plc.ctx as any

                if (!ctx.expandPlc.isExpand(rowData.key)) {
                    return null
                }

                if (!ctx.$scopedSlots.expand) {
                    console.log('缺少expand作用域插槽')
                    return null
                }

                return (
                    <tr>
                        <td>
                            <div>
                                自定义内容
                                {ctx.$scopedSlots.expand({
                                    plc,
                                    rowData: {
                                        ...rowData,
                                        isSummaryData: isSummary,
                                    },
                                    row: rowData.isEdit ? rowData.editRow : rowData.data
                                } as TableRenderData)}
                            </div>
                        </td>
                    </tr>
                )
            }
        },
    },
    setup() {

        const state = reactive({
            expandKeys: {} as { [key: string]: boolean },
        })

        const expandPlc = {
            state,
            isExpand: (key: string) => {
                return state.expandKeys[key]
            },
            toggle: (renderData: TableRenderData, e: MouseEvent) => {
                if (expandPlc.isExpand(renderData.rowData.key)) {
                    expandPlc.close(renderData.rowData.key)
                } else {
                    expandPlc.expand(renderData.rowData.key)
                }
            },
            expand: (key: string) => {
                if (state.expandKeys.hasOwnProperty(key)) {
                    state.expandKeys[key] = true
                } else {
                    set(state.expandKeys, key, true)
                }
            },
            close: (key: string) => {
                if (state.expandKeys.hasOwnProperty(key)) {
                    state.expandKeys[key] = false
                } else {
                    set(state.expandKeys, key, false)
                }
            }
        }

        return {
            expandPlc,
        }
    },
})