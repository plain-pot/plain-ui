import {PlainUtils} from "@/util/util";

export const DEFAULT_STATUS = 'primary'

export let $plain: {
    utils: PlainUtils,
    $root: any,
    nextTick: (callback?: () => void) => Promise<any>,
    newInstance: (component: any, option?: { el?: HTMLElement, parent?: any, parentNode?: HTMLElement }) => any,
    log: (...args: any[]) => void
    nextIndex: () => number,
    enableSelect: () => void,
    disableSelect: () => void,
    STATUS: {
        white: { icon: string, status: string },
        black: { icon: string, status: string },
        primary: { icon: string, status: string },
        success: { icon: string, status: string },
        warn: { icon: string, status: string },
        error: { icon: string, status: string },
        info: { icon: string, status: string },
    },
    $message: ((message: string | object, option: object) => void) | any
} = {} as any

export default {
    install(Vue) {

        // 保存根实例对象
        Vue.mixin({
            created() {
                if (!this.$options.parent) {
                    $plain.$root = this
                }
            }
        })

        $plain.utils = PlainUtils

        $plain.nextTick = (() => {
            const $nextTick = Vue.prototype.$nextTick
            return (callback) => {
                return new Promise((resolve) => {
                    $nextTick(() => {
                        resolve()
                        if (!!callback) {
                            callback()
                        }
                    })
                })
            }
        })()


        /**
         * 创建一个vue实例
         * @author  韦胜健
         * @date    2020/3/5 11:56
         * @param   component:string|object             实例组件，可以是组件全局注册的字符串名称，必填，不能没有
         * @param   el:HTMLElement                      实例组件挂载的dom元素，没有则创建一个div元素
         * @param   parent:vnode                        实例组件的父组件实例对象，用来继承一些属性，比如 $router,$store以及 provide上下文之类的等等，没有则为 $root 根实例对象
         * @param   parentNode                          实例组件所挂载dom元素的父元素，没有则为 document.body
         */
        $plain.newInstance = (component, option) => {

            let {el, parent, parentNode} = (option || {})

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
        $plain.log = (...args) => console.log(...args)
        $plain.nextIndex = ((startIndex) => {
            let index = startIndex
            return () => {
                return index++
            }
        })(1500)
        $plain.enableSelect = () => $plain.utils.removeClass(document.body, 'pl-select-none')
        $plain.disableSelect = () => $plain.utils.addClass(document.body, 'pl-select-none')
        $plain.STATUS = {
            white: {icon: 'el-icon-info', status: 'white'},
            black: {icon: 'el-icon-info', status: 'black'},
            primary: {icon: 'el-icon-info', status: 'primary'},
            success: {icon: 'el-icon-success', status: 'success'},
            warn: {icon: 'el-icon-warning', status: 'warn'},
            error: {icon: 'el-icon-error', status: 'error'},
            info: {icon: 'el-icon-question', status: 'info'},
        }

        const $message = (message, option) => {
            if (!!Vue.prototype.$message) return Vue.prototype.$message(message, option)
            return alert(message)
        }
        Object.keys($plain.STATUS).forEach(status => $message[status] = (message, option = {}) => $message(message, {status, ...option}))
        $plain.$message = $message

        // console.log('install plain')
        Vue.prototype.$plain = $plain
    }
    ,
}