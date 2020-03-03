import PlainUtils from 'plain-utils'
import {plugin} from "../utils";

export default plugin({
    install: Vue => {
        Vue.prototype.$plain.utils = PlainUtils
    }
})