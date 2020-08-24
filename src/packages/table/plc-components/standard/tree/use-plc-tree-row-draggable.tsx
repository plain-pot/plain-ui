/**
 * 树列拖拽排序
 * @author  韦胜健
 * @date    2020/8/24 9:38
 */
import {reactive} from "@vue/composition-api";
import {getRowEl, getScrollParent} from "@/packages/table/plc-components/standard/draggier/composition/utils";

export function usePlcTreeRowDraggable(
    {
        rowDraggable,
        rowClass,
    }: {
        rowDraggable: boolean | undefined,
        rowClass: string,
    }) {

    /**
     * 非响应式属性（状态）
     * @author  韦胜健
     * @date    2020/8/24 22:26
     */
    const normalState = {
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
            console.log('mouseTop', mouseTop)
        }
    }

    const handler = {
        mousedown: (e: MouseEvent) => {

            normalState.dragStartClientY = normalState.dragMoveClientY = e.clientY
            normalState.dragEl = getRowEl(e, rowClass)
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