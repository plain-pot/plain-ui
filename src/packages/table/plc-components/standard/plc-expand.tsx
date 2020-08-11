import {definePlc} from "@/packages/table/plc-components/register";
import {PlcType, TableRenderData} from "@/packages/table/plc/plc";

export default definePlc({
    name: 'plc-expand',
    props: {
        // custom
        toggleOnClickRow: {type: Boolean},                      // 是否在点击行的时候触发点击动作

        //standard
        autoFixedLeft: {default: true},
        order: {default: -10001},
        width: {default: 60},
        align: {default: 'center'},

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
            default: function ({row, plc}: TableRenderData) {
                const plcInstance = plc.ctx as any
                return (
                    <pl-button icon="el-icon-arrow-down" mode="text"/>
                )
            }
        },
    },
    setup() {
        return {}
    },
})