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

    async newPopper({reference, popper, direction, align} = {}) {
        return await this.container.newPopper({reference, popper, direction, align})
    }
}

export {PopperService}