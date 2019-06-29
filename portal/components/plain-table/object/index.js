import ObjectDialog from './plain-object-dialog'

class PlainObjectService {
    Vue
    insList = []

    get instance() {
        for (let i = 0; i < this.insList.length; i++) {
            const item = this.insList[i];
            if (!item.show) return item
        }
        const newIns = this.newInstance()
        this.insList.push(newIns)
        return newIns
    }

    constructor(Vue) {
        this.Vue = Vue
    }

    newInstance() {
        return this.Vue.prototype.$plain.newInstance(ObjectDialog)
    }

    pick(option, onConfirm, onCancel) {
        this.instance.pick(option, onConfirm, onCancel)
    }
}

export {PlainObjectService}
