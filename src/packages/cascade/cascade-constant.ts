import {ExtractPropTypes} from "@vue/composition-api/dist/component/componentProps";

export const CascadePanelProps = {
    value: {type: Array},                                               // 数组，双向绑定值
    data: {type: Array},                                                // 选择的数据
    trigger: {type: Array, default: 'click'},                           // 展开触发类型：click，hover
    hoverDebounce: {type: Number, default: 300},                        // 触发器为hover的时候，防抖时间间隔
    emptyText: {type: Boolean, default: '暂无数据'},                     // 没有子节点时展示的文本
    nodeDisabled: {type: Function},                                       // 是否禁用判断函数
    renderContent: {type: Function},                                    // 渲染内容的渲染函数
    selectBranch: {type: Boolean},                                      // 点击分支的时候也能够触发 change 事件

    isLeaf: {type: Function},                                           // 函数，用来判断是否为叶子节点，默认根据节点是否存在子节点来判断是否为叶子节点，懒加载模式下，改属性为必需属性
    lazy: {type: Boolean},                                              // 数据是否为懒加载
    getChildren: {type: Function},                                      // 懒加载数据函数

    labelField: {type: String},                                         // 记录显示文本的字段名
    keyField: {type: String},                                           // 记录值的字段名
    childrenField: {type: String},                                      // 记录的子节点数据的字段名

    filterText: {type: String},                                         // 筛选文本
    filterMethod: {type: Function},                                      // 自定义筛选函数
}

export const CascadeProps = {
    ...CascadePanelProps,

    showLast: {type: Boolean},                                          // 格式化显示值函数
    separator: {type: String, default: ' / '},                          // 显示值分隔符
    filterable: {type: Boolean, default: true},                         // 是否可筛选
    showFormat: {type: Function},                                       // 显示值格式化函数

    inputProps: {type: Object},                                        // 输入框属性值
}

export type CascadeContextType = ExtractPropTypes<typeof CascadePanelProps> & { expandKeys: string[] }

export const enum CascadeMarkAttr {
    loading = 'loading',
    loaded = 'loaded',
    node = 'node',
}