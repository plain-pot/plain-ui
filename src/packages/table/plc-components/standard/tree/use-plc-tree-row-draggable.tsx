/**
 * 树列拖拽排序
 * @author  韦胜健
 * @date    2020/8/24 9:38
 */
import {reactive, Ref} from "@vue/composition-api";
import {getRowEl, getScrollParent} from "@/packages/table/plc-components/standard/draggier/composition/utils";
import {TableNode} from "@/packages/table/table/TableNode";

enum HoverPart {
    prev = 'prev',
    inner = 'inner',
    next = 'next'
}

export function usePlcTreeRowDraggable(
    {
        rowDraggable,
        rowClass,
        flatDataList,
    }: {
        rowDraggable: boolean | undefined,
        rowClass: string,
        flatDataList: Readonly<Ref<readonly TableNode[]>>,
    }) {

    /**
     * 非响应式属性（状态）
     * @author  韦胜健
     * @date    2020/8/24 22:26
     */
    const normalState = {
        rowHeight: 0,
        dragStartTableNode: null as null | TableNode,
        dragStartClientY: 0,
        dragMoveClientY: 0,

        dragStartScrollTop: 0,
        dragMoveScrollTop: 0,

        dragEl: null as null | HTMLElement,
        scrollParent: null as null | HTMLElement,

        scrollParentRect: {
            top: 0,
            left: 0,
            width: 0,
            height: 0,
        }
    }

    /**
     * 响应式属性（状态）
     * @author  韦胜健
     * @date    2020/8/24 22:26
     */
    const reactiveState = reactive({})

    const utils = {
        refresh: () => {
            const {dragStartClientY, dragMoveClientY, dragStartScrollTop, dragMoveScrollTop, scrollParentRect: {top, left}} = normalState
            const mouseTop = dragMoveClientY - top + (dragMoveScrollTop - dragStartScrollTop)

            let hoverIndex = Math.floor(mouseTop / normalState.rowHeight)
            hoverIndex = Math.min(Math.max(0, hoverIndex), flatDataList.value.length - 1)

            const external = mouseTop % normalState.rowHeight
            let part: HoverPart = external < normalState.rowHeight * (1 / 3) ? HoverPart.prev :
                external > normalState.rowHeight * (2 / 3) ? HoverPart.next : HoverPart.inner

            
        }
    }

    const handler = {
        mousedown: (e: MouseEvent) => {

            normalState.dragStartClientY = normalState.dragMoveClientY = e.clientY
            normalState.dragEl = getRowEl(e, rowClass)
            normalState.rowHeight = normalState.dragEl.offsetHeight
            const vid = Number(normalState.dragEl.getAttribute('vid'))
            normalState.dragStartTableNode = flatDataList.value[vid]!
            normalState.scrollParent = getScrollParent(normalState.dragEl)
            normalState.dragStartScrollTop = normalState.scrollParent.scrollTop
            normalState.dragMoveScrollTop = normalState.scrollParent.scrollTop
            const {height, width, left, top} = normalState.scrollParent.getBoundingClientRect()!
            normalState.scrollParentRect = {height, width, left, top}

            normalState.scrollParent.parentNode!.addEventListener('mousemove', handler.mousemove as any)
            normalState.scrollParent.addEventListener('scroll', handler.scroll)
            document.addEventListener('mouseup', handler.mouseup)

            utils.refresh()
        },
        scroll: () => {
            normalState.dragMoveScrollTop = normalState.scrollParent!.scrollTop
            utils.refresh()
        },
        mousemove: (e: MouseEvent) => {
            normalState.dragMoveClientY = e.clientY
            utils.refresh()
        },
        mouseup: () => {

            normalState.scrollParent!.parentNode!.removeEventListener('mousemove', handler.mousemove as any)
            normalState.scrollParent!.removeEventListener('scroll', handler.scroll)
            document.removeEventListener('mouseup', handler.mouseup)

        }
    }

    return {
        utils,
        handler,
    }
}