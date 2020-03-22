import Controller from './pl-popper-service-controller.vue'

class PopperService {
    constructor(opts) {

    }
}

export default {
    install(Vue) {

        let controller;
        const $plain = Vue.prototype.$plain

        Vue.prototype.$popper = async (opts) => {
            if (!controller) {
                controller = $plain.newInstance(Controller)
            }
            const service = await controller.getService()
            await service.show(opts)
        }
    },
}