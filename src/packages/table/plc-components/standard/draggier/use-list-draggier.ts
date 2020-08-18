import {$plain} from "@/packages/base";

function isItem(rowEl: HTMLElement, rowClass: string): boolean {
    return $plain.utils.hasClass(rowEl, rowClass)
}

export function useListDraggier(
    {
        rowClass,
    }: {
        rowClass: string
    }
) {

    const state = {
        startY: 0,                                          // 在mousedown draggier的时候，鼠标的clientY初始值；
        rowEl: null as null | HTMLElement,                  // mousedown 的row的dom对象
        rowElList: [] as HTMLElement[],                     // row dom对象数组
    }

    const handler = {
        onMousedownDraggier: (e: MouseEvent) => {
            state.startY = e.clientY
            let rowEl = e.target as HTMLElement
            while (!!rowEl && !isItem(rowEl, rowClass)) {
                rowEl = rowEl.parentNode as HTMLElement
            }
            if (!rowEl) {
                throw new Error(`can't find item element!`)
            }
            state.rowEl = rowEl
            rowEl.style.boxShadow = `0 0px 10px #eeeeee`
            // @ts-ignore
            state.rowElList = Array.from(rowEl.parentNode.querySelectorAll(`.${rowClass}`) as HTMLElement[])

            document.addEventListener('mousemove', handler.onMousemoveDocument)
            document.addEventListener('mouseup', handler.onMouseupDocument)
        },
        onMousemoveDocument: (e: MouseEvent) => {
            const durY = e.clientY - state.startY
            state.rowEl!.style.transform = `translateY(${durY}px)`
        },
        onMouseupDocument: () => {
            document.removeEventListener('mousemove', handler.onMousemoveDocument)
            document.removeEventListener('mouseup', handler.onMouseupDocument)
        }
    }

    return {
        handler,
    }

}