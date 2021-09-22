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
        console.log({e, rowClass})
        throw new Error(`can't find item element!`)
    }
    return rowEl
}