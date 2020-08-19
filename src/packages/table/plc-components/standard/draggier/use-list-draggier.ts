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
        startY: 0,                                          // 在mousedown draggier的时候，鼠标的clientY初始值；
        rowEl: null as null | HTMLElement,                  // mousedown 的row的dom对象
        rowElList: [] as HTMLElement[],                     // row dom对象数组
        startIndex: null as null | number,                  // 拖拽开始时的位置索引
        endIndex: null as null | number,                   // 拖拽结束时的位置索引
    }

    const handler = {
        onMousedownDraggier: (e: MouseEvent) => {

            $plain.disableSelect()

            state.startY = e.clientY

            /*---------------------------------------找到rowEl-------------------------------------------*/

            let rowEl = e.target as HTMLElement
            while (!!rowEl && !isItem(rowEl, rowClass)) {
                rowEl = rowEl.parentNode as HTMLElement
            }
            if (!rowEl) {
                throw new Error(`can't find item element!`)
            }
            state.rowEl = rowEl
            rowEl.style.zIndex = `99`
            rowEl.style.position = `relative`
            rowEl.style.zIndex = '3'
            rowEl.style.backgroundColor = '#f2f2f2'

            /*---------------------------------------找到rowElList-------------------------------------------*/
            // @ts-ignore
            state.rowElList = Array.from(rowEl.parentNode.querySelectorAll(`.${rowClass}`) as HTMLElement[])

            state.startIndex = state.rowElList.indexOf(state.rowEl)

            /*---------------------------------------初始化事件-------------------------------------------*/

            document.addEventListener('mouseup', handler.onMouseupDocument)

            state.rowElList.forEach((el: any) => {

                const mouseenter = () => {

                    if (el === state.rowEl) {
                        return
                    }

                    const curRowEl = state.rowEl as any

                    const {top, translateY} = curRowEl.__draggier

                    curRowEl.__draggier.top = el.__draggier.top
                    curRowEl.__draggier.translateY = el.__draggier.translateY

                    el.__draggier.top = top
                    el.__draggier.translateY = translateY

                    el.style.transform = `translateY(${(el.__draggier.top + el.__draggier.translateY) - el.__draggier.offsetTop}px)`
                    curRowEl.style.transform = `translateY(${(curRowEl.__draggier.top + curRowEl.__draggier.translateY) - curRowEl.__draggier.offsetTop}px)`

                    const elIndex = state.endIndex = state.rowElList.indexOf(el)
                    state.endIndex = el.__draggier.top < curRowEl.__draggier.top ? elIndex + 1 : elIndex
                }
                el.__draggier = {
                    // offsetTop = top+translateY
                    offsetTop: el.offsetTop,            // 实际距离顶部滚动距离
                    top: el.offsetTop,                  // 当前虚拟的距离顶部距离
                    translateY: 0,                      // 当前Y轴平移距离
                    // 监听鼠标进入事件
                    mouseenter,
                }
                el.addEventListener('mouseenter', el.__draggier.mouseenter)
            })
        },
        onMouseupDocument: async () => {

            $plain.enableSelect()

            if (state.startIndex != null && state.endIndex != null) {
                await onChange(state.startIndex, state.endIndex)
                await $plain.nextTick()
            }

            document.removeEventListener('mouseup', handler.onMouseupDocument);
            (state.rowEl as any).style.zIndex = '';
            (state.rowEl as any).style.position = '';
            (state.rowEl as any).style.zIndex = '';
            (state.rowEl as any).style.backgroundColor = '';

            state.rowElList.forEach((el: any) => {
                el.removeEventListener('mouseenter', el.__draggier.mouseenter)
                el.style.transform = ''
                delete el.__draggier
            })
        }
    }

    return {
        handler,
    }

}