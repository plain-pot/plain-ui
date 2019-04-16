export class ResizeDetector {
    el;
    callback;
    currentWidth;
    currentHeight;
    observer;

    constructor(el, callback) {
        if (!el) {
            console.error('el is not exist!!!')
            return
        }
        this.el = el
        this.callback = callback
        this.observer = new MutationObserver(() => this.detect())
        this.observer.observe(el, {childList: true, subtree: true})

        this.callback({
            newHeight: this.el.offsetHeight,
            oldHeight: this.el.offsetHeight,
            el:this.el,
        });
    }

    /**
     * 检测宽高变化
     * @author  韦胜健
     * @date    2018/12/7 17:16
     */
    detect() {
        if (this.currentHeight !== this.el.offsetHeight)
            this.callback({
                newHeight: this.el.offsetHeight,
                oldHeight: this.currentHeight,
                el:this.el,
            });
        if (this.currentWidth !== this.el.offsetWidth) {
            this.callback({
                newWidth: this.el.offsetWidth,
                oldWidth: this.currentWidth,
                el:this.el,
            });
        }
        this.currentWidth = this.el.offsetWidth;
        this.currentHeight = this.el.offsetHeight;
    }

    /**
     * 销毁mutation observer对象
     * @author  韦胜健
     * @date    2018/12/7 17:16
     */
    destroy() {
        this.observer.disconnect();
        this.observer = null;
    }
}

export default {
    bind(el, binding, vnode) {
        el.__observer__ = new ResizeDetector(el, e => binding.value(e))
    },
    unbind(el, binding) {
        el.__observer__.destroy()
        el.__observer__ = null
        delete el.__observer__;
    }
}