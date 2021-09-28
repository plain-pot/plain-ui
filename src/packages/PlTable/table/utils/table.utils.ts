import {StyleProps} from "../../../../use/useStyle";
import {tPlc, tPlcType} from "../../plc/utils/plc.type";
import {TableNode} from "../use/useTableNode";
import {MultipleClass, PropType, StyleProperties} from "plain-design-composition"
import {FormAssociateFields, tFormPropRules} from "../../../PlForm/form.validate";
import {useTree} from "../../../PlTree/core/useTree";
import {iTableSortData} from "../../../createUseTableOption/createUseTableOption.utils";
import {PlainObject} from "plain-utils/utils/event";

export type TablePropsConfig = (plcList: tPlcType[], flatList: tPlc[]) => void

export type TablePropsRowClassFunc = (node: TableNode) => MultipleClass
export type TablePropsCellClassFunc = (node: TableNode, plc: tPlc) => MultipleClass
export type TablePropsCellStyleFunc = (node: TableNode, plc: tPlc) => StyleProperties
export type TablePropsHeadCellClassFunc = (plc: tPlcType) => MultipleClass
export type TablePropsHeadCellStyleFunc = (plc: tPlcType) => StyleProperties

export type TablePropsSpanMethod = (scope: { node: TableNode, plc: tPlc }) => { rowspan: number, colspan: number }
export type TablePropsSort = iTableSortData | iTableSortData[]

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

export enum TableHoverPart {
    body = 'body',
    head = 'head'
}

export const TableProps = {

    /*---------------------------------------basic-------------------------------------------*/

    ...StyleProps,

    loading: {type: Boolean, default: null},                    // 是否开启表格的加载状态
    virtual: {type: Boolean, default: false},                   // 虚拟滚动
    summaryData: {type: Array as PropType<PlainObject[]>},     // 表尾合计行数据
    config: {type: Function as PropType<TablePropsConfig>},     // 配置列信息函数
    rules: {type: Object as PropType<tFormPropRules>},          // 校验规则
    associateFields: {type: Object as PropType<FormAssociateFields>},   // 校验关联字段，一个对象，key为字段名，value为字段字符串或者字符串数组。当key变化时，会自动校验value中所列的字段
    colDraggable: {type: Boolean},                              // 列是否可以拖拽排序
    spanMethod: {type: Function as PropType<TablePropsSpanMethod>},// 合并表体单元格的方法
    defaultEditingWhenAddRow: {type: Boolean},                  // 默认开启编辑状态，当添加新行时
    editSourceRow: {type: Boolean},                             // 编辑原始数据
    sort: {type: [Object, Array] as PropType<TablePropsSort>},  // 当前排序字段

    /*---------------------------------------style-------------------------------------------*/

    border: {type: Boolean},                                    // 是否带纵向边框
    stripe: {type: Boolean},                                    // 是否为斑马纹table
    hideHeader: {type: Boolean},                                // 是否隐藏表头
    disabledStickyCompatible: {type: Boolean},                  // 是否禁用在ie下的sticky兼容
    headRowHeight: {type: [String, Number]},                    // 表头行高
    bodyRowHeight: {type: [String, Number]},                    // 表体行高
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

export const TableDefaultRowHeight = {
    body: {
        large: 56,
        normal: 48,
        mini: 44,
    },
    head: {
        large: 56,
        normal: 48,
        mini: 44,
    },
}
