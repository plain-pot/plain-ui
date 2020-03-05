import {EmitMixin} from "../utils/EmitMixin";

export default {
    install(Vue) {

        const $plain = Vue.prototype.$plain || {}
        Vue.prototype.$plain = $plain

        // 保存根实例对象
        Vue.mixin({
            created() {
                if (!this.$options.parent) {
                    $plain.$root = this
                }
            }
        })

        $plain.EmitMixin = EmitMixin
        $plain.nextTick = () => new Promise(resolve => Vue.prototype.$nextTick(resolve))
        $plain.newInstance = (component, el) => {
            if (!el) {
                el = document.createElement('div')
                document.body.appendChild(el)
            }
            return (new Vue({
                el,
                parent: $plain.$root,
                render(h) {
                    return h(component)
                },
            }).$mount()).$children[0]
        }
        $plain.log = (...args) => {
            console.log(...args)
        }

    }
}