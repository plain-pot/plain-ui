import {EmitMixin} from "../utils/EmitMixin";

export default {
    install(Vue) {
        Vue.prototype.$plain = {
            ...(Vue.prototype.$plain || {}),
            EmitMixin,
            nextTick: () => new Promise(resolve => Vue.prototype.$nextTick(resolve)),
        }
    }
}