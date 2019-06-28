import FormDialog from './plain-table-form-dialog'

class TableFormDialog {
    Vue

    insList = []

    get instance() {
        for (let i = 0; i < this.insList.length; i++) {
            const item = this.insList[i];
            if (!item.show) return item
        }
        const newIns = this.Vue.prototype.$plain.newInstance(FormDialog)
        this.insList.push(newIns)
        return newIns
    }

    constructor(Vue) {
        this.Vue = Vue
    }

    edit({cols, row}) {
        this.instance.edit(arguments[0])
    }
}

export default TableFormDialog