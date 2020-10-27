import {LoadingService} from "./LoadingService";

const map = new WeakMap()

export const PlLoadingDirective = {
    install(Vue) {
        Vue.directive('loading', {
            bind(el, binding, vnode) {
                map.set(el, new LoadingService(el, binding.value, vnode.context))
            },
            componentUpdated(el, binding) {
                const data = map.get(el) as LoadingService
                if (!!data) {
                    data.updateOption(binding.value)
                }
            },
            unbind(el) {
                const data = map.get(el) as LoadingService
                if (!!data) {
                    data.unbind()
                }
            },
        })
    }
}