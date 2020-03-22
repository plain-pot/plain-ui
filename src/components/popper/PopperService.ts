import Controller from './pl-popper-service-controller.vue'
import {Popper, PopperOption} from './Popper'


export default {
    install(Vue) {

        let controller;
        const $plain = Vue.prototype.$plain

        Vue.prototype.$popper = async (option: PopperOption) => {
            if (!controller) {
                controller = $plain.newInstance(Controller)
            }
            return new Popper(option, controller)
        }
    },
}