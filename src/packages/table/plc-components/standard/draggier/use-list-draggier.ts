import {$plain} from "@/packages/base";

function isItem(rowEl: HTMLElement, rowClass: string): boolean {
    return $plain.utils.hasClass(rowEl, rowClass)
}

export function useListDraggier(
    {
        rowClass,
        onChange,
    }: {
        rowClass: string,
        onChange: (start: number, end: number) => void | Promise<void>
    }
) {

    const state = {

        startIndex: 0,
        endIndex: 0,

        startY: 0,
        dragEl: null as null | HTMLElement,
        dragHeight: 0,
        dragElBakStyle: {} as any,

        rowList: [] as HTMLElement[]
    }

    const utils = {
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
    }

    const handler = {
        mousedown: (e: MouseEvent) => {

            $plain.disableSelect()

            /*---------------------------------------找到rowEl-------------------------------------------*/

            let rowEl = e.target as HTMLElement
            while (!!rowEl && !isItem(rowEl, rowClass)) {
                rowEl = rowEl.parentNode as HTMLElement
            }
            if (!rowEl) {
                throw new Error(`can't find item element!`)
            }

            state.startY = e.clientY

            state.dragElBakStyle = {...rowEl.style}
            state.dragEl = rowEl
            state.dragHeight = rowEl.offsetHeight
            state.dragEl.style.pointerEvents = 'none'
            state.rowList = Array.from(rowEl.parentNode!.querySelectorAll(`.${rowClass}`)) as HTMLElement[]
            state.startIndex = state.rowList.indexOf(rowEl)

            document.addEventListener('mousemove', handler.mousemove)
            document.addEventListener('mouseup', handler.mouseup)

            state.rowList.forEach((rowEl: any, index) => {

                // 如果是当前拖拽的el，则不监听事件，不做任何处理
                if (rowEl === state.dragEl) {
                    return
                }

                const bakStyles = {...rowEl.style}
                rowEl.style.transition = `transform 300ms cubic-bezier(0.23, 1, 0.32, 1)`
                const mouseenter = (e: MouseEvent) => {
                    // e.movementY > 0 表示从上往下进入rowEl
                    if (state.startIndex > index) {
                        // 向上方滑动
                        state.endIndex = e.movementY > 0 ? index + 1 : index
                    } else {
                        // 向下方滑动
                        state.endIndex = e.movementY > 0 ? index : index - 1
                    }
                    utils.refresh()
                }
                rowEl.__draggier = {
                    bakStyles,
                    mouseenter,
                }
                rowEl.addEventListener('mouseenter', rowEl.__draggier.mouseenter)
            })
        },
        mousemove: (e: MouseEvent) => {
            const durY = e.clientY - state.startY
            state.dragEl!.style.transform = `translateY(${durY}px)`
        },
        mouseup: async () => {

            await onChange(state.startIndex, state.endIndex)
            await $plain.nextTick()

            $plain.enableSelect()
            Object.assign(state.dragEl!.style, state.dragElBakStyle)

            document.removeEventListener('mousemove', handler.mousemove)
            document.removeEventListener('mouseup', handler.mouseup)

            state.rowList.forEach((rowEl: any, index) => {

                if (rowEl === state.dragEl) {
                    return
                }

                rowEl.removeEventListener('mouseenter', rowEl.__draggier.mouseenter)
                rowEl.style = rowEl.__draggier.bakStyles
            })
        }
    }

    return {
        handler,
    }

}