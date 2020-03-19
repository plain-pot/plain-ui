import Mask from './pl-loading-mask.vue'

const map = new WeakMap()

class LoadingDirective {
    $plain;
    mask;

    constructor(private el: HTMLElement, private flag: Boolean, private vnode: any) {
        this.$plain = vnode.context.$plain
        this.mask = this.$plain.newInstance(Mask, {parent: vnode.context, parentNode: el})
        this.mask.p_value = flag
    }

    setFlag(flag: Boolean) {
        this.mask.p_value = flag
    }

    unbind() {
        this.mask.$el.parentNode.removeChild(this.mask.$el)
        this.mask.$destroy()
    }
}

export const PlLoadingDirective = {
    install(Vue) {
        Vue.directive('ploading', {
            bind(el, binding, vnode) {
                map.set(el, new LoadingDirective(el, binding.value, vnode))
            },
            componentUpdated(el, binding) {
                const data = map.get(el) as LoadingDirective
                if (!!data) {
                    data.setFlag(binding.value)
                }
            },
            unbind(el) {
                const data = map.get(el) as LoadingDirective
                if (!!data) {
                    data.unbind()
                }
            },
        })
    }
}