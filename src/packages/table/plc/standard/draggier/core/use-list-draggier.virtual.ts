/**
 * 拖拽排序组合函数，适用于虚拟滚动版本的
 * @author  韦胜健
 * @date    2020/8/21 10:27
 */
import {UseListDraggierType} from "./index";
import {getRowEl, getScrollParent} from "./utils";
import {useAutoScroll} from "../../../../../../use/useAutoScroll";

export const useListDraggierWithVirtual: UseListDraggierType = (
    {
        rowClass,
        onChange,
        getScroll,
    }) => {

    const dragElHeight = 3

    const state = {
        startDragIndex: 0,                                              // 开始拖拽的时候，的行索引
        endDragIndex: 0,                                                // 拖拽结束的时候，应该移动到的索引位置

        startDragOffsetTop: 0,                                          // 开始拖拽的时候，dragEl距离top值（距离可以滚动的父组件的顶部距离）
        startDragHeight: 0,                                             // 拖拽开始的时候，dragEl的高度，虚拟滚动情况下，认为所有row的高度都是一致的，所以这个相当于行高

        startClientY: 0,                                                // 拖拽开始的时候鼠标位置
        moveClientY: 0,                                                 // 拖拽移动的时候鼠标的位置

        scrollParent: null as null | HTMLElement,                       // 可以滚动的父元素
        startScrollTopOfScrollParent: 0,                                // 拖拽开始的时候，滚动父元素的滚动距离 
        scrollTopOfScrollParent: 0,                              // 拖拽开始的时候，滚动父元素的滚动差值
        scrollParentBoundingRect: {
            top: 0,                                                     // 滚动父元素在页面上的top值
            left: 0,                                                    // 滚动父元素在页面上的left值
            width: 0,                                                   // 滚动父元素在页面上的显示宽度
            height: 0,                                                  // 滚动父元素在页面上的显示高度
        },

        dragEl: null as null | HTMLElement,                             // 拖拽的时候，显示的标志元素
    }

    const autoScroll = useAutoScroll({getScroll, vertical: true,})

    const utils = {
        refresh() {
            /*拖拽元素在scrollParent中的top值*/
            const top = state.startDragOffsetTop + (state.moveClientY - state.startClientY) + (state.scrollTopOfScrollParent - state.startScrollTopOfScrollParent) + state.startDragHeight / 2

            /*如果top处于目标index的上方，则index为目标index，在下方则为index+1*/
            let endDragIndex = top / state.startDragHeight
            const external = endDragIndex % 1
            if (external > 0.5) {
                endDragIndex = Math.ceil(endDragIndex)
            } else {
                endDragIndex = Math.floor(endDragIndex)
            }

            /*刷新指示器的位置*/
            state.dragEl!.style.transform = `translateY(${(endDragIndex) * state.startDragHeight - dragElHeight - state.scrollTopOfScrollParent + state.scrollParentBoundingRect.top}px)`

            if (endDragIndex === state.startDragIndex || endDragIndex === state.startDragIndex + 1) {
                state.endDragIndex = state.startDragIndex
            } else if (endDragIndex > state.startDragIndex) {
                state.endDragIndex = endDragIndex - 1
            } else {
                state.endDragIndex = endDragIndex
            }
        },
    }

    const handler = {
        mousedown: (e: MouseEvent) => {
            const dragEl = getRowEl(e, rowClass)
            // 每一行dom对象应该加上一个vid属性，表示这一行为第几个行，否则虚拟滚动情况下，无法知道是哪一行
            const vid = Number(dragEl.getAttribute('vid'))

            // 虚拟滚动下，每一行的行高一致
            const {offsetHeight} = dragEl

            state.startDragIndex = vid
            state.startDragHeight = offsetHeight
            state.startDragOffsetTop = state.startDragIndex * offsetHeight
            state.startClientY = e.clientY
            state.moveClientY = e.clientY

            // 初始化scrollParent
            const scrollParent = getScrollParent(dragEl)
            state.scrollParent = scrollParent
            state.startScrollTopOfScrollParent = scrollParent!.scrollTop
            state.scrollTopOfScrollParent = scrollParent!.scrollTop
            const {top, left, height, width} = state.scrollParent!.parentElement!.getBoundingClientRect()
            state.scrollParentBoundingRect = {top, left, height, width}

            // 初始化监听事件
            scrollParent!.addEventListener('scroll', handler.scroll)
            document.addEventListener('mousemove', handler.mousemove)
            document.addEventListener('mouseup', handler.mouseup)

            //
            state.dragEl = document.createElement('div')
            document.body.appendChild(state.dragEl)
            state.dragEl.style.position = 'fixed'
            state.dragEl.style.left = `${state.scrollParentBoundingRect.left}px`
            state.dragEl.style.height = `${dragElHeight}px`
            state.dragEl.style.width = `0`
            state.dragEl.style.top = '0'
            state.dragEl.style.backgroundColor = '#12b4a5'
            utils.refresh()

            setTimeout(() => {
                state.dragEl!.style.width = `${state.scrollParentBoundingRect.width}px`
                autoScroll.showHover()
            }, 23)
        },
        scroll: () => {
            state.scrollTopOfScrollParent = state.scrollParent!.scrollTop
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

            autoScroll.hideHover()

            document.removeEventListener('mousemove', handler.mousemove)
            document.removeEventListener('mouseup', handler.mouseup)
            state.scrollParent!.removeEventListener('scroll', handler.scroll)

            const {startDragIndex, endDragIndex} = state

            onChange(startDragIndex, endDragIndex)

            state.startDragIndex = 0
            state.endDragIndex = 0
            state.startDragOffsetTop = 0
            state.startDragHeight = 0
            state.startClientY = 0
            state.moveClientY = 0
            state.scrollParent = null
            state.startScrollTopOfScrollParent = 0
            state.scrollTopOfScrollParent = 0
            state.scrollParentBoundingRect = {
                top: 0,
                left: 0,
                width: 0,
                height: 0,
            }
            state.dragEl!.parentNode!.removeChild(state.dragEl!)
            state.dragEl = null

        }
    }

    return {
        handler
    }

}