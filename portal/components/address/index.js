class AddressService {

    Vue

    constructor(Vue) {
        this.Vue = Vue
    }

    get $plain() {
        return this.Vue.prototype.$plain
    }

    get $http() {
        return this.Vue.prototype.$http
    }

    data = {}

    async queryByCodes(codes) {
        const {ret} = await this.$http.post('address/queryByCodes', codes)
        return ret
    }

    async queryByParent(address) {
        const {ret} = await this.$http.post('address/queryByParent', address)
        return ret
    }
}

export {AddressService}
