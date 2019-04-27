import controller from './pl-select-service-controller'

class SelectService {
    $plain;
    controller;

    constructor($plain) {
        this.$plain = $plain
        this.init()
    }

    async init() {
        await this.$plain.nextTick()
        this.controller = this.$plain.newInstance(controller)

    }

    async getSelect(option) {
        return await this.controller.getSelect(option)
    }
}

export {SelectService}