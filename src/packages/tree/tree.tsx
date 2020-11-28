import {designComponent} from "../../use/designComponent";
import {TreeNode} from "./utils/TreeNode";
import {VNodeChild} from "../../shims";
import {useScopedSlots} from "../../use/useScopedSlots";
import number from "../number/number";
import {useModel} from "../../use/useModel";
import {TreeMark} from "./utils/TreeMark";
import {reactive, computed} from 'vue';

export default designComponent({
    name: 'pl-tree',
    props: {
        data: {type: Array},                                        // 树形结构数据
        loading: {type: Boolean},                                   // 当前是否处于loading状态
        nodeIcon: {type: Function as any as new() => ((node: TreeNode) => string)},// 节点图标

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
        intent: {type: Number, default: 14},                        // 相邻级节点水平缩进距离，默认16，单位px
        lazy: {type: Boolean},                                      // 是否懒加载子节点数据
        isLeaf: {type: Function as any as new() => ((node: TreeNode) => boolean)},// 判断树节点是否为叶子节点的函数，仅在lazy模式有效
        getChildren: {type: Function as any as new() => ((node: TreeNode, cb: (...args: any[]) => void) => void)},// 加载子节点数据的函数，仅当 lazy 为true时有效

        renderAfterExpand: {type: Boolean, default: true},          // 是否在第一次展开节点之后才渲染内容
        expandOnClickNode: {type: Boolean, default: null},          // 是否点击树节点的时候展开子节点
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
    },
    emits: {
        clickNode: (node: TreeNode) => true,                        // 点击节点事件
        updateCurrent: (current?: string) => true,                   // 当前高亮节点key变化绑定事件
        currentChange: (node: TreeNode | null) => true,             // 当前高亮节点变化事件
        updateData: (data?: any[]) => true,              // 数据变化事件（拖拽排序、数据懒加载）

        expandChange: (expandKeys: string[]) => true,               // 展开节点变化事件
        expand: (node: TreeNode) => true,                           // 展开事件
        collapse: (node: TreeNode) => true,                         // 关闭节点事件

        checkChange: (checkKeys: string[]) => true,                 // 选中节点变化事件
        check: (node: TreeNode) => true,                            // 选中节点事件
        uncheck: (node: TreeNode) => true,                          // 取消选中节点事件
    },
    setup({props, event: {emit}}) {

        /*---------------------------------------state-------------------------------------------*/
        /*作用域插槽*/
        const {scopedSlots} = useScopedSlots({
            default: {node: TreeNode, index: number},
        })
        /*树形数据*/
        const data = useModel(() => props.data, emit.updateData)
        /*当前高亮节点的key*/
        const current = useModel(() => props.currentKey, emit.updateCurrent)
        /*tree mark*/
        const treeMark = new TreeMark(() => ({
            keyField: props.keyField,
            labelField: props.labelField,
            childrenField: props.childrenField,
            isCheckable: props.isCheckable,
            isLeaf: props.isLeaf,
            checkStrictly: props.checkStrictly,
            filterNodeMethod: props.filterNodeMethod,
            intent: props.intent,
        }))
        /*伪造的跟节点的key*/
        const rootTreeNode = treeMark.node.get({[props.childrenField!]: data.value}, 0, () => ({}) as any)

        const state = reactive({
            treeMark,
            rootTreeNode,
        })

        /*---------------------------------------utils-------------------------------------------*/

        const utils = {
            /**
             * 遍历所有的treeNode
             * @author  韦胜健
             * @date    2020/3/30 19:30
             */
            iterateAll: (
                treeNodes: TreeNode[] | Readonly<TreeNode[]> | null,
                fn: (node: TreeNode) => void,
                iterateChildren?: (node: TreeNode) => boolean
            ): void => {
                if (!treeNodes) return
                treeNodes.forEach(treeNode => {
                    fn(treeNode)
                    if (!!treeNode.children && (!iterateChildren || iterateChildren(treeNode))) {
                        utils.iterateAll(treeNode.children, fn, iterateChildren)
                    }
                })
            },
        }

        /*---------------------------------------computer-------------------------------------------*/
        /*格式化得到的TableNode树形数据*/
        const formatData = computed(() => state.treeMark.node.getList(data.value, 1, () => state.rootTreeNode))
        /*拍平的树形数据（不拍平无法实现虚拟滚动）*/
        const formatDataFlat = computed(() => {
            const format = formatData.value
            const formatDataFlat: TreeNode[] = []
            utils.iterateAll(format,
                (treeNode: TreeNode) => {
                    formatDataFlat.push(treeNode)
                },
                (treeNode: TreeNode) => {
                    return treeNode.isExpand === true
                })
            return formatDataFlat.filter((treeNode: TreeNode) => !!treeNode.isVisible)
        })


        return {
            render: () => {
                return (
                    <div class="pl-tree">
                        <pl-list direcction="right">
                            {formatDataFlat.value.map((node, index) => (
                                <pl-item key={index}>
                                    {node.label}
                                </pl-item>
                            ))}
                        </pl-list>
                    </div>
                )
            }
        }
    },
})