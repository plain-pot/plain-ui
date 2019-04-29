import PlDialogService from './pl-dialog-service'

class DialogService {

    inses = []

    $plain;

    get instance() {
        const ins = this.$plain.$utils.findOne(this.inses, item => !item.p_value)
        return ins || this.newInstance()
    }

    newInstance() {
        const ins = this.$plain.newInstance(PlDialogService)
        this.inses.push(ins)
        return ins
    }

    constructor($plain) {
        this.$plain = $plain
    }

    show(message, option) {
        this.instance.show(message, option)
    }
}

export {DialogService}