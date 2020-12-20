import {StyleProps} from "../../../use/useStyle";
import {SimpleObject, StyleProperties} from "../../../shims";
import {PropType} from 'vue';
import {TablePlc} from "../plc/core/plc.type";
import {TableNode} from "./useTableNode";
import {MultipleClass} from "../../../use/useClasses";
import {FormComponentRules} from "../../form/form.validate";

export type TablePropsConfig = (plcList: TablePlc[]) => Record<string, any>
export type TablePropsGetChildren = (node: TableNode, cb: (...args: any[]) => void) => void
export type TablePropsIsCheckable = (node: TableNode) => boolean
export type TablePropsIsLeaf = (node: TableNode) => boolean
export type TablePropsFilterNodeMethod = (node: TableNode) => boolean

export type TablePropsRowClassFunc = () => MultipleClass
export type TablePropsCellClassFunc = () => MultipleClass
export type TablePropsCellStyleFunc = () => StyleProperties
export type TablePropsHeadCellClassFunc = (plc: TablePlc) => MultipleClass
export type TablePropsHeadCellStyleFunc = (plc: TablePlc) => StyleProperties

export type TablePropsSpanMethod = () => number

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
    data: {type: Array as PropType<SimpleObject[]>},            // 显示的数据
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
    lazy: {type: Boolean},                                      // 是否懒加载数据
    according: {type: Boolean},                                 // 是否开启手风琴模式，只打开一个兄弟节点
    loading: {type: Boolean, default: null},                    // 是否开启表格的加载状态

    keyField: {type: String},                                   // 每一个树节点用来标识的唯一树形
    childrenField: {type: String, default: 'children'},         // 树节点对应子节点数据对应字段
    getChildren: {type: Function as PropType<TablePropsGetChildren>},// 加载子节点数据的函数，仅当 lazy 为true时有效
    isCheckable: {type: Function as PropType<TablePropsIsCheckable>},// 当即将选中树节点时，判断是否可以选中该树节点
    isLeaf: {type: Function as PropType<TablePropsIsLeaf>},     // 判断树节点是否为叶子节点的函数，仅在lazy模式有效
    filterNodeMethod: {type: Function as PropType<TablePropsFilterNodeMethod>},// 对树节点进行筛选的方法，返回true表示可以显示，返回false表示隐藏
    checkStrictly: {type: Boolean},                             // 在显示复选框的情况下，是否严格遵循父子互不关联的做法，默认为false
    autoExpandParent: {type: Boolean, default: true},           // 是否展开节点的时候，自动展开父节点
}