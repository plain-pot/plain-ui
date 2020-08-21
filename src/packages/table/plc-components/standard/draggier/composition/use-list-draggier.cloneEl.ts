/*
import {$plain} from "@/packages/base";

/!**
 * 获取拖拽的rowEl对象
 * @author  韦胜健
 * @date    2020/8/19 23:55
 *!/
function getRowEl(e: MouseEvent, rowClass: string): HTMLElement {
    let rowEl = e.target as HTMLElement
    while (!!rowEl && !$plain.utils.hasClass(rowEl, rowClass)) {
        rowEl = rowEl.parentNode as HTMLElement
    }
    if (!rowEl) {
        throw new Error(`can't find item element!`)
    }
    return rowEl
}

/!**
 * 获取可以滚动的父组件
 * @author  韦胜健
 * @date    2020/8/19 23:50
 *!/
function getScrollParent(el: HTMLElement): HTMLElement | null {
    while (!!el && el.scrollHeight <= el.offsetHeight) {
        el = el.parentNode as HTMLElement
    }
    return el
}

/!**
 * 获取行el对象的所有兄弟节点
 * @author  韦胜健
 * @date    2020/8/19 23:57
 *!/
function getRowElList(el: HTMLElement, rowClass: string): HTMLElement[] {
    return Array.from(el.parentNode!.querySelectorAll(`.${rowClass}`))
}

export function useListDraggier(
    {
        rowClass,
        onChange,
    }: {
        rowClass: string,                                                           // 行的class，要确保只有行所在的dom对象有这个class，其子节点是没有这个class的
        onChange: (start: number, end: number) => void | Promise<void>,             // 拖拽导致排序变化动作
    }
) {

    const state = {

        startIndex: 0,                              // 拖拽的dragEl在数组中的索引
        endIndex: 0,                                // 拖拽结束的时候，dragEl应该所在的索引位置

        startClientY: 0,                            // 拖拽dragEl起始的时候，e.clientY，与mousemove的时候的e.clientY做差值，以便得到dragEl的偏移距离
        moveClientY: 0,                             // 拖拽move的时候，e.clientY

        dragEl: null as null | HTMLElement,         // 拖拽的时候的dragEl的dom对象
        cloneEl: null as null | HTMLElement,
        cloneDuration: 0,

        dragHeight: 0,                              // 拖拽的时候的dragEl高度，当在下方移动时，下方需要移动的rowEl都应该往上偏移 dragHeight距离，在上方移动时，上方需要移动的rowEl需要往下偏移 dragHeight距离
        dragOffsetTop: 0,

        scrollParent: null as null | HTMLElement,   // 可以滚动的父元素
        dragStartScrollTop: 0,                      // 拖拽开始的时候，scrollParent 的scrollTop位置
        dragScrollTop: 0,                           // scrollParent 的 scroll偏移距离

        rowList: [] as HTMLElement[],               // dragEl的兄弟节点，包含dragEl
    }


    const utils = {
        /!**
         * 根据startIndex以及endIndex，设置这个index范围内的row的dom对象进行上下平移；
         * 如果startIndex大于endIndex，则范围内的row对象，除了startIndex，其他的应该向上平移；
         * 反之，如果startIndex小于endIndex，则范围内的row对象，除了startIndex，其他的应该向下平移；
         *
         * @author  韦胜健
         * @date    2020/8/19 21:09
         *!/
        refresh() {
            const {dragHeight, startIndex, endIndex} = state
            // 是否为向下移动
            const movedown = startIndex < endIndex
            const [start, end] = movedown ? [startIndex, endIndex] : [endIndex, startIndex]

            state.rowList.forEach((el, index) => {
                if (index < start || index > end) {
                    el.style.transform = ``
                    return;
                }
                if (el === state.dragEl) {
                    return
                }
                el.style.transform = `translateY(${movedown ? '-' : ''}${dragHeight}px)`
            })
        },
        refreshDragElPosition() {
            state.cloneEl!.style.transform = `translateY(${state.moveClientY - state.startClientY + state.dragScrollTop + state.cloneDuration}px)`
            const top = (state.moveClientY - state.startClientY) + state.dragScrollTop + state.dragOffsetTop
            state.endIndex = Math.ceil(Math.max(0, top / state.dragHeight - 0.5))

            utils.refresh()
        },
    }

    const handler = {
        mousedown: (e: MouseEvent) => {

            $plain.disableSelect()

            state.startClientY = e.clientY
            state.moveClientY = e.clientY
            state.dragEl = getRowEl(e, rowClass)
            state.dragHeight = state.dragEl.offsetHeight
            state.dragOffsetTop = state.dragEl.offsetTop
            state.rowList = getRowElList(state.dragEl!, rowClass)
            state.startIndex = state.rowList.indexOf(state.dragEl)
            state.scrollParent = getScrollParent(state.dragEl)
            state.dragStartScrollTop = state.scrollParent!.scrollTop

            state.scrollParent!.addEventListener('scroll', handler.parentScroll)
            document.addEventListener('mousemove', handler.mousemove)
            document.addEventListener('mouseup', handler.mouseup)

            state.rowList.forEach((rowEl: any) => {
                // 如果是当前拖拽的el，则不监听事件，不做任何处理
                if (rowEl === state.dragEl) {
                    return
                }
                // 兄弟节点自动进行上下平移
                rowEl.style.transition = `transform 300ms cubic-bezier(0.23, 1, 0.32, 1)`
            })

            state.cloneEl = state.dragEl.cloneNode(true) as HTMLElement
            state.dragEl.parentNode!.appendChild(state.cloneEl)
            state.dragEl.style.visibility = 'hidden'
            state.cloneDuration = state.dragEl.offsetTop - state.cloneEl.offsetTop

            state.cloneEl!.style.transform = `translateY(${state.moveClientY - state.startClientY + state.dragScrollTop + state.cloneDuration}px)`
        },
        mousemove: (e: MouseEvent) => {
            state.moveClientY = e.clientY
            utils.refreshDragElPosition()
        },
        mouseup: async () => {

            await $plain.nextTick()
            $plain.enableSelect()

            state.dragEl!.style.transform = ''
            state.dragEl!.parentNode!.removeChild(state.cloneEl!)
            state.dragEl!.style.visibility = ''
            state.cloneDuration = 0

            document.removeEventListener('mousemove', handler.mousemove)
            document.removeEventListener('mouseup', handler.mouseup)
            state.scrollParent!.removeEventListener('scroll', handler.parentScroll)

            state.rowList.forEach((rowEl: any) => {
                if (rowEl === state.dragEl) {
                    return
                }
                rowEl.style.transition = ''
                rowEl.style.transform = ''
            })

            state.startClientY = 0
            state.moveClientY = 0
            state.dragEl = null
            state.dragHeight = 0
            state.dragOffsetTop = 0
            state.scrollParent = null
            state.dragStartScrollTop = 0
            state.dragScrollTop = 0
            state.rowList = []
            await onChange(state.startIndex, state.endIndex)
            state.startIndex = 0
            state.endIndex = 0
        },
        parentScroll: () => {
            state.dragScrollTop = state.scrollParent!.scrollTop - state.dragStartScrollTop
            utils.refreshDragElPosition()
        }
    }

    return {
        handler,
    }

}*/
