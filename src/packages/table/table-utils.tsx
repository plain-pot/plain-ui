import {ExtractPropTypes} from "@vue/composition-api/dist/component/componentProps";

export const TableProps = {
    data: {type: Array},                                        // 显示的数据
    virtual: {type: Boolean, default: false},                    // 虚拟滚动

    // validate
    rules: {type: Object},                                      // 校验规则

    // theme
    size: {type: String, default: 'normal'},                    // 表格尺寸
    border: {type: Boolean},                                    // 是否带纵向边框
    stripe: {type: Boolean},                                    // 是否为斑马纹table
    headRowHeight: {type: [String, Number], default: 40},       // 表头行高
    bodyRowHeight: {type: [String, Number], default: 36},       // 表体行高
    hideHeader: {type: Boolean},                                // 是否隐藏表头
    showRows: {type: Number, default: 10},                      // 表格显示的行数，当表体的行数超过这个值时，将会出现表体内部滚动，这个属性实际上就是用来设值表格高度
    emptyText: {type: String},                                  // 空数据时显示的文本

    // class style
    rowClassFunc: {type: Function},                             // 行 className 的计算函数
    rowStyleFunc: {type: Function},                             // 行 style内联样式的计算函数
    cellClassFunc: {type: Function},                            // 单元格 className 的计算函数
    cellStyleFunc: {type: Function},                            // 单元格 style 内联样式的计算函数
    headRowClassFunc: {type: Function},                         // 表头行 className 计算函数
    headRowStyleFunc: {type: Function},                         // 表头行 style 内联样式计算函数
    headCellClassFunc: {type: Function},                        // 表头单元格的 className 的计算函数
    headCellStyleFunc: {type: Function},                        // 表头单元格 style 内联样式计算函数
    rowspanFunc: {type: Function},                              // 合并行的方法
    colspanFunc: {type: Function},                              // 合并列的方法

    // row data
    rowKey: {type: String, Function},                           // 行数据的key，在多选行以及树形表格的情况下该属性必填
    currentRowKey: {type: String},                              // 当前行的key
    disabledHighCurrentRow: {type: Boolean},                    // 是否禁用高亮当前行

    // 合计行
    summaryData: {type: Array},                                 // 表尾合计行数据
    summaryText: {type: String, default: '合计'},                 // 表尾合计行第一列的文本

    // plc
    config: {type: Function},                                   // 配置列信息函数

    // other
    debugPlc: {type: Boolean},                                  // 调试plc数据

    // tree
    keyField: {type: String, required: true},                   // 每一个树节点用来标识的唯一树形
    childrenField: {type: String, default: 'children'},         // 树节点对应子节点数据对应字段
    isCheckable: {type: Function},                              // 当即将选中树节点时，判断是否可以选中该树节点
    isLeaf: {type: Function},                                   // 判断树节点是否为叶子节点的函数，仅在lazy模式有效
    filterNodeMethod: {type: Function},                         // 对树节点进行筛选的方法，返回true表示可以显示，返回false表示隐藏
    checkStrictly: {type: Boolean},                             // 在显示复选框的情况下，是否严格遵循父子互不关联的做法，默认为false
    intent: {type: Number, default: 14},                        // 相邻级节点水平缩进距离，默认16，单位px

}

export const TABLE_PROVIDER = '@@TABLE_PROVIDER'

export type TablePropsType = ExtractPropTypes<typeof TableProps>

export const enum TableHoverPart {
    body = 'body',
    head = 'head'
}

export const enum TableCheckStatus {
    check = 'check',
    uncheck = 'uncheck',
    minus = 'minus',
}