import {PlcFixedType} from "@/packages/table/plc/plc-utils";
import {PlcType, TableRenderData} from "@/packages/table/plc/plc";
import {Vue} from "vue/types/vue";
import {TableNode} from "@/packages/table/table/TableNode";

/**
 * 在调用渲染函数渲染的时候，调用的上下文应该是plc组件对象本身
 * @author  韦胜健
 * @date    2020/7/20 22:29
 */
function callRender(renderFunc: Function, context: any, h: Vue["$createElement"], renderData: { rowData: TableNode, plc: PlcType, row: any }) {
    return renderFunc.apply(context, [h, renderData])
}

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

            // 合计行，使用作用域插槽 summary渲染，没有则使用渲染函数summary渲染，么有则使用 default作用域插槽渲染，没有
            // 则使用渲染函数default渲染，没有则直接渲染field对应的值
            if (!!plc.scopedSlots.summary) {
                return plc.scopedSlots.summary(renderData)
            }
            if (!!plc.props.summary) {
                return callRender(plc.props.summary, plc.ctx, h, renderData)
            }
            if (!!plc.scopedSlots.default) {
                return plc.scopedSlots.default(renderData)
            }
            if (!!plc.props.default) {
                return callRender(plc.props.default, plc.ctx, h, renderData)
            }
            return !!plc.props.field ? renderData.row[plc.props.field] : null
        } else {
            // 表体
            let editable;                   // 当前单元格是否可编辑
            let row;                        // 当前单元格应该显示的数据的行对象

            if (!rowData.isEdit) {
                editable = false
                row = rowData.data
            } else {
                editable = typeof plc.props.editable === "function" ? plc.props.editable(rowData) : (plc.props.editable !== false)
                row = rowData.editRow
            }

            if (editable) {
                // 如果当前行处于编辑状态，并且当前单元格可编辑，则使用 作用域插槽edit渲染，没有则使用渲染函数edit渲染，没有则
                // 使用作用域插槽default渲染，没有则使用渲染函数default渲染，没有则直接显示field对应的值
                renderData = {rowData, plc, row}

                if (!!plc.scopedSlots.edit) {
                    return plc.scopedSlots.edit(renderData)
                }
                if (!!plc.props.edit) {
                    return callRender(plc.props.edit, plc.ctx, h, renderData)
                }
            } else {
                // 当前单元格不可编辑，如果当前行处于编辑状态，则渲染的行数据为 tableNode.editRow，否则为 tableNode.data
                // 使用作用域插槽default渲染，没有则使用渲染函数default渲染，没有则直接显示field对应的值
                renderData = {rowData, plc, row}
            }

            if (!!plc.scopedSlots.default) {
                return plc.scopedSlots.default(renderData)
            }
            if (!!plc.props.default) {
                return callRender(plc.props.default, plc.ctx, h, renderData)
            }
            if (!plc.props.field) {
                return null
            }
            return renderData.row[plc.props.field]
        }

    }
}