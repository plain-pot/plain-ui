import {Plc, TablePlc, TableRenderScope} from "./plc.type";
import {TableNode} from "../../core/useTableNode";
import {VNodeChild} from "../../../../shims";

export function renderHeadCell(plc: TablePlc) {
    // 如果存在 head作用域插槽，渲染head作用域插槽
    if (plc.scopedSlots.head.isExist()) {
        return plc.scopedSlots.head({plc: plc as any})
    }
    // 如果存在 props.head 渲染函数，则渲染 props.head
    if (!plc.group && !!plc.props.head) {
        return plc.props.head({plc})
    }
    return plc.props.title
}

export function renderBodyCell(
    {
        node,
        plc,
    }: {
        node: TableNode,
        plc: Plc,
    }
) {
    const editable = getEditable(plc, node)
    const body = getBodyCell({node, plc, editable})
    return {
        editable,
        body,
    }
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
function getEditable(plc: Plc, node: TableNode) {
    // 行非编辑状态下，定性为不可编辑
    if (!node.edit) {
        return false
    }
    // 如果没有edit渲染函数以及作用域插槽，那么直接定性为不可编辑
    if (!plc.props.edit && !plc.scopedSlots.edit.isExist()) {
        return false
    }
    return typeof plc.props.editable === "function" ? plc.props.editable(node) : (plc.props.editable !== false)
}

function getBodyCell(
    {
        node,
        plc,
        editable,
    }: {
        node: TableNode,
        plc: Plc,
        editable: boolean,
    }
): VNodeChild {
    let renderScope: TableRenderScope
    if (node.isSummary) {
        // 合计行中的row一直是原始的row对象
        renderScope = {node, plc, row: node.data}
        // 合计行，使用作用域插槽 summary渲染，没有则使用渲染函数summary渲染，么有则使用 default作用域插槽渲染，没有
        // 则使用渲染函数default渲染，没有则直接渲染field对应的值
        if (plc.scopedSlots.summary.isExist()) {
            return plc.scopedSlots.summary(renderScope)
        }
        if (!!plc.props.summary) {
            return plc.props.summary(renderScope)
        }
        if (plc.scopedSlots.default.isExist()) {
            return plc.scopedSlots.default(renderScope)
        }
        if (!!plc.props.default) {
            return plc.props.default(renderScope)
        }
        return !!plc.props.field ? renderScope.row[plc.props.field] : null
    } else {
        // 如果当前行处于可编辑状态，则渲染的行数据对象为 rowData.editRow，否则为 rowData.data
        let row = node.edit ? node.editRow : node.data
        renderScope = {node, plc, row}

        if (editable) {
            // 当前一定存在 plc.scopedSlots.edit 或者 plc.props.edit，否则 editable不可能为true
            if (plc.scopedSlots.edit.isExist()) {
                return plc.scopedSlots.edit(renderScope)
            }
            if (!!plc.props.edit) {
                return plc.props.edit(renderScope)
            }
        } else {
            // 当前单元格不可编辑，如果当前行处于编辑状态，则渲染的行数据为 tableNode.editRow，否则为 tableNode.data
            // 使用作用域插槽default渲染，没有则使用渲染函数default渲染，没有则直接显示field对应的值
            if (plc.scopedSlots.default.isExist()) {
                return plc.scopedSlots.default(renderScope)
            }
            if (!!plc.props.default) {
                return plc.props.default(renderScope)
            }
            return !!plc.props.field ? renderScope.row[plc.props.field] : null
        }
    }
}