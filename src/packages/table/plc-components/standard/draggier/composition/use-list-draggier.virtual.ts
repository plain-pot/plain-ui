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

    const dragElHeight = 3

    const state = {
        startIndex: 0,
        endIndex: 0,

        startOffsetTop: 0,
        dragHeight: 0,
        startClientY: 0,
        moveClientY: 0,
        scrollParent: null as null | HTMLElement,
        dragStartScrollTop: 0,
        scrollParentScrollTop: 0,
        scrollParentBoundingRect: {
            top: 0,
            left: 0,
            width: 0,
            height: 0,
        },

        dragEl: null as null | HTMLElement,
    }

    const utils = {
        refresh() {
            const top = state.startOffsetTop + (state.moveClientY - state.startClientY) + (state.scrollParentScrollTop - state.dragStartScrollTop)
            const endIndex = Math.ceil(Math.max(0, top / state.dragHeight - 0.5))
            state.dragEl!.style.transform = `translateY(${(endIndex + 1) * state.dragHeight - dragElHeight - state.scrollParentScrollTop + state.scrollParentBoundingRect.top}px)`
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
            const {top, left, height, width} = state.scrollParent!.parentElement!.getBoundingClientRect()
            state.scrollParentBoundingRect = {top, left, height, width}

            scrollParent!.addEventListener('scroll', handler.scroll)
            document.addEventListener('mousemove', handler.mousemove)
            document.addEventListener('mouseup', handler.mouseup)

            state.dragEl = document.createElement('div')
            document.body.appendChild(state.dragEl)
            state.dragEl.style.position = 'fixed'
            state.dragEl.style.left = `${state.scrollParentBoundingRect.left}px`
            state.dragEl.style.height = `${dragElHeight}px`
            state.dragEl.style.width = `0`
            state.dragEl.style.top = '0'
            state.dragEl.style.backgroundColor = 'rgba(0,0,0,0.15)'
            state.dragEl.style.transition = 'width 1000ms cubic-bezier(0.23, 1, 0.32, 1), transform 500ms cubic-bezier(0.23, 1, 0.32, 1)'
            utils.refresh()

            setTimeout(() => {
                state.dragEl!.style.width = `${state.scrollParentBoundingRect.width}px`
            }, 23)
        },
        scroll: () => {
            state.scrollParentScrollTop = state.scrollParent!.scrollTop
            utils.refresh()
        },
        mousemove: (e: MouseEvent) => {
            if (e.clientY < state.scrollParentBoundingRect.top) {
                return
            }
            if (e.clientY > state.scrollParentBoundingRect.top + state.scrollParentBoundingRect.height - 10) {
                return
            }
            state.moveClientY = e.clientY
            utils.refresh()
        },
        mouseup: (e: MouseEvent) => {
            document.removeEventListener('mousemove', handler.mousemove)
            document.removeEventListener('mouseup', handler.mouseup)
            state.scrollParent!.removeEventListener('scroll', handler.scroll)
        }
    }

    return {
        handler
    }

}