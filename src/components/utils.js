import PlainUtils from 'plain-utils'

export default {
    install: Vue => {
        let $plain = Vue.prototype.$plain
        $plain = $plain || {}
        $plain.utils = $plain.utils || PlainUtils

        Vue.prototype.$plain = $plain
    }
}