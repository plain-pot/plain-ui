import {onBeforeUnmount, watch} from "vue";
import {delay} from "plain-utils/utils/delay";

export interface ResizeDetectFuncParam {
    width?: number
    height?: number
    oldWidth?: number
    oldHeight?: number
    el?: HTMLElement

    [key: string]: any
}

export interface ResizeDetectFunc {(option: ResizeDetectFuncParam): void}

function createResizeDetector(el: HTMLElement, callback: ResizeDetectFunc) {

    const state = {
        observer: undefined as undefined | MutationObserver,
        width: undefined as undefined | number,
        height: undefined as undefined | number,
        oldWidth: undefined as undefined | number,
        oldHeight: undefined as undefined | number,
    }

    const runCallback = (data: ResizeDetectFuncParam) => {
        Object.keys(data).forEach(key => {
            if (data[key] != null && typeof data[key] === 'number') data[key] = Math.ceil(data[key])
        })
        callback(data)
    }

    const detect = () => {
        const {scrollHeight: height, scrollWidth: width} = el
        if (width === state.width && height === state.height) return
        const ret = {} as ResizeDetectFuncParam
        if (width !== state.width) {
            ret.width = width
            ret.oldWidth = state.width
            state.width = width
        }
        if (height !== state.height) {
            ret.height = height
            ret.oldHeight = state.height
            state.height = height
        }
        runCallback(ret)
    }

    const destroy = () => {
        if (!!state.observer) {
            state.observer.disconnect();
            state.observer = undefined
        }
    }

    const init = () => {
        if (!el) {return console.error(`el is ${typeof el}`)}
        state.observer = new MutationObserver(detect)
        state.observer.observe(el, {childList: true, subtree: true})
        // const {width, height} = el.getBoundingClientRect()
        const {scrollHeight, scrollWidth} = el
        state.width = scrollWidth
        state.height = scrollHeight
        runCallback({...state, el,})
    }

    init()

    return {
        detect,
        destroy,
    }
}

type ResizeDetector = ReturnType<typeof createResizeDetector>

export function useResizeDetector(
    {
        elGetter,
        onResize,
    }: {
        elGetter: () => HTMLElement | undefined | null,
        onResize: ResizeDetectFunc,
    }) {

    const state = {resizeDetector: null as null | ResizeDetector,}

    watch(elGetter, async el => {
        await delay(0)
        if (!!state.resizeDetector) {state.resizeDetector.destroy()}
        state.resizeDetector = null
        !!el && (state.resizeDetector = createResizeDetector(el, onResize))
    }, {immediate: true})

    !!state.resizeDetector && state.resizeDetector.detect()

    onBeforeUnmount(() => {!!state.resizeDetector && state.resizeDetector.destroy()})
}

