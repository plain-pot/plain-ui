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

        /**
         * 创建一个vue实例
         * @author  韦胜健
         * @date    2020/3/5 11:56
         * @param   component:string|object             实例组件，可以是组件全局注册的字符串名称，必填，不能没有
         * @param   el:HTMLElement                      实例组件挂载的dom元素，没有则创建一个div元素
         * @param   parent:vnode                        实例组件的父组件实例对象，用来继承一些属性，比如 $router,$store以及 provide上下文之类的等等，没有则为 $root 根实例对象
         * @param   parentNode                          实例组件所挂载dom元素的父元素，没有则为 document.body
         */
        $plain.newInstance = (component, {el, parent, parentNode} = {}) => {

            parentNode = parentNode || document.body
            el = el || document.createElement('div')
            parent = parent || $plain.$root

            if (!el.parentNode) {
                parentNode.appendChild(el)
            }

            return (new Vue({
                el,
                parent,
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