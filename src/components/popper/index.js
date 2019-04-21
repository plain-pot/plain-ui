import PopperContainer from './pl-popper-container'

class PopperService {
    $plain;
    container;

    constructor($plain) {
        this.$plain = $plain
        this.init()
    }

    async init() {
        await this.$plain.nextTick()
        this.container = this.$plain.newInstance(PopperContainer)
        document.body.appendChild(this.container.$el)
    }

    async newPopper(props) {
        return await this.container.newPopper(props)
    }

    async getPopper(props) {
        return await this.container.getPopper(props)
    }
}

export {PopperService}