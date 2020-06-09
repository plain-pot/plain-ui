export const PlcGroupProps = {
    title: {type: String, watch: true},                                     // 列标题
    align: {type: String, default: 'left', watch: true},                    // 非编辑状态下文本对其方式

    hide: {type: Boolean, watch: true},                                     // 是否隐藏
    order: {type: Number, watch: true},                                     // 列排序
    fixed: {type: String, default: 'center', watch: true},                  // 冻结列位置：left、right、undefined
    autoFixedLeft: {type: Boolean},                                         // 当出现左固定列的时候，是否自动设置为左固定列
    autoFixedRight: {type: Boolean},                                        // 当出现右固定列的时候，是否自动设置为右固定列
}

export const PlcProps = {
    ...PlcGroupProps,
    field: {type: String},                                                  // 列绑定字段
    width: {default: '120', watch: true, formatNumber: true},               // 列宽度
    fit: {type: Number, default: 0},                                        // 当列不满表格宽度时，该列所占剩下宽度的权重

    // search: {type: Boolean, default: true},                              // 可查询
    // searchType: {type: String, default: 'input'},                        // 查询类型
    // searchField: {type: String},                                         // 查询字段
    //
    // sort: {type: Boolean, default: true},                                // 可排序
    // sortField: {type: String},                                           // 排序字段
    //
    // editable: {type: Boolean, default: true},                            // 是否可编辑
    // editableFunc: {type: Function},                                      // 是否可编辑判断函数
    //
    // formatter: {type: Function},                                         // 文本格式化函数，支持异步格式化
    // tooltip: {type: Boolean},                                            // 是否tooltip显示文本
    // link: {type: Boolean},                                               // 是否以超链接的形式展示文本，并且点击的时候回派发事件
    // showInDialog: {type: Boolean},                                       // 非编辑状态下是否点击后再dialog中显示
    //
    // required: {type: Boolean},                                           // 是否必输
    // rules: {type: Array},                                                // 校验规则
    //
    // /*---------------------------------------不可配置信息-------------------------------------------*/
    // scopedSlots: {type: Object},                                         // 作用域插槽
    // renderNormal: {type: Function},                                      // 渲染函数:非编辑状态
    // renderEdit: {type: Function},                                        // 渲染函数：编辑状态
    // renderHead: {type: Function},                                        // 渲染函数：列头
}
