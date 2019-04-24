import PopperContainer from './pl-popper-container'

class PopperService {
    $plain;
    container;

    constructor($plain) {
        this.$plain = $plain
        this.init()
    }

    async init() {
        this.container = this.$plain.newInstance(PopperContainer)
        console.log(this.container)
    }

    async newPopper(props) {
        return await this.container.newPopper(props)
    }

    async getPopper(props) {
        return await this.container.getPopper(props)
    }
}

export {PopperService}