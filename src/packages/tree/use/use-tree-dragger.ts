import {UseTreeReturnType} from "@/packages/tree/use/use-tree";
import {getCurrentInstance, reactive} from "@vue/composition-api";
import {StyleType} from "@/types/utils";
import {TreeDropType} from "@/packages/tree/utils/tree-constant";
import {TreeNode} from "@/packages/tree/utils/TreeNode";

export function useTreeDragger(utils: UseTreeReturnType['utils'], methods: UseTreeReturnType['methods']) {

    const ctx = getCurrentInstance()!

    const state = reactive({
        show: false,                                                 // 当前拖拽指示器是否展示
        indicatorStyles: {} as StyleType,                            // 当前指示器样式
        dropInnerKey: null as null | string,                         // 当前拖拽，即将放入内部的节点的key
        dropType: TreeDropType.null as TreeDropType,                 // 当前拖拽在目标节点的位置
        dropTreeNode: null as null | TreeNode,                       // 当前放置目标节点的treeNode对象
        dragTreeNode: null as null | TreeNode,                       // 当前拖拽目标节点的treeNode对象
        reflow: false,                                               // 当前是否正在重新渲染，重新渲染的时候不要展开动画
    })

    const handler = {
        dragstart: (e) => {
            e.stopPropagation()
            e.dataTransfer.effectAllowed = 'move'

            const dragTreeNode = utils.getTreeNodeFromEl(e.currentTarget)

            if (!!dragTreeNode && !utils.isAllowDrag(dragTreeNode, e)) {
                e.preventDefault()
                return
            }

            state.dragTreeNode = dragTreeNode
        },
        dragend: (e) => {
            e.stopPropagation()

            state.show = false
            state.dropInnerKey = null
            state.indicatorStyles = {}

            let {dropTreeNode, dragTreeNode, dropType} = state

            if (!!dropTreeNode) {
                dragTreeNode!.removeSelf()

                state.reflow = true
                switch (dropType) {
                    case TreeDropType.prev:
                        // console.log(`添加到 ${dropTreeNode.label} 之前`)
                        dropTreeNode.previousSibling(dragTreeNode!)
                        break
                    case TreeDropType.inner:
                        // console.log(`添加到 ${dropTreeNode.label} 内部`)
                        dropTreeNode.unshiftChild(dragTreeNode!)
                        methods.expand(dropTreeNode.key)
                        break
                    case TreeDropType.next:
                        // console.log(`添加到 ${dropTreeNode.label} 之后`)
                        dropTreeNode.nextSibling(dragTreeNode!)
                        break
                    default:
                        // console.log(`无任何变化`)
                        break
                }
                utils.refreshCheckStatus()
                setTimeout(() => state.reflow = false, 100)
            }
        },
        dragover: (e) => {
            e.stopPropagation()
            e.preventDefault()
            e.dataTransfer.dropEffect = 'move'

            const treeNode = utils.getTreeNodeFromEl(e.currentTarget)

            let nothing = () => {
                e.dataTransfer.dropEffect = 'none'
                state.show = false
                state.dropInnerKey = null
                state.indicatorStyles = {}
                state.dropType = TreeDropType.null
                state.dropTreeNode = null
            }

            // 如果当前 over 的节点为拖拽节点的子节点，则什么事也不干，清空标记信息并且什么也不做
            if (treeNode === state.dragTreeNode) {
                nothing()
                return;
            } else {
                let containsFlag = false
                utils.iterateAll(state.dragTreeNode!.children, (child) => {
                    if (child === treeNode) {
                        containsFlag = true
                    }
                })
                if (containsFlag) {
                    nothing()
                    return;
                }
            }

            let content = e.currentTarget.querySelector('.pl-tree-node-content')
            let rect = content.getBoundingClientRect()

            if (!!rect) {
                state.dropTreeNode = treeNode

                let {height, width, left, top} = rect
                width -= state.dropTreeNode!.indicatorLeft
                left += state.dropTreeNode!.indicatorLeft

                let deltaY = e.clientY - top
                let allowDrop;


                if (deltaY < height / 4) {
                    // 上
                    allowDrop = utils.isAllowDrop(state.dragTreeNode!, state.dropTreeNode!, TreeDropType.prev, e)
                    if (!allowDrop) return nothing()

                    state.dropType = TreeDropType.prev
                    state.show = true
                    state.dropInnerKey = null
                    state.indicatorStyles = {top, width, left}
                } else if (deltaY < height * (3 / 4)) {
                    // 中
                    allowDrop = utils.isAllowDrop(state.dragTreeNode!, state.dropTreeNode!, TreeDropType.inner, e)
                    if (!allowDrop) return nothing()

                    state.dropType = TreeDropType.inner
                    state.show = false
                    state.indicatorStyles = {}
                    state.dropInnerKey = treeNode!.key

                } else {
                    // 下
                    allowDrop = utils.isAllowDrop(state.dragTreeNode!, state.dropTreeNode!, TreeDropType.next, e)
                    if (!allowDrop) return nothing()

                    if (treeNode!.isExpand && !!treeNode!.children && treeNode!.children.length > 0) {
                        // 节点已经展开，并且有子节点，表示插入到第一个子节点之前
                        let firstChildTreeNodeDom = undefined

                        if (ctx.$options.name === 'pl-tree') {
                            firstChildTreeNodeDom = e.currentTarget.querySelector('.pl-tree-node')
                        } else if (ctx.$options.name === 'pl-virtual-tree') {
                            firstChildTreeNodeDom = e.currentTarget.nextSibling
                        } else {
                            console.warn(`can't recognise ${ctx.$options.name}`)
                            return nothing
                        }

                        content = (firstChildTreeNodeDom! as HTMLElement).querySelector('.pl-tree-node-content')
                        rect = content.getBoundingClientRect()
                        if (!!rect) {
                            state.dropTreeNode = utils.getTreeNodeFromEl(firstChildTreeNodeDom)

                            width = rect.width
                            left = rect.left
                            top = rect.top

                            width -= state.dropTreeNode!.indicatorLeft
                            left += state.dropTreeNode!.indicatorLeft

                            state.dropType = TreeDropType.prev
                            state.show = true
                            state.dropInnerKey = null
                            state.indicatorStyles = {top, width, left}
                        }

                    } else {
                        // 否则这时候应该将节点插入到目标节点之后
                        state.dropType = TreeDropType.next
                        state.show = true
                        state.dropInnerKey = null
                        state.indicatorStyles = {top: top + height, width, left,}
                    }
                }
            }
        },
    }

    return {
        state,
        handler,
    }
}