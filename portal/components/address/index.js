import Modal from './pl-address-modal'

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

    _ins

    get instance() {
        if (!this._ins) this._ins = this.$plain.newInstance(Modal)
        return this._ins
    }

    codeMap = {}
    queryMap = {}
    privinceData = null

    delayTimer = null

    async getNameByCode(code) {
        return this.codeMap[code] || await this.queryByCode(code);
    }

    async queryByCode(code) {
        if (!!this.queryMap[code]) {
            /*当前正在查询，等待查询完毕*/
            while (!!this.queryMap[code]) {
                await this.$plain.$utils.delay(500)
            }
            return this.codeMap[code]
        } else {
            this.queryMap[code] = true
            this.startQuery()
            return this.queryByCode(code)
        }
    }

    async startQuery() {
        if (!!this.delayTimer) clearTimeout(this.delayTimer)
        this.delayTimer = setTimeout(async () => {
            await this.$plain.nextTick()
            const codes = Object.keys(this.queryMap)
            try {
                const {ret} = await this.queryByCodes(codes)
                const codeMap = ret.reduce((ret, item) => {
                    ret[item.code] = item
                    return ret
                }, {})
                Object.assign(this.codeMap, codeMap)
            } catch (e) {
                console.error(e)
            } finally {
                codes.forEach(type => delete this.queryMap[type])
            }
        }, 500)
    }

    async queryByCodes(codes) {
        const {ret} = await this.$http.post('address/queryByCodes', codes)
        return ret
    }

    async queryByParent(address) {
        const {ret} = await this.$http.post('address/queryByParent', address)
        return ret
    }

    async pick({}) {
        this.instance.pick({})
    }
}

export {AddressService}
