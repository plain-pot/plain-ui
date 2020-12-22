import {StyleProperties, VNodeChild} from "../../../../shims";
import {TablePlc, TableRenderScope} from "./plc.type";
import {TablePlcAlign, TablePlcFixedType} from "../../core/table.utils";
import {PropType} from 'vue';
import {TableNode} from "../../core/useTableNode";
import {MultipleClass} from "../../../../use/useClasses";
import {FormRule} from "../../../form/form.validate";

export type PlcRenderFunction = (scope: TableRenderScope) => VNodeChild
export type PlcPropsHead = (scope: { plc: TablePlc }) => VNodeChild
export type PlcPropsDefault = PlcRenderFunction
export type PlcPropsSummary = PlcRenderFunction
export type PlcPropsEdit = PlcRenderFunction
export type PlcPropsRenderAfterRow = PlcRenderFunction
export type PlcPropsEditable = boolean | ((node: TableNode) => boolean)

export const PlcGroupProps = {
    title: {type: String},                                                  // 列标题
    align: {type: String as PropType<TablePlcAlign>},                       // 非编辑状态下文本对其方式
    noPadding: {type: Boolean},                                             // 是否不兼容表格的虚拟滚动功能
    colDraggable: {type: Boolean, default: null},                           // 列是否可以拖拽排序

    hide: {type: Boolean},                                                  // 是否隐藏
    order: {type: [String, Number]},                                        // 列排序
    fixed: {type: String as PropType<TablePlcFixedType>, default: TablePlcFixedType.center},// 冻结列位置：left、right、undefined
    autoFixedLeft: {type: Boolean},                                         // 当出现左固定列的时候，是否自动设置为左固定列
    autoFixedRight: {type: Boolean},                                        // 当出现右固定列的时候，是否自动设置为右固定列

    headCls: {},                                                            // 给表头添加的class
    bodyCls: {},                                                            // 给表体添加的class
}

export const PlcProps = {
    ...PlcGroupProps,
    field: {type: String},                                                  // 列绑定字段
    width: {type: [String, Number], default: 120},                          // 列宽度
    fit: {type: Boolean},                                                   // 列宽自适应(只有一个列能够自适应)
    notFitVirtual: {type: Boolean},                                         // 是否不兼容表格的虚拟滚动功能

    // 渲染函数
    head: {type: Function as PropType<PlcPropsHead>},                       // 列标题渲染函数
    default: {type: Function as PropType<PlcPropsDefault>},                 // 列内容默认渲染函数
    summary: {type: Function as PropType<PlcPropsSummary>},                 // 列内容在合计行上的渲染函数
    edit: {type: Function as PropType<PlcPropsEdit>},                       // 列内容在编辑状态下的渲染函数
    renderAfterRow: {type: Function as PropType<PlcPropsRenderAfterRow>},   // 行之后需要额外渲染的内容

    // 编辑相关
    required: {type: Boolean},                                              // 是否必填
    rules: {type: [Object, Array] as PropType<FormRule | FormRule[]>},      // 校验规则
    editable: {type: [Boolean, Function] as PropType<PlcPropsEditable>, default: true},// 是否可编辑
    addEditPadding: {type: Boolean},                                        // 处于编辑状态的时候，是否添加内编辑，只有当行状态为编辑状态，并且列有edit渲染函数或者作用域插槽时，才符合“处于编辑状态”的条件
}

export type PlcPublicAttrsType = {
    level: number,                      // 分组表头层级
    rowspan: number,                    // 表头td的rowspan
    colspan: number,                    // 表头td的colspan
    isLastFixedLeft: boolean,           // 是否为最后一个左固定列
    isFirstFixedRight: boolean,         // 是否为第一个右固定列
    fixedPosition: {                    // 固定列的sticky位置
        left: number,
        right: number,
    },
    // 列style公共内联样式
    styles: {
        head: StyleProperties,
        body: StyleProperties,
    },
    // 列公共class样式
    classes: {
        head: MultipleClass,
        body: MultipleClass,
    },
}

/**
 * Plc以及PlcGroup公共的一些属性
 * @author  韦胜健
 * @date    2020/12/18 14:41
 */
export const PlcPublicAttrs: PlcPublicAttrsType = {
    level: 0,
    rowspan: 1,
    colspan: 1,
    isLastFixedLeft: false,
    isFirstFixedRight: false,
    fixedPosition: {
        left: 0,
        right: 0,
    },
    styles: {
        head: {},
        body: {},
    },
    classes: {
        head: [],
        body: [],
    },
}