import {StyleProps} from "../../use/useStyle";
import {TableCellClassFunc, TableCellStyleFunc, TableConfigFunc, TableFilterNodeMethod, TableGetChildrenFunction, TableHeadCellClassFunc, TableHeadCellStyleFunc, TableIsCheckable, TableIsLeaf, TableRowClassFunc, TableSpanMethod} from "./table.type";
import {SimpleObject} from "../../shims";
import {ExtractPropTypes, PropType} from 'vue';
import {FormComponentRules} from "../form/form.validate";


export const TableProps = {
    ...StyleProps,

    /*---------------------------------------basic-------------------------------------------*/
    data: {type: Array as PropType<SimpleObject>},              // 显示的数据
    virtual: {type: Boolean, default: false},                   // 虚拟滚动
    summaryData: {type: Array as PropType<SimpleObject>},       // 表尾合计行数据
    config: {type: Function as PropType<TableConfigFunc>},      // 配置列信息函数
    debugPlc: {type: Boolean},                                  // 调试plc数据
    rules: {type: Object as PropType<FormComponentRules>},      // 校验规则
    // associateFields: {type: Object},                            // 校验关联字段，一个对象，key为字段名，value为字段字符串或者字符串数组。当key变化时，会自动校验value中所列的字段
    colDraggable: {type: Boolean},                              // 列是否可以拖拽排序
    spanMethod: {type: Function as PropType<TableSpanMethod>},  // 合并表体单元格的方法

    /*---------------------------------------theme-------------------------------------------*/
    border: {type: Boolean},                                    // 是否带纵向边框
    // stripe: {type: Boolean},                                 // 是否为斑马纹table
    headRowHeight: {type: [String, Number], default: 45},       // 表头行高
    bodyRowHeight: {type: [String, Number], default: 40},       // 表体行高
    // hideHeader: {type: Boolean},                             // 是否隐藏表头
    showRows: {type: Number, default: 10},                      // 表格显示的行数，当表体的行数超过这个值时，将会出现表体内部滚动，这个属性实际上就是用来设值表格高度
    emptyText: {type: String},                                  // 空数据时显示的文本
    disabledStickyCompatible: {type: Boolean},                  // 是否禁用在ie下的sticky兼容

    /*---------------------------------------style and class-------------------------------------------*/
    rowClassFunc: {type: Function as PropType<TableRowClassFunc>},// 行 className 的计算函数
    // headRowClassFunc: {type: Function as Table.HeadRowClassFunc},// 表头行 className 计算函数

    cellClassFunc: {type: Function as PropType<TableCellClassFunc>},// 单元格 className 的计算函数
    cellStyleFunc: {type: Function as PropType<TableCellStyleFunc>},// 单元格 style 内联样式的计算函数
    headCellClassFunc: {type: Function as PropType<TableHeadCellClassFunc>},// 表头单元格的 className 的计算函数
    headCellStyleFunc: {type: Function as PropType<TableHeadCellStyleFunc>},// 表头单元格 style 内联样式计算函数

    /*---------------------------------------tree-------------------------------------------*/
    lazy: {type: Boolean},                                      // 是否懒加载数据
    according: {type: Boolean},                                 // 是否开启手风琴模式，只打开一个兄弟节点
    loading: {type: Boolean, default: null},                    // 是否开启表格的加载状态

    keyField: {type: String},                                   // 每一个树节点用来标识的唯一树形
    childrenField: {type: String, default: 'children'},         // 树节点对应子节点数据对应字段
    getChildren: {type: Function as PropType<TableGetChildrenFunction>},// 加载子节点数据的函数，仅当 lazy 为true时有效
    isCheckable: {type: Function as PropType<TableIsCheckable>},// 当即将选中树节点时，判断是否可以选中该树节点
    isLeaf: {type: Function as PropType<TableIsLeaf>},          // 判断树节点是否为叶子节点的函数，仅在lazy模式有效
    filterNodeMethod: {type: Function as PropType<TableFilterNodeMethod>},// 对树节点进行筛选的方法，返回true表示可以显示，返回false表示隐藏
    checkStrictly: {type: Boolean},                             // 在显示复选框的情况下，是否严格遵循父子互不关联的做法，默认为false
    autoExpandParent: {type: Boolean, default: true},           // 是否展开节点的时候，自动展开父节点
}

export type TablePropsType = ExtractPropTypes<typeof TableProps>

export const TABLE_PROVIDER = '@@TABLE_PROVIDER'

export const enum TableHoverPart {
    body = 'body',
    head = 'head'
}

export const enum TableCheckStatus {
    check = 'check',
    uncheck = 'uncheck',
    minus = 'minus',
}