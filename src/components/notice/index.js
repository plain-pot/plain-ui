import NoticeContainer from './pl-notice-container'

class NoticeService {
    $plain
    containerMap = {}

    defaultOption = {
        message: null,
        type: 'info',
        title: '提示',
        vertical: 'top',
        horizontal: 'right',
    }

    constructor($plain) {
        this.$plain = $plain
    }

    newContainer(vertical, horizontal) {
        const ins = this.$plain.newInstance(NoticeContainer)
        ins.vertical = vertical
        ins.horizontal = horizontal
        return ins
    }

    show(message, option) {
        if (this.$plain.$utils.typeOf(message) === 'object') {
            option = message
        } else {
            option = {message}
        }
        option = Object.assign({}, this.defaultOption, option)
        if (!this.containerMap[`${option.vertical}-${option.horizontal}`]) {
            this.containerMap[`${option.vertical}-${option.horizontal}`] = this.newContainer(option.vertical, option.horizontal)
        }
        this.containerMap[`${option.vertical}-${option.horizontal}`].show(option)
    }
}

export {NoticeService}