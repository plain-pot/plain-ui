import Controller from './pl-dialog-service-controller.vue'

export default {
    install(Vue) {
        const $plain = Vue.prototype.$plain
        let controller = null

        const dialog = async (...args) => {
            if (!controller) {
                controller = await $plain.newInstance(Controller)
            }
            return controller.newService(...args)
        }

        Vue.prototype.$dialog = dialog

    }
};