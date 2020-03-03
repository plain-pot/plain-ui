import {ResizeDetectFunc, ResizeDetectFuncParam} from "../types/utils";

export default class ResizeDetector {

    observer?: MutationObserver
    width?: number
    height?: number

    constructor(public el: HTMLElement, public callback: ResizeDetectFunc) {

        if (!el) {
            console.error(`el is ${typeof el}`)
            return
        }

        this.observer = new MutationObserver(this.detect)

        this.observer.observe(el, {
            childList: true,
            subtree: true
        })

        // const {width, height} = el.getBoundingClientRect()
        const {scrollHeight: height, scrollWidth: width} = el
        this.width = width
        this.height = height
        this.runCallback({
            width,
            height,
            el
        })
    }

    detect = () => {
        // const {width, height} = this.el.getBoundingClientRect()
        const {scrollHeight: height, scrollWidth: width} = this.el
        if (width === this.width && height === this.height) return
        const ret = {} as ResizeDetectFuncParam
        if (width !== this.width) {
            ret.width = width
            ret.oldWidth = this.width
            this.width = width
        }
        if (height !== this.height) {
            ret.height = height
            ret.oldHeight = this.height
            this.height = height
        }
        this.runCallback(ret)
    }

    runCallback(data: ResizeDetectFuncParam) {
        Object.keys(data).forEach(key => {
            if (data[key] != null && typeof data[key] === 'number') data[key] = Math.ceil(data[key])
        })
        this.callback(data)
    }

    destroy() {
        if (!!this.observer) {
            this.observer.disconnect();
            this.observer = undefined
        }
    }
}

export const ResizeDetectorDirective = {
    inserted(el: any, binding: any, vnode: any) {
        el.__resizedetextor__ = new ResizeDetector(el, (data) => binding.value(data))
    },
    unbind(el: any) {
        (el.__resizedetextor__ as ResizeDetector).destroy()
        delete el.__resizedetextor__
    },
}

