import Mask from './pl-loading-mask.vue'

const WrapMask = {
    render(h) {
        return <Mask {...{props: this.binding}}/>
    },
    data() {
        return {
            binding: {},
        }
    },
}

class LoadingService {
    $plain;
    mask;

    constructor(private el: HTMLElement, private opts: boolean | object, private context: any) {
        this.$plain = context.$plain
        this.mask = this.$plain.newInstance(WrapMask, {parent: context, parentNode: el})
        this.setOpts(opts)
    }

    setOpts(opts: boolean | object) {
        if (typeof opts === 'boolean') {
            this.mask.binding = {value: opts}
        } else if (typeof opts === 'object') {
            this.mask.binding = {...opts}
        }
    }

    unbind() {
        if (!!this.mask.$el.parentNode) {
            this.mask.$el.parentNode.removeChild(this.mask.$el)
        }
        this.mask.$destroy()
    }
}

export {
    LoadingService
}