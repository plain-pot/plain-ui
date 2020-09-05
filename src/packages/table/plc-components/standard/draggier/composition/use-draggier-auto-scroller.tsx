import {injectTable} from "@/packages/table/table/table";
import {PlainScroll} from "@/packages/scroll/scroll";
import {StyleType} from "@/types/utils";
import {$plain} from "@/packages/base";

function createIndicator(hostEl: HTMLElement) {

    const indicatorHeight = 15

    const {top, height, left, width} = hostEl.getBoundingClientRect()

    const indicator = {
        top: document.createElement('div'),
        bottom: document.createElement('div'),
    }

    $plain.utils.addClass(indicator.top, 'pl-auto-scroll-indicator-top')
    $plain.utils.addClass(indicator.bottom, 'pl-auto-scroll-indicator-bottom')

    const publicStyles = {
        position: 'fixed',
        left: `${left}px`,
        width: `${width}px`,
        height: `${indicatorHeight}px`,
        zIndex: `${$plain.nextIndex()}`,
    } as StyleType

    Object.assign(indicator.top.style, {
        ...publicStyles,
        top: `${top}px`,
    } as StyleType)

    let bottomIndicatorTop = top + height - indicatorHeight
    bottomIndicatorTop = Math.min(bottomIndicatorTop, document.body.offsetHeight - indicatorHeight)


    Object.assign(indicator.bottom.style, {
        ...publicStyles,
        top: `${bottomIndicatorTop}px`,
    } as StyleType)

    document.body.appendChild(indicator.top)
    document.body.appendChild(indicator.bottom)

    return indicator
}

export function useDraggierAutoScroller() {

    const table = injectTable()
    const state = {
        indicator: null as null | ReturnType<typeof createIndicator>
    }

    const methods = {
        showHover() {
            const scroll = table.refs.body.$refs.virtualTable.$refs.scroll as PlainScroll
            state.indicator = createIndicator(scroll.refs.host)

            const handler = {
                enterTop: () => {
                    scroll.methods.autoScrollTop()
                },
                enterBottom: () => {
                    scroll.methods.autoScrollBottom()
                },
                leave: () => {
                    scroll.methods.stopAutoScroll()
                }
            }

            state.indicator.top.addEventListener('mouseenter', handler.enterTop)
            state.indicator.bottom.addEventListener('mouseenter', handler.enterBottom)

            state.indicator.top.addEventListener('mouseleave', handler.leave)
            state.indicator.bottom.addEventListener('mouseleave', handler.leave)
        },
        hideHover() {
            if (!!state.indicator) {
                state.indicator.top.parentNode!.removeChild(state.indicator.top)
                state.indicator.bottom.parentNode!.removeChild(state.indicator.bottom)
            }
        },
    }

    return {
        methods,
    }
}