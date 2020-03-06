import Controller from './pl-select-service-controller.vue'

const SelectService = {
    controller: null,
    $plain: null,
    install(Vue) {
        this.$plain = Vue.prototype.$plain
        this.$plain.$select = SelectService
    },
    newSelect() {
        if (!this.controller) {
            this.controller = this.$plain.newInstance(Controller)
        }
        return this.controller.newSelect(arguments[0])
    },
}


export default SelectService;