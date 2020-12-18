import {SimpleObject, VNodeChild} from "../../../../shims";
import {Plc, TablePlc} from "./plc.type";
import {TableNode, TablePlcAlign, TablePlcFixedType} from "../../core/table.utils";
import {PropType} from 'vue';

export type PlcRenderFunction = (scope: { node: TableNode, row: SimpleObject, plc: Plc }) => VNodeChild
export type PlcPropsHead = (scope: { plc: TablePlc }) => VNodeChild
export type PlcPropsDefault = PlcRenderFunction
export type PlcPropsSummary = PlcRenderFunction
export type PlcPropsEdit = PlcRenderFunction
export type PlcPropsRenderAfterRow = PlcRenderFunction

export const PlcGroupProps = {
    title: {type: String},                                                  // 列标题
    align: {type: String as PropType<TablePlcAlign>, default: TablePlcAlign.left},// 非编辑状态下文本对其方式
    noPadding: {type: Boolean},                                             // 是否不兼容表格的虚拟滚动功能
    colDraggable: {type: Boolean, default: null},                           // 列是否可以拖拽排序

    hide: {type: Boolean},                                                  // 是否隐藏
    order: {type: [String, Number]},                                        // 列排序
    fixed: {type: String as PropType<TablePlcFixedType>, default: TablePlcFixedType.center},// 冻结列位置：left、right、undefined
    autoFixedLeft: {type: Boolean},                                         // 当出现左固定列的时候，是否自动设置为左固定列
    autoFixedRight: {type: Boolean},                                        // 当出现右固定列的时候，是否自动设置为右固定列
}

export const PlcProps = {
    ...PlcGroupProps,
    field: {type: String},                                                  // 列绑定字段
    width: {type: [String, Number], default: 120},                          // 列宽度
    fit: {type: Boolean},                                                   // 列宽自适应(只有一个列能够自适应)
    notFitVirtual: {type: Boolean},                                         // 是否不兼容表格的虚拟滚动功能
}

/**
 * Plc以及PlcGroup公共的一些属性
 * @author  韦胜健
 * @date    2020/12/18 14:41
 */
export const PlcPublicAttrs = {
    level: 0,
    rowspan: 1,
    colspan: 1,
    isLastFixedLeft: false,
    isFirstFixedRight: false,
}