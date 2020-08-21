import {UseListDraggierType} from "@/packages/table/plc-components/standard/draggier/composition/index";
import {getRowEl, getScrollParent} from "@/packages/table/plc-components/standard/draggier/composition/utils";

/**
 * 拖拽排序组合函数，适用于虚拟滚动版本的
 * @author  韦胜健
 * @date    2020/8/21 10:27
 */
export const useListDraggierWithVirtual: UseListDraggierType = (
    {
        rowClass,
        onChange,
    }) => {

    const state = {
        startIndex: 0,
        endIndex: 0,

        startOffsetTop: 0,
        dragHeight: 0,
        startClientY: 0,
        moveClientY: 0,
        scrollParent: null as null | HTMLElement,
        dragStartScrollTop: 0,
        dragScrollTop: 0,
    }

    const utils = {
        refresh() {
            const top = state.startOffsetTop + (state.moveClientY - state.startClientY) + state.dragScrollTop
            const endIndex = Math.ceil(Math.max(0, top / state.dragHeight - 0.5))
            console.log(endIndex)
        },
    }

    const handler = {
        mousedown: (e: MouseEvent) => {
            const dragEl = getRowEl(e, rowClass)
            const vid = Number(dragEl.getAttribute('vid'))

            const {offsetHeight} = dragEl

            state.startIndex = vid
            state.dragHeight = offsetHeight
            state.startOffsetTop = state.startIndex * offsetHeight
            state.startClientY = e.clientY
            state.moveClientY = e.clientY

            const scrollParent = getScrollParent(dragEl)
            state.scrollParent = scrollParent
            state.dragStartScrollTop = scrollParent!.scrollTop

            scrollParent!.addEventListener('scroll', handler.scroll)
            document.addEventListener('mousemove', handler.mousemove)
            document.addEventListener('mouseup', handler.mouseup)

            utils.refresh()
        },
        scroll: () => {
            state.dragScrollTop = state.scrollParent!.scrollTop - state.dragStartScrollTop
            utils.refresh()
        },
        mousemove: (e: MouseEvent) => {
            state.moveClientY = e.clientY
            utils.refresh()
        },
        mouseup: (e: MouseEvent) => {

        }
    }

    return {
        handler
    }

}