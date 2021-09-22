import {TablePlcAlign, TablePlcFixedType} from "../../table/utils/table.utils";
import {TableNode} from "../../table/use/useTableNode";
import {ExtractPropTypes, MultipleClass, PropType, StyleProperties} from "plain-ui-composition";
import {tFormRuleItem} from "../../../PlForm/form.validate";
import {TableRenderScope} from "./plc.type";
import {deepcopy} from "plain-utils/object/deepcopy";

import {tDefaultFilterConfig, tFilterConfig} from "../../../PlFilter/FilterConfig";

export type PlcPropsEditable = boolean | ((node: TableNode) => boolean)

export const PlcGroupPropsOptions = {
    title: {type: String},                                                  // 列标题
    align: {type: String as PropType<string | TablePlcAlign>},              // 非编辑状态下文本对其方式
    noPadding: {type: Boolean},                                             // 是否不兼容表格的虚拟滚动功能
    colDraggable: {type: Boolean, default: null},                           // 列是否可以拖拽排序
    link: {type: Boolean},                                                  // 超链接样式

    hide: {type: Boolean},                                                  // 是否隐藏
    order: {type: [String, Number]},                                        // 列排序
    fixed: {type: String as PropType<string | TablePlcFixedType>, default: TablePlcFixedType.center},// 冻结列位置：left、right、undefined
    autoFixedLeft: {type: Boolean},                                         // 当出现左固定列的时候，是否自动设置为左固定列
    autoFixedRight: {type: Boolean},                                        // 当出现右固定列的时候，是否自动设置为右固定列

    headCls: {},                                                            // 给表头添加的class
    bodyCls: {},                                                            // 给表体添加的class
}

export function createDefaultFilterConfigProp(defaultGetter?: tDefaultFilterConfig) {return {type: Function as PropType<tDefaultFilterConfig>, default: defaultGetter,}}

export const PlcPropsOptions = {
    ...PlcGroupPropsOptions,
    field: {type: String},                                                  // 列绑定字段
    width: {type: [String, Number], default: 120},                          // 列宽度
    fit: {type: Boolean},                                                   // 列宽自适应(只有一个列能够自适应)
    hideInForm: {type: Boolean},                                            // 是否再表单编辑中显示

    // 编辑相关
    required: {type: Boolean},                                              // 是否必填
    rules: {type: [Object, Array] as PropType<tFormRuleItem | tFormRuleItem[]>},// 校验规则
    editable: {type: [Boolean, Function] as PropType<PlcPropsEditable>, default: true},// 是否可编辑
    addEditPadding: {type: Boolean},                                        // 处于编辑状态的时候，是否添加内编辑，只有当行状态为编辑状态，并且列有edit渲染函数或者作用域插槽时，才符合“处于编辑状态”的条件

    // 筛选先关
    filterName: {type: String, default: 'text'},
    filterHandler: {type: String, default: '包含'},
    filterConfig: {type: [Function, Object] as PropType<tFilterConfig>, default: () => ({})},
    defaultFilterConfig: createDefaultFilterConfigProp(),
    defaultSearch: {type: Boolean},
}

export const PlcEmitsOptions = {
    onClick: (data: { e: MouseEvent, scope: TableRenderScope }) => true,
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

export function createPlcPropOptions(defaultProps: Partial<ExtractPropTypes<typeof PlcPropsOptions>>) {
    const options = deepcopy(PlcPropsOptions)
    Object.entries(defaultProps).forEach(([propName, defaultValue]) => {
        (options as any)[propName].default = defaultValue
    })
    return options
}
