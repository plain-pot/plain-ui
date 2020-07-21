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

/**
 * 判断当前是否可编辑
 * 1. 如果当前行非编辑状态，则不可编辑
 * 2. 如果列没有edit作用域插槽以及渲染函数，则不可编辑
 * 3. 如果列的editable属性为函数，则计算这个函数的值来定性是否可编辑
 *
 * 这个【是否可编辑】值用来设置 body-cell 的样式，以便body-cell清楚地知道当前是否处于可编辑状态，并且设置padding
 *
 * @author  韦胜健
 * @date    2020/7/21 21:16
 */
function getEditable(plc: PlcType, rowData: TableNode) {
    // 行非编辑状态下，定性为不可编辑
    if (!rowData.isEdit) {
        return false
    }
    // 如果没有edit渲染函数以及作用域插槽，那么直接定性为不可编辑
    if (!plc.props.edit && !plc.scopedSlots.edit) {
        return false
    }
    return typeof plc.props.editable === "function" ? plc.props.editable(rowData) : (plc.props.editable !== false)
}

/**
 * 获取内容渲染函数
 * @author  韦胜健
 * @date    2020/7/21 21:18
 */
function getBody(
    {
        fixed,
        rowData,
        plc,
        isSummary,
        h,
        editable,
    }: {
        fixed: PlcFixedType,
        rowData: TableNode,
        plc: PlcType,
        isSummary: boolean,
        h: Vue["$createElement"],
        editable: boolean,
    }) {
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
        // 如果当前行处于可编辑状态，则渲染的行数据对象为 rowData.editRow，否则为 rowData.data
        let row = rowData.isEdit ? rowData.editRow : rowData.data
        renderData = {rowData, plc, row}

        if (editable) {
            // 当前一定存在 plc.scopedSlots.edit 或者 plc.props.edit，否则 editable不可能为true
            if (!!plc.scopedSlots.edit) {
                return plc.scopedSlots.edit(renderData)
            }
            if (!!plc.props.edit) {
                return callRender(plc.props.edit, plc.ctx, h, renderData)
            }
        } else {
            // 当前单元格不可编辑，如果当前行处于编辑状态，则渲染的行数据为 tableNode.editRow，否则为 tableNode.data
            // 使用作用域插槽default渲染，没有则使用渲染函数default渲染，没有则直接显示field对应的值
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
        }
    ) => {
        const editable = getEditable(plc, rowData)
        const body = getBody({fixed, rowData, plc, isSummary, h, editable})

        return {
            editable,
            body
        }
    }
}