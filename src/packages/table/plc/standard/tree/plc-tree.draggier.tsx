import {TableNode} from "../../../core/useTableNode";
import {TreeDropType} from "../../../../tree/utils/tree-constant";
import {useAutoScroll} from "../../../../../use/useAutoScroll";
import {PlainScroll} from "../../../../scroll/scroll";
import {StyleProperties} from "../../../../../shims";
import {getRowEl, getScrollParent} from '../draggier/core/utils';

const indicatorSize = 3;

export function usePlcTreeDraggier(
    {
        rowClass,
        dragClass,
        flatDataList,
        levelPadding,
        props,
        methods,
        getScroll,
        getParents,
    }: {
        rowClass: string,                                                           // 行class
        dragClass?: string,                                                         // 拖拽元素的class
        flatDataList: { value: TableNode[] },                                       // 拍平的数据
        levelPadding: number,
        props: {
            rowDraggable?: boolean,
            allowRowDraggable?: (node: TableNode) => boolean,
            allowRowDroppable?: (start: TableNode, move: TableNode, type: TreeDropType) => boolean,
        },
        methods: {
            expand: (node: TableNode) => void,                      // 展开某个元素
            refreshCheckStatus: () => void,                 // 刷新所有元素的选中状态
            removeSelf: (node: TableNode) => void,
            previousSibling: (self: TableNode, target: TableNode) => void,
            nextSibling: (self: TableNode, target: TableNode) => void,
            unshiftChild: (self: TableNode, target: TableNode) => void,
        },
        getScroll: () => PlainScroll,
        getParents: (node: TableNode) => TableNode[]
    }
) {

    const state = {

        startNode: null as null | TableNode,
        moveNode: null as null | TableNode,

        startScrollTop: 0,
        moveScrollTop: 0,

        startClientY: 0,
        moveClientY: 0,

        rowHeight: 0,
        scrollParent: null as null | HTMLElement,
        rowEl: null as null | HTMLElement,
        scrollParentRect: {
            top: 0,
            left: 0,
            width: 0,
            height: 0,
        },
        indicator: null as null | HTMLElement,
        dragNodeBaseLeft: 0,

        dropType: TreeDropType.inner,
        droppable: false,
    }

    const autoScroll = useAutoScroll({vertical: true, getScroll,})

    const utils = {
        allowDrag: (node: TableNode) => {
            return !props.allowRowDraggable || props.allowRowDraggable(node) !== false
        },
        allowDrop: (startNode: TableNode, moveNode: TableNode, dropType: TreeDropType) => {
            return !props.allowRowDroppable || props.allowRowDroppable(startNode, moveNode, dropType) !== false
        },
        getIndicatorStyles(moveNode: TableNode, droppable: boolean, dropType: TreeDropType) {

            const styles: StyleProperties = {}

            let top = moveNode.index * state.rowHeight + state.scrollParentRect.top - (state.moveScrollTop)
            let paddingLeft = (moveNode.level - state.startNode!.level) * levelPadding

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
            const moveNode = flatDataList.value[targetIndex]
            if (!moveNode) {
                return
            }

            let droppable = true

            state.moveNode = moveNode
            const parents = getParents(state.moveNode)
            parents.push(state.moveNode)
            if (parents.indexOf(state.startNode!) > -1) {
                droppable = false
            }
            if (!utils.allowDrop(state.startNode!, moveNode, dropType)) {
                droppable = false
            }

            state.dropType = dropType
            state.droppable = droppable

            Object.assign(state.indicator!.style, utils.getIndicatorStyles(moveNode, droppable, dropType))
        },
    }

    const handler = {
        mousedown: (e: MouseEvent) => {
            state.startClientY = state.moveClientY = e.clientY

            state.rowEl = getRowEl(e, rowClass)
            state.rowHeight = state.rowEl.offsetHeight
            const vid = Number(state.rowEl.getAttribute('vid'))
            state.moveNode = state.startNode = flatDataList.value[vid]

            if (!utils.allowDrag(state.startNode)) {
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

            methods.removeSelf(startNode!)

            switch (dropType) {
                case TreeDropType.prev:
                    methods.previousSibling(moveNode!, startNode!)
                    break
                case TreeDropType.inner:
                    methods.unshiftChild(moveNode!, startNode!)
                    methods.expand(moveNode!)
                    break
                case TreeDropType.next:
                    methods.nextSibling(moveNode!, startNode!)
                    break
            }
            methods.refreshCheckStatus()
        }
    }

    return {
        utils,
        handler: {onMousedown: handler.mousedown}
    }
}