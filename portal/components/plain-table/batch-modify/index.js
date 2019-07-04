import Dialog from './pl-batch-modify-dialog'

class BatchModify {

    Vue

    get $plain() {
        return this.Vue.prototype.$plain
    }

    _ins

    get instance() {
        if (!this._ins) this._ins = this.$plain.newInstance(Dialog)
        return this._ins
    }

    constructor(Vue) {
        this.Vue = Vue
    }

    pick() {
        this.instance.pick(arguments[0] || {})
    }
}

export {BatchModify}
