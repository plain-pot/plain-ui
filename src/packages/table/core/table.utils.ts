import {StyleProps} from "../../../use/useStyle";
import {SimpleObject, StyleProperties} from "../../../shims";
import {PropType} from 'vue';
import {Plc, TablePlc} from "../plc/core/plc.type";
import {TableNode} from "./useTableNode";
import {MultipleClass} from "../../../use/useClasses";
import {FormComponentRules} from "../../form/form.validate";
import {useTree} from "../../tree/core/useTree";

export type TablePropsConfig = (plcList: TablePlc[]) => Record<string, any>

export type TablePropsRowClassFunc = (node: TableNode) => MultipleClass
export type TablePropsCellClassFunc = (node: TableNode, plc: Plc) => MultipleClass
export type TablePropsCellStyleFunc = (node: TableNode, plc: Plc) => StyleProperties
export type TablePropsHeadCellClassFunc = (plc: TablePlc) => MultipleClass
export type TablePropsHeadCellStyleFunc = (plc: TablePlc) => StyleProperties

export type TablePropsSpanMethod = (socpe: { node: TableNode, plc: Plc }) => { rowspan: number, colspan: number }

export enum TablePlcAlign {
    left = 'left',
    center = 'center',
    right = 'right',
}

export enum TablePlcFixedType {
    left = 'left',
    center = 'center',
    right = 'right',
}

export const enum TableHoverPart {
    body = 'body',
    head = 'head'
}

export const TableProps = {

    /*---------------------------------------basic-------------------------------------------*/

    ...StyleProps,

    loading: {type: Boolean, default: null},                    // 是否开启表格的加载状态
    virtual: {type: Boolean, default: false},                   // 虚拟滚动
    summaryData: {type: Array as PropType<SimpleObject[]>},     // 表尾合计行数据
    config: {type: Function as PropType<TablePropsConfig>},     // 配置列信息函数

    rules: {type: Object as PropType<FormComponentRules>},      // 校验规则
    colDraggable: {type: Boolean},                              // 列是否可以拖拽排序
    spanMethod: {type: Function as PropType<TablePropsSpanMethod>},// 合并表体单元格的方法

    /*---------------------------------------style-------------------------------------------*/

    border: {type: Boolean},                                    // 是否带纵向边框
    stripe: {type: Boolean},                                    // 是否为斑马纹table
    hideHeader: {type: Boolean},                                // 是否隐藏表头
    disabledStickyCompatible: {type: Boolean},                  // 是否禁用在ie下的sticky兼容
    headRowHeight: {type: [String, Number], default: 45},       // 表头行高
    bodyRowHeight: {type: [String, Number], default: 40},       // 表体行高
    showRows: {type: Number, default: 10},                      // 表格显示的行数，当表体的行数超过这个值时，将会出现表体内部滚动，这个属性实际上就是用来设值表格高度

    rowClassFunc: {type: Function as PropType<TablePropsRowClassFunc>},// 行 className 的计算函数
    cellClassFunc: {type: Function as PropType<TablePropsCellClassFunc>},// 单元格 className 的计算函数
    cellStyleFunc: {type: Function as PropType<TablePropsCellStyleFunc>},// 单元格 style 内联样式的计算函数
    headCellClassFunc: {type: Function as PropType<TablePropsHeadCellClassFunc>},// 表头单元格的 className 的计算函数
    headCellStyleFunc: {type: Function as PropType<TablePropsHeadCellStyleFunc>},// 表头单元格 style 内联样式计算函数

    /*---------------------------------------tree-------------------------------------------*/
    ...useTree.createProps<TableNode>(),
    childrenField: {type: String, default: 'children'},         // 树节点对应子节点数据对应字段
}