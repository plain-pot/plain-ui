import Controller from './pl-select-service-controller.vue'

const SelectService = {
    controller: null,
    $plain: null,
    install(Vue) {
        this.$plain = Vue.prototype.$plain
        this.$plain.$select = (option) => {
            if (!this.controller) {
                this.controller = this.$plain.newInstance(Controller)
            }
            return this.controller.newService(option)
        }
    },
}


export default SelectService;