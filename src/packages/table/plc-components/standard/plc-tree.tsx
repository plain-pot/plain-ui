import {definePlc} from "@/packages/table/plc-components/register";
import {PlcType, TableRenderData} from "@/packages/table/plc/plc";
import {TableNode} from "@/packages/table/table-bak/TableNode";
import {injectTable} from "@/packages/table/table/table";
import {getCurrentInstance} from "@vue/composition-api";
import {$plain} from "@/packages/base";

export default definePlc({
    name: 'plc-tree',
    props: {

        //standard
        autoFixedLeft: {default: true},
        order: {default: -9996},
        width: {default: 60},
        summary: {
            type: Function,
            default: function () {return null}
        },
        head: {
            type: Function,
            default: function (plc: PlcType) {
                return '收起'
            }
        },
        default: {
            type: Function,
            default: function ({rowData, plc}: TableRenderData) {
                const ctx = plc.ctx as any
                return (
                    <div style={ctx.treePlc.utils.getStyles(rowData)} class={ctx.treePlc.utils.getClasses(rowData)}>
                        <span class="pl-tree-node-expander">
                            {rowData.isLoading ? <pl-loading type="beta"/> : (
                                !rowData.isLeaf && <pl-button mode="text" icon="el-icon-caret-right" onClick={() => ctx.treePlc.utils.toggle(rowData)}/>
                            )}
                        </span>
                    </div>
                )
            }
        },
    },
    setup() {

        const table = injectTable()
        const ctx = getCurrentInstance() as any

        const utils = {
            toggle: (rowData: TableNode) => {
                rowData.expand(!rowData.isExpand)
                ctx.state.width = table.maxShowLevel.value * 60
            },
            getStyles(rowData: TableNode) {
                return {
                    paddingLeft: $plain.utils.suffixPx((rowData.level - 1) * 60)
                }
            },
            getClasses(rowData: TableNode) {
                return [
                    'plc-tree-node',
                    {'plc-tree-node-expanded': rowData.isExpand},
                ]
            },
        }

        return {
            treePlc: {
                utils,
            }
        }
    },
})