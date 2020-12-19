import {Plc, TablePlc, TableRenderScope} from "./plc.type";
import {TableNode} from "../../core/useTableNode";

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
    if (!plc.props.edit && !plc.scopedSlots.edit) {
        return false
    }
    return typeof plc.props.editable === "function" ? plc.props.editable(node) : (plc.props.editable !== false)
}

function getBodyCell(
    {
        node,
        plc
    }: {
        node: TableNode,
        plc: Plc,
    }
) {
    let renderData: TableRenderScope
    if (node.isSummary) {

    }

}