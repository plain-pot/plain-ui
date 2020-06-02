import {ExtractPropTypes} from "@vue/composition-api/dist/component/componentProps";
import {EmitFunc, useEvent} from "@/use/useEvent";
import {computed, getCurrentInstance, reactive} from "@vue/composition-api";
import {useModel} from "@/use/useModel";
import {TreeMark} from "@/packages/tree/utils/TreeMark";
import {TreeNode} from "@/packages/tree/utils/TreeNode";
import {TreeDropType, TreeMarkAttr} from "@/packages/tree/utils/tree-constant";

export const TreeProps = {
    data: {type: Array},                                        // 树形结构数据
    loading: {type: Boolean},                                   // 当前是否处于loading状态
    nodeIcon: {type: Function},                                 // 节点图标

    // 部分key
    keyField: {type: String, required: true},                   // 每一个树节点用来标识的唯一树形
    labelField: {type: String},                                 // 树节点展示文本对应字段
    childrenField: {type: String},                              // 树节点对应子节点数据对应字段

    // 普通属性
    renderContent: {type: Function},                            // 树节点内容渲染函数
    filterNodeMethod: {type: Function},                         // 对树节点进行筛选的方法，返回true表示可以显示，返回false表示隐藏
    highlightCurrent: {type: Boolean, default: true},           // 是否高亮当前选中节点
    currentKey: {type: String},                                 // 当前选中节点的key

    // 展开相关属性
    emptyText: {type: String, default: '暂无数据'},              // 没有子节点的时候展示的文本
    defaultExpandAll: {type: Boolean},                          // 是否默认展开所有节点
    according: {type: Boolean},                                 // 是否每次只展开一个同级的树节点
    expandIcon: {type: String},                                 // 树展开图标
    intent: {type: Number, default: 14},                        // 相邻级节点水平缩进距离，默认16，单位px
    lazy: {type: Boolean},                                      // 是否懒加载子节点数据
    isLeaf: {type: Function},                                   // 判断树节点是否为叶子节点的函数，仅在lazy模式有效
    getChildren: {type: Function},                              // 加载子节点数据的函数，仅当 lazy 为true时有效

    renderAfterExpand: {type: Boolean, default: true},          // 是否在第一次展开节点之后才渲染内容
    expandOnClickNode: {type: Boolean, default: null},          // 是否点击树节点的时候展开子节点
    autoExpandParent: {type: Boolean, default: true},           // 是否展开节点的时候，自动展开父节点

    // 勾选相关属性
    showCheckbox: {type: Boolean},                              // 是否展示勾选框
    checkOnClickNode: {type: Boolean},                          // 是否点击树节点的时候选中节点
    checkStrictly: {type: Boolean},                             // 在显示复选框的情况下，是否严格遵循父子互不关联的做法，默认为false
    isCheckable: {type: Function},                              // 当即将选中树节点时，判断是否可以选中该树节点

    // 拖拽属性
    draggable: {type: Boolean},                                 // 是否可拖拽
    allowDrag: {type: Function},                                // 判断节点是否可以拖拽
    allowDrop: {type: Function},                                // 判断目标节点能够被放置
}

export const TREE_PROVIDER = '@@TREE_PROVIDER'

export function useTree(props: ExtractPropTypes<typeof TreeProps>) {

    const {emit} = useEvent({
        clickNode: EmitFunc,
        updateCurrent: EmitFunc,
        currentChange: EmitFunc,

        expandChange: EmitFunc,
        expand: EmitFunc,
        close: EmitFunc,

        checkChange: EmitFunc,
        check: EmitFunc,
        uncheck: EmitFunc,

        dragstart: EmitFunc,
        dragenter: EmitFunc,
        dragleave: EmitFunc,
        dragover: EmitFunc,
        dragend: EmitFunc,
        drop: EmitFunc,
    })

    const ctx = getCurrentInstance()

    /*---------------------------------------state-------------------------------------------*/

    const current = useModel(() => props.currentKey, emit.updateCurrent)

    const treeMark = new TreeMark(ctx)
    const rootTreeNode = new TreeNode({[props.childrenField!]: props.data}, ctx, 0, null, treeMark)

    const state = reactive({
        loading: false,
        virtualScrollFlag: false,
        treeMark,
        rootTreeNode,
    })

    /*---------------------------------------computer-------------------------------------------*/

    const isLoading = computed(() => state.loading || props.loading)
    const formatData = computed(() => rootTreeNode.children)
    const classes = computed(() => [
        'pl-tree',
        'pl-tree-node-list',
        {
            'pl-tree-highlight-current': props.highlightCurrent,
            // 'pl-tree-reflow': this.dragState.reflow,
            'pl-tree-virtual-scrolling': state.virtualScrollFlag,
        }
    ])
    const indicatorStyles = computed(() => {
        let styles = {} as any
        /*const indicatorStyles = this.dragState.indicatorStyles
        if (!!indicatorStyles.left) {
            styles.left = `${indicatorStyles.left + 6}px`
        }
        if (!!indicatorStyles.width) {
            styles.width = `${indicatorStyles.width}px`
        }
        if (!!indicatorStyles.top) {
            styles.top = `${indicatorStyles.top}px`
        }*/
        return styles
    })

    const emitExpandKeys = computed(() => state.treeMark.getActiveKeys(TreeMarkAttr.expand))
    const emitCheckKeys = computed(() => state.treeMark.getActiveKeys(TreeMarkAttr.check))

    /*---------------------------------------utils-------------------------------------------*/

    const utils = {
        /**
         * 处理keys
         * @author  韦胜健
         * @date    2020/3/31 15:23
         */
        handleKeys: async (keys: string | string[], handler: (value: string, index: number, array: string[]) => unknown) => {
            keys = Array.isArray(keys) ? keys : [keys]
            return await Promise.all(keys.map(handler))
        },
        /**
         * 遍历所有的treeNode
         * @author  韦胜健
         * @date    2020/3/30 19:30
         */
        iterateAll: (treeNodes: TreeNode[], fn, iterateChildren?: Function): void => {
            if (!treeNodes) return
            treeNodes.forEach(treeNode => {
                fn(treeNode)
                if (!!treeNode.children && (!iterateChildren || iterateChildren(treeNode))) {
                    utils.iterateAll(treeNode.children, fn, iterateChildren)
                }
            })
        },
        /**
         * 检查props是否合法
         * @author  韦胜健
         * @date    2020/3/30 18:48
         */
        checkProps: (): boolean => {
            if (!props.keyField) {
                console.error('pl-tree 的 keyField属性不能为空，每一条记录必须要有一个key标识')
                return false
            }
            if (!props.childrenField) {
                console.error('pl-tree 的 childrenKey不能为空')
                return false
            }
            return true
        },
        /**
         * 通过 key 寻找treeNode
         * @author  韦胜健
         * @date    2020/3/30 20:52
         */
        findTreeNodeByKey: (key: string): TreeNode | null => {
            const treeNode = state.treeMark.getMark(key, TreeMarkAttr.node)
            if (!treeNode) {
                console.warn(`无法找到treeNode：${key}`, state.treeMark.nodeMap)
                return null
            }
            return treeNode
        },
        /**
         * 获取子节点数据异步方法
         * @author  韦胜健
         * @date    2020/3/31 15:21
         */
        getChildrenAsync: (treeNode: TreeNode) => {
            return new Promise((resolve) => {
                if (!treeNode.key) {
                    state.loading = true
                } else {
                    state.treeMark.setMark(treeNode.key, TreeMarkAttr.loading, true)
                }
                props.getChildren!(treeNode, (...results) => {
                    if (!treeNode.key) {
                        state.loading = false
                    } else {
                        state.treeMark.setMark(treeNode.key, TreeMarkAttr.loading, false)
                        state.treeMark.setMark(treeNode.key, TreeMarkAttr.loaded, true)
                    }
                    resolve(...results)
                })
            })
        },
        getTreeNodeFromEl(el: any): HTMLElement | null {
            const instance = el.__vue__
            if (!!instance.treeNode) return instance.treeNode
            if (!!instance.$parent && !!instance.$parent.treeNode) return instance.$parent.treeNode
            return null
        },
        /**
         * 刷新节点选中状态
         * @author  韦胜健
         * @date    2020/4/1 22:17
         */
        refreshCheckStatus() {
            if (!props.showCheckbox) return
            if (props.checkStrictly) return;

            const next = (treeNode: TreeNode) => {
                let hasCheck = false
                let hasUncheck = false

                if (!!treeNode.children) {
                    treeNode.children.forEach(child => {
                        next(child)
                        if (child.isCheck) {
                            hasCheck = true
                        } else {
                            hasUncheck = true
                        }
                    })
                }
                if (hasCheck && !hasUncheck) {
                    // 所有子节点选中
                    if (!treeNode.isCheck) {
                        treeNode.check(true)
                    }
                } else if (hasUncheck) {
                    // 有子节点未选中
                    if (treeNode.isCheck) {
                        treeNode.check(false)
                    }
                }
            }

            formatData.value.forEach(next)
        },
        /**
         * 判断是否可以拖拽
         * @author  韦胜健
         * @date    2020/4/1 23:12
         */
        isAllowDrag(dragTreeNode: TreeNode, event: DragEvent) {
            return !props.allowDrag || props.allowDrag(dragTreeNode, event)
        },
        /**
         * 判断是否可以放置
         * @author  韦胜健
         * @date    2020/4/1 23:12
         */
        isAllowDrop(dragTreeNode: TreeNode, dropTreeNode: TreeNode, dropType: TreeDropType, event) {
            return !props.allowDrop || props.allowDrop(dragTreeNode, dropTreeNode, dropType, event)
        },
        async initLazy() {
            if (!props.lazy) {
                return
            }
            state.rootTreeNode.setChildren(await this.getChildrenAsync(state.rootTreeNode))
        },
    }

    /*---------------------------------------handler-------------------------------------------*/

    const handler = {
        /**
         * 处理树节点点击展开图标的动作
         * @author  韦胜健
         * @date    2020/3/30 19:02
         */
        clickExpandIcon: (e, treeNode: TreeNode): void => {
            e.stopPropagation()
            methods.toggleExpand(treeNode.key)
        },
        /**
         * 处理点击节点内容动作
         * @author  韦胜健
         * @date    2020/3/30 19:17
         */
        clickNodeContent: (treeNode: TreeNode): void => {
            emit.clickNode(treeNode)
            this.setCurrent(treeNode.key)
            if (this.expandOnClickNode !== false) {
                this.toggleExpand(treeNode.key)
            }
            if (this.checkOnClickNode == true) {
                this.toggleCheck(treeNode.key)
            }
        },
    }

    /*---------------------------------------methods-------------------------------------------*/

    const methods = {}


}