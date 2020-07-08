import {PlcFixedType} from "@/packages/table/plc/plc-utils";
import {PlcType, TableRenderData} from "@/packages/table/plc/plc";
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
        if (!!plc.scopedSlots.head) {
            return plc.scopedSlots.head(plc)
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

        let renderData: TableRenderData

        if (isSummary) {
            // 合计行中的row一直是原始的row对象
            renderData = {rowData, plc, row: rowData.data}

            // 合计行
            if (!!plc.scopedSlots.summary) {
                return plc.scopedSlots.summary(renderData)
            }
            if (!!plc.props.summary) {
                return plc.props.summary(h, renderData)
            }
            if (!!plc.scopedSlots.default) {
                return plc.scopedSlots.default(renderData)
            }
            if (!!plc.props.default) {
                return plc.props.default(h, renderData)
            }
            return !!plc.props.field ? renderData.row[plc.props.field] : null
        } else {
            // 表体
            if (rowData.isEdit) {
                renderData = {rowData, plc, row: rowData.editRow}

                if (!!plc.scopedSlots.edit) {
                    return plc.scopedSlots.edit(renderData)
                }
                if (!!plc.props.edit) {
                    return plc.props.edit(h, renderData)
                }
            } else {
                renderData = {rowData, plc, row: rowData.data}
            }

            if (!!plc.scopedSlots.default) {
                return plc.scopedSlots.default(renderData)
            }
            if (!!plc.props.default) {
                // todo
                // 在调用渲染函数渲染的时候，调用的上下文应该是plc组件对象本身
                return plc.props.default.apply(plc.ctx, [h, renderData])
            }
            if (!plc.props.field) {
                return null
            }
            return renderData.row[plc.props.field]
        }

    }
}