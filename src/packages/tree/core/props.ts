import {TreeNode} from "../utils/TreeNode";
import {VNodeChild} from "../../../shims";

export const TreeProps = {
    data: {type: Array},                                        // 树形结构数据
    loading: {type: Boolean},                                   // 当前是否处于loading状态
    nodeIcon: {type: Function as any as new() => ((node: TreeNode) => string)},// 节点图标
    nodeHeight: {type: Number, default: 40},                      // 节点高度
    height: {type: String, default: '100%'},                    // 容器高度

    // 部分key
    keyField: {type: String},                                   // 每一个树节点用来标识的唯一树形
    labelField: {type: String},                                 // 树节点展示文本对应字段
    childrenField: {type: String, required: true},              // 树节点对应子节点数据对应字段

    // 普通属性
    renderContent: {type: Function as any as new() => ((data: { node: TreeNode, index: number }) => VNodeChild)},// 树节点内容渲染函数
    filterNodeMethod: {type: Function as any as new() => ((node: TreeNode) => boolean)},// 对树节点进行筛选的方法，返回true表示可以显示，返回false表示隐藏
    highlightCurrent: {type: Boolean, default: true},           // 是否高亮当前选中节点
    currentKey: {type: String},                                 // 当前选中节点的key

    // 展开相关属性
    emptyText: {type: String, default: '暂无数据'},              // 没有子节点的时候展示的文本
    defaultExpandAll: {type: Boolean},                          // 是否默认展开所有节点
    according: {type: Boolean},                                 // 是否每次只展开一个同级的树节点
    expandIcon: {type: String},                                 // 树展开图标
    intent: {type: Number, default: 20},                        // 相邻级节点水平缩进距离，默认16，单位px
    lazy: {type: Boolean},                                      // 是否懒加载子节点数据
    isLeaf: {type: Function as any as new() => ((node: TreeNode) => boolean)},// 判断树节点是否为叶子节点的函数，仅在lazy模式有效
    getChildren: {type: Function as any as new() => ((node: TreeNode, cb: (...args: any[]) => void) => void)},// 加载子节点数据的函数，仅当 lazy 为true时有效

    renderAfterExpand: {type: Boolean, default: true},          // 是否在第一次展开节点之后才渲染内容
    expandOnClickNode: {type: Boolean, default: true},          // 是否点击树节点的时候展开子节点
    autoExpandParent: {type: Boolean, default: true},           // 是否展开节点的时候，自动展开父节点

    // 勾选相关属性
    showCheckbox: {type: Boolean},                              // 是否展示勾选框
    checkOnClickNode: {type: Boolean},                          // 是否点击树节点的时候选中节点
    checkStrictly: {type: Boolean},                             // 在显示复选框的情况下，是否严格遵循父子互不关联的做法，默认为false
    isCheckable: {type: Function as any as new() => ((node: TreeNode) => boolean)},// 当即将选中树节点时，判断是否可以选中该树节点

    // 拖拽属性
    draggable: {type: Boolean},                                 // 是否可拖拽
    allowDrag: {type: Function as any as new() => ((node: TreeNode) => boolean)},// 判断节点是否可以拖拽
    allowDrop: {type: Function as any as new() => ((node: TreeNode) => boolean)},// 判断目标节点能够被放置

    folderCollapseIcon: {type: String, default: 'el-icon-folder-s'},
    folderExpandIcon: {type: String, default: 'el-icon-folder-opened'},
    leafIcon: {type: String, default: 'el-icon-document'},
}