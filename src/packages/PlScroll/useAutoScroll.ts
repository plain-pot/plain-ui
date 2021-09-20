import {StyleProperties} from "plain-ui-composition/src/use/useStyles";
import {addClass} from "plain-utils/dom/addClass";
import {PlScroll} from "./index";
import {nextIndex} from "../../utils/nextIndex";

function createIndicator(hostEl: HTMLElement, vertical: boolean) {

    const indicatorSize = 15

    const {top, height, left, width} = hostEl.getBoundingClientRect()

    const indicator = {
        start: document.createElement('div'),
        end: document.createElement('div'),
    }

    addClass(indicator.start, `pl-auto-scroll-indicator-start pl-auto-scroll-indicator-${vertical ? 'vertical' : 'horizontal'}`)
    addClass(indicator.end, `pl-auto-scroll-indicator-end pl-auto-scroll-indicator-${vertical ? 'vertical' : 'horizontal'}`)

    const publicStyles = {
        position: 'fixed',
        left: `${left}px`,
        top: `${top}px`,

        width: `${vertical ? width : indicatorSize}px`,
        height: `${vertical ? indicatorSize : height}px`,
        zIndex: `${nextIndex()}`,
    } as StyleProperties

    Object.assign(indicator.start.style, publicStyles)

    if (vertical) {
        let bottomIndicatorTop = top + height - indicatorSize
        bottomIndicatorTop = Math.min(bottomIndicatorTop, document.body.offsetHeight - indicatorSize)

        Object.assign(indicator.end.style, {
            ...publicStyles,
            top: `${bottomIndicatorTop}px`,
        } as StyleProperties)
    } else {
        let rightIndicatorLeft = left + width - indicatorSize
        rightIndicatorLeft = Math.min(rightIndicatorLeft, document.body.offsetWidth - indicatorSize)
        Object.assign(indicator.end.style, {
            ...publicStyles,
            left: `${rightIndicatorLeft}px`,
        } as StyleProperties)
    }

    document.body.appendChild(indicator.start)
    document.body.appendChild(indicator.end)

    return indicator
}

export function useAutoScroll(config: {
    getScroll: () => typeof PlScroll.use.class,
    vertical: boolean,
}) {

    let {getScroll, vertical} = config

    const state = {
        indicator: null as null | ReturnType<typeof createIndicator>
    }

    const methods = {
        showHover() {

            const scroll = getScroll()
            state.indicator = createIndicator(scroll.refs.host!, vertical)

            const handler = {
                enterStart: () => {
                    vertical ? scroll.methods.autoScrollTop() : scroll.methods.autoScrollLeft()
                },
                enterEnd: () => {
                    vertical ? scroll.methods.autoScrollBottom() : scroll.methods.autoScrollRight()
                },
                leave: () => {
                    scroll.methods.stopAutoScroll()
                }
            }

            state.indicator.start.addEventListener('mouseenter', handler.enterStart)
            state.indicator.end.addEventListener('mouseenter', handler.enterEnd)

            state.indicator.start.addEventListener('mouseleave', handler.leave)
            state.indicator.end.addEventListener('mouseleave', handler.leave)
        },
        hideHover() {
            if (!!state.indicator) {
                state.indicator.start.parentNode!.removeChild(state.indicator.start)
                state.indicator.end.parentNode!.removeChild(state.indicator.end)
            }
        },
    }

    return methods

}