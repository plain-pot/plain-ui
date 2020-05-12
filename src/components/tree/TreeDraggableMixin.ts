import {TreeDropType, TreeNode} from "./tree";

export default {
    data() {
        const dragState: {
            show: boolean,
            indicatorStyles: { top?: number, width?: number, left?: number },
            dropInnerKey: string,
            dropType: TreeDropType,
            dropTreeNode: TreeNode,
            dragTreeNode: TreeNode,
            dragstart: Function,
            dragend: Function,
            dragover: Function,
            reflow: boolean,
        }
            = {
            show: false,                                                                    // 当前拖拽指示器是否展示
            indicatorStyles: {},                                                            // 当前指示器样式
            dropInnerKey: null,                                                             // 当前拖拽，即将放入内部的节点的key
            dropType: TreeDropType.null,                                                        // 当前拖拽在目标节点的位置
            dropTreeNode: null,                                                             // 当前放置目标节点的treeNode对象
            dragTreeNode: null,                                                             // 当前拖拽目标节点的treeNode对象
            reflow: false,                                                                  // 当前是否正在重新渲染，重新渲染的时候不要展开动画
            /*---------------------------------------drag listener-------------------------------------------*/
            dragstart: (e) => {
                e.stopPropagation()
                e.dataTransfer.effectAllowed = 'move'

                const dragTreeNode = this.getTreeNodeFromEl(e.currentTarget)

                if (!this.isAllowDrag(dragTreeNode, e)) {
                    e.preventDefault()
                    return
                }

                dragState.dragTreeNode = dragTreeNode
            },
            dragend: (e) => {
                e.stopPropagation()

                dragState.show = false
                dragState.dropInnerKey = null
                dragState.indicatorStyles = {}

                const {dropTreeNode, dragTreeNode, dropType} = dragState

                if (!!dropTreeNode) {
                    dragTreeNode.removeSelf()

                    dragState.reflow = true
                    switch (dropType) {
                        case TreeDropType.prev:
                            // console.log(`添加到 ${dropTreeNode.label} 之前`)
                            dropTreeNode.previousSibling(dragTreeNode)
                            break
                        case TreeDropType.inner:
                            // console.log(`添加到 ${dropTreeNode.label} 内部`)
                            dropTreeNode.appendChild(dragTreeNode)
                            break
                        case TreeDropType.next:
                            // console.log(`添加到 ${dropTreeNode.label} 之后`)
                            dropTreeNode.nextSibling(dragTreeNode)
                            break
                        default:
                            // console.log(`无任何变化`)
                            break
                    }
                    this.refreshCheckStatus()
                    setTimeout(() => dragState.reflow = false, 100)
                }
            },
            /*---------------------------------------drop listener-------------------------------------------*/
            dragover: (e) => {
                e.stopPropagation()
                e.preventDefault()
                e.dataTransfer.dropEffect = 'move'

                const treeNode = this.getTreeNodeFromEl(e.currentTarget)

                let nothing = () => {
                    e.dataTransfer.dropEffect = 'none'
                    dragState.show = false
                    dragState.dropInnerKey = null
                    dragState.indicatorStyles = {}
                    dragState.dropType = TreeDropType.null
                    dragState.dropTreeNode = null
                }

                // 如果当前 over 的节点为拖拽节点的子节点，则什么事也不干，清空标记信息并且什么也不做
                if (treeNode === dragState.dragTreeNode) {
                    nothing()
                    return;
                } else {
                    let containsFlag = false
                    this.iterateAll(dragState.dragTreeNode.children, (child) => {
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
                    dragState.dropTreeNode = treeNode

                    let {height, width, left, top} = rect
                    width -= dragState.dropTreeNode.indicatorLeft
                    left += dragState.dropTreeNode.indicatorLeft

                    let deltaY = e.clientY - top
                    let allowDrop;


                    if (deltaY < height / 4) {
                        // 上
                        allowDrop = this.isAllowDrop(dragState.dragTreeNode, dragState.dropTreeNode, TreeDropType.prev, e)
                        if (!allowDrop) return nothing()

                        dragState.dropType = TreeDropType.prev
                        dragState.show = true
                        dragState.dropInnerKey = null
                        dragState.indicatorStyles = {top, width, left}
                    } else if (deltaY < height * (3 / 4)) {
                        // 中
                        allowDrop = this.isAllowDrop(dragState.dragTreeNode, dragState.dropTreeNode, TreeDropType.inner, e)
                        if (!allowDrop) return nothing()

                        dragState.dropType = TreeDropType.inner
                        dragState.show = false
                        dragState.indicatorStyles = {}
                        dragState.dropInnerKey = treeNode.key

                    } else {
                        // 下
                        allowDrop = this.isAllowDrop(dragState.dragTreeNode, dragState.dropTreeNode, TreeDropType.next, e)
                        if (!allowDrop) return nothing()

                        if (treeNode.isExpand && !!treeNode.children && treeNode.children.length > 0) {
                            // 节点已经展开，并且有子节点，表示插入到第一个子节点之前
                            let firstChildTreeNodeDom = undefined

                            if (this.$options.name === 'pl-tree') {
                                firstChildTreeNodeDom = e.currentTarget.querySelector('.pl-tree-node')
                            } else if (this.$options.name === 'pl-virtual-tree') {
                                firstChildTreeNodeDom = e.currentTarget.nextSibling
                            } else {
                                console.warn(`can't recognise ${this.$options.name}`)
                                return nothing
                            }

                            content = firstChildTreeNodeDom.querySelector('.pl-tree-node-content')
                            rect = content.getBoundingClientRect()
                            if (!!rect) {
                                dragState.dropTreeNode = this.getTreeNodeFromEl(firstChildTreeNodeDom)

                                width = rect.width
                                left = rect.left
                                top = rect.top

                                width -= dragState.dropTreeNode.indicatorLeft
                                left += dragState.dropTreeNode.indicatorLeft

                                dragState.dropType = TreeDropType.prev
                                dragState.show = true
                                dragState.dropInnerKey = null
                                dragState.indicatorStyles = {top, width, left}
                            }

                        } else {
                            // 否则这时候应该将节点插入到目标节点之后
                            dragState.dropType = TreeDropType.next
                            dragState.show = true
                            dragState.dropInnerKey = null
                            dragState.indicatorStyles = {top: top + height, width, left,}
                        }
                    }
                }
            },
        }
        return {
            dragState,
        }
    },
}