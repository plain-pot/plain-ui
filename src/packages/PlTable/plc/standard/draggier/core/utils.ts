/**
 * 获取拖拽的rowEl对象
 * @author  韦胜健
 * @date    2020/8/19 23:55
 */
import {hasClass} from "plain-utils/dom/hasClass";

export function getRowEl(e: MouseEvent, rowClass: string): HTMLElement {
    let rowEl = e.target as HTMLElement
    while (!!rowEl && !hasClass(rowEl, rowClass)) {
        rowEl = rowEl.parentNode as HTMLElement
    }
    if (!rowEl) {
        throw new Error(`can't find item element!`)
    }
    return rowEl
}

/**
 * 获取可以滚动的父组件
 * @author  韦胜健
 * @date    2020/8/19 23:50
 */
export function getScrollParent(el: HTMLElement): HTMLElement {
    while (!!el && el.scrollHeight <= el.offsetHeight) {
        el = el.parentNode as HTMLElement
    }
    return el
}

/**
 * 获取行el对象的所有兄弟节点
 * @author  韦胜健
 * @date    2020/8/19 23:57
 */
export function getRowElList(el: HTMLElement, rowClass: string): HTMLElement[] {
    return Array.from(el.parentNode!.querySelectorAll(`.${rowClass}`))
}