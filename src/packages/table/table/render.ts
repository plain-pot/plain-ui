import {PlcFixedType} from "@/packages/table/plc/plc-utils";
import {PlcType} from "@/packages/table/plc/plc";
import {Vue} from "vue/types/vue";
import {TableNode} from "@/packages/table/table/TableNode";

export const PlcRender = {
    head: (
        {
            fixed,
            plc,
            h,
        }: {
            fixed: PlcFixedType,
            plc: PlcType,
            h: Vue["$createElement"]
        }) => {

        // 如果不是对应的fixed，不渲染任何内容
        if (plc.props.fixed != fixed) {
            return null
        }
        // 如果存在 head作用域插槽，渲染head作用域插槽
        if (!!plc._$scopedSlots.head) {
            return plc._$scopedSlots.head(plc)
        }
        // 如果存在 props.head 渲染函数，则渲染 props.head
        if (!!plc.props.head) {
            return plc.props.head(h, plc)
        }
        return plc.props.title

    },
    body: (
        {
            fixed,
            rowData,
            plc,
            isSummary,
            h,
        }: {
            fixed: PlcFixedType,
            rowData: TableNode,
            plc: PlcType,
            isSummary: boolean,
            h: Vue["$createElement"]
        }) => {
        // 如果不是对应的fixed，不渲染任何内容
        if (plc.props.fixed != fixed) {
            return null
        }

        const renderData = {rowData, plc}

        if (isSummary) {
            // 合计行
            if (!!plc._$scopedSlots.summary) {
                return plc._$scopedSlots.summary(renderData)
            }
            if (!!plc.props.summary) {
                return plc.props.summary(h, renderData)
            }
            if (!!plc._$scopedSlots.default) {
                return plc._$scopedSlots.default(renderData)
            }
            if (!!plc.props.default) {
                return plc.props.default(h, renderData)
            }
            return !!plc.props.field ? renderData.rowData.data[plc.props.field] : null
        } else {
            // 表体
            if (rowData.isEdit) {
                if (!!plc._$scopedSlots.edit) {
                    return plc._$scopedSlots.edit(renderData)
                }
                if (!!plc.props.edit) {
                    return plc.props.edit(h, renderData)
                }
            }

            if (!!plc._$scopedSlots.default) {
                return plc._$scopedSlots.default(renderData)
            }
            if (!!plc.props.default) {
                return plc.props.default(h, renderData)
            }
            if (!plc.props.field) {
                return null
            }
            return renderData.rowData.data[plc.props.field]
        }

    }
}