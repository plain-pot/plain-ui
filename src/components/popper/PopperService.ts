import Controller from './pl-popper-service-controller.vue'

class PopperService {
    constructor(option) {

    }
}

export default {
    install(Vue) {

        let controller;
        const $plain = Vue.prototype.$plain

        Vue.prototype.$popper = async (option) => {
            if (!controller) {
                controller = $plain.newInstance(Controller)
            }
            const service = await controller.getService()
            await service.show(option)
        }
    },
}