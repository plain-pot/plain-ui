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