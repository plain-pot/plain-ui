import {definePlc} from "@/packages/table/plc-components/register";
import {PlcType, TableRenderData} from "@/packages/table/plc/plc";
import {TableNode} from "@/packages/table/table-bak/TableNode";
import {injectTable} from "@/packages/table/table/table";
import {getCurrentInstance} from "@vue/composition-api";

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
                    <div>
                        <pl-button mode="text" icon="el-icon-caret-right" onClick={() => ctx.treePlc.utils.toggle(rowData)}/>
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
            }
        }

        return {
            treePlc: {
                utils,
            }
        }
    },
})