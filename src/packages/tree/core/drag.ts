import {TreeDropType} from "../utils/tree-constant";
import {useAutoScroll} from "../../../use/useAutoScroll";
import Scroll from "../../scroll/scroll";
import {StyleProperties} from "../../../shims";
import {getRowEl} from "../../../utils/getRowEl";
import {getScrollParent} from "../../../utils/getScrollParent";

const indicatorSize = 3;

export function useTreeDraggier<T extends {
    key: string,
    index: number,
    isLeaf: boolean,
    level: number,
    parentRef: () => T | null,
    children?: T[],
    check?: boolean,

    removeSelf: () => void,
    previousSibling: (node: T) => void,
    nextSibling: (node: T) => void,
    unshiftChild: (node: T) => void,
}>(
    {
        rowClass,
        dragClass,
        intent,
        flatList,
        allowDrag,
        allowDrop,
        expand,
        getScroll,
        refreshCheckStatus,
    }: {
        rowClass: string,                               // 行 class 标识
        dragClass: string,                              // 拖拽的节点class标识
        intent: number,                                 // 层级偏移距离
        flatList: { value: T[] },                       // 拍平的数据
        allowDrag?: (node: T) => boolean | undefined,   // 判断元素是否可以拖拽
        allowDrop?: (start: T, move: T, dropType: TreeDropType) => boolean | undefined,// 判断元素是否可以放置
        expand: (node: T) => void,                      // 展开某个元素
        getScroll: () => typeof Scroll.use.class,       // 获取 Scroll 组件实例引用
        refreshCheckStatus: () => void,                 // 刷新所有元素的选中状态
    }
) {

    const state = {

        startNode: null as null | T,                    // 拖拽开始的时候节点
        moveNode: null as null | T,                     // 拖拽移动过程中的节点

        startScrollTop: 0,                              // 开始拖拽的时候，滚动容器的scrollTop
        moveScrollTop: 0,                               // 拖拽移动过程中，滚动容器的scrollTop

        startClientY: 0,                                // 开始拖拽的时候，鼠标的clientY值
        moveClientY: 0,                                 // 拖拽过程中，鼠标的clientY值

        rowHeight: 0,                                   // 行高（不可变，每行高度都必须一样）
        scrollParent: null as null | HTMLElement,       // 滚动容器节点
        rowEl: null as null | HTMLElement,              // 拖拽开始的时候，节点的行dom对象
        scrollParentRect: {                             // 滚动容器的位置属性
            top: 0,
            left: 0,
            width: 0,
            height: 0,
        },
        indicator: null as null | HTMLElement,          // 指示器dom对象
        dragNodeBaseLeft: 0,                            // dragNode(dragClass标识的拖拽元素)的left属性

        dropType: TreeDropType.inner,                   // 当前拖拽移动过程中的放置类型
        droppable: false,                               // 当前拖拽过程中，是否可放置
    }

    const autoScroll = useAutoScroll({vertical: true, getScroll,})

    const utils = {
        /**
         * 获取目标节点所有父节点
         * @author  韦胜健
         * @date    2020/8/25 16:33
         */
        getParents: (node: T | null) => {
            const parents = [] as T[]
            while (!!node && node.level > 0) {
                parents.push(node)
                node = node.parentRef()
            }
            return parents
        },
        allowRowDraggable: (node: T) => {
            return !allowDrag || allowDrag(node) !== false
        },
        allowRowDroppable: (startNode: T, moveNode: T, dropType: TreeDropType) => {
            return !allowDrop || allowDrop(startNode, moveNode, dropType) !== false
        },
        getIndicatorStyles(moveNode: T, droppable: boolean, dropType: TreeDropType) {

            const styles: StyleProperties = {}

            let top = moveNode.index * state.rowHeight + state.scrollParentRect.top - (state.moveScrollTop)
            let paddingLeft = (moveNode.level - 1) * intent
            if (moveNode.isLeaf) paddingLeft += intent

            styles.top = `${dropType === TreeDropType.next ? top + state.rowHeight - indicatorSize : top}px`
            styles.left = `${state.dragNodeBaseLeft + paddingLeft}px`
            styles.width = `${state.scrollParentRect.width - (state.dragNodeBaseLeft - state.scrollParentRect.left) - paddingLeft}px`
            styles.height = `${dropType === TreeDropType.inner ? state.rowHeight : indicatorSize}px`
            styles.backgroundColor = droppable ? '#12b4a5' : '#F38585'
            styles.opacity = dropType === TreeDropType.inner ? '0.15' : ''

            return styles
        },
        refresh() {
            const top = state.startClientY - state.scrollParentRect.top + (state.moveScrollTop) + (state.moveClientY - state.startClientY)
            let targetIndex = top / state.rowHeight
            const external = targetIndex % 1
            targetIndex = Math.floor(targetIndex)
            let dropType: TreeDropType = external < 0.3 ? TreeDropType.prev : external > 0.7 ? TreeDropType.next : TreeDropType.inner
            const moveNode = flatList.value[targetIndex]
            if (!moveNode) {
                return
            }

            let droppable = true

            state.moveNode = moveNode
            const parents = utils.getParents(state.moveNode)
            if (parents.map(n => n.key).indexOf(state.startNode!.key) > -1) {
                droppable = false
            }
            if (!utils.allowRowDroppable(state.startNode!, moveNode, dropType)) {
                droppable = false
            }

            state.dropType = dropType
            state.droppable = droppable

            Object.assign(state.indicator!.style, utils.getIndicatorStyles(moveNode, droppable, dropType))
        },
    }

    const handler = {
        mousedown: (e: DragEvent) => {
            state.startClientY = state.moveClientY = e.clientY

            state.rowEl = getRowEl(e, rowClass)
            state.rowHeight = state.rowEl.offsetHeight
            const vid = Number(state.rowEl.getAttribute('vid'))
            state.moveNode = state.startNode = flatList.value[vid]

            if (!utils.allowRowDraggable(state.startNode)) {
                return
            }

            const dragNode = state.rowEl.querySelector(`.${dragClass}`)!
            state.dragNodeBaseLeft = Math.ceil(dragNode.getBoundingClientRect()!.left)

            state.scrollParent = getScrollParent(state.rowEl)
            state.startScrollTop = state.moveScrollTop = state.scrollParent.scrollTop
            const {top, left, height, width} = (state.scrollParent.parentNode as HTMLElement).getBoundingClientRect()
            state.scrollParentRect = {top, left, height, width}

            state.indicator = document.createElement('div')
            state.indicator.style.position = 'fixed'
            state.indicator.style.pointerEvents = 'none'
            state.indicator.style.height = `${indicatorSize}px`
            state.indicator.style.width = `${state.scrollParentRect.width}px`
            state.indicator.style.left = `${state.scrollParentRect.left}px`
            state.indicator.style.backgroundColor = '#12b4a5'
            document.body.appendChild(state.indicator)

            state.scrollParent.addEventListener('scroll', handler.scroll)
            document.addEventListener('mousemove', handler.mousemove)
            document.addEventListener('mouseup', handler.mouseup)

            utils.refresh()
            autoScroll.showHover()
        },
        scroll() {
            state.moveScrollTop = state.scrollParent!.scrollTop
            utils.refresh()
        },
        /**
         * 在dragover中判断clientX以及clientY，如果这两个值没有变化，就不往下执行，节省性能
         * @author  韦胜健
         * @date    2020/8/25 22:22
         */
        mousemove: (e: MouseEvent) => {
            const {top, height} = state.scrollParentRect
            if (e.clientY < top || e.clientY > top + height) {
                return;
            }
            state.moveClientY = e.clientY
            utils.refresh()
        },
        mouseup: () => {

            autoScroll.hideHover()

            const {startNode, moveNode, dropType, droppable} = state

            state.scrollParent!.removeEventListener('scroll', handler.scroll)
            document.removeEventListener('mousemove', handler.mousemove)
            document.removeEventListener('mouseup', handler.mouseup)

            state.indicator!.parentNode!.removeChild(state.indicator!)
            state.startClientY = state.moveClientY = 0
            state.rowEl = null
            state.rowHeight = 0
            state.moveNode = null
            state.dragNodeBaseLeft = 0
            state.scrollParent = null
            state.startScrollTop = 0
            state.scrollParentRect = {top: 0, left: 0, height: 0, width: 0}

            if (!droppable) {
                return
            }

            startNode!.removeSelf()

            switch (dropType) {
                case TreeDropType.prev:
                    moveNode!.previousSibling(startNode!)
                    break
                case TreeDropType.inner:
                    moveNode!.unshiftChild(startNode!)
                    expand(moveNode!)
                    break
                case TreeDropType.next:
                    moveNode!.nextSibling(startNode!)
                    break
            }

            refreshCheckStatus()
        }
    }

    return {
        handler,
        utils,
    }

}