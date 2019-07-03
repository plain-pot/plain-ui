import Modal from './pl-address-modal'

class AddressService {

    Vue

    titleMap = {
        'province': '省份',
        'city': '城市',
        'area': '区县',
    }

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
    parentCodeMap = {}
    provinceData = null


    delayTimer = null

    async getNameByCode(code) {
        const target = this.codeMap[code] || await this.queryByCode(code);
        return !!target ? target.name : null
    }

    async getByParent(parent) {
        if (!parent) return this.provinceData || await this.queryByParent(null)
        return this.parentCodeMap[parent.code] || await this.queryByParent(parent)
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
                const ret = await this.queryByCodes(codes)
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
        if (!!ret && ret.length > 0) {
            ret.forEach(item => {
                !this.codeMap[item.code] && (this.codeMap[item.code] = item)
            })
        }
        return ret
    }

    async queryByParent(address) {
        const {ret} = await this.$http.post('address/queryByParent', address)

        if (address == null) {
            this.provinceData = ret
        } else {
            if (!!ret && ret.length > 0) {
                this.parentCodeMap[address.code] = ret
            }
        }
        ret.forEach(item => {
            !this.codeMap[item.code] && (this.codeMap[item.code] = item)
        })
        return ret
    }

    async pick() {
        this.instance.pick(arguments[0])
    }
}

export {AddressService}
