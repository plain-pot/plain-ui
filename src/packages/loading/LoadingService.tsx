import Mask from './pl-loading-mask.vue'

const WrapMask = {
    render(h) {
        // @ts-ignore
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

    constructor(private el: HTMLElement, private option: boolean | object, private context: any) {
        this.$plain = context.$plain
        this.mask = this.$plain.newInstance(WrapMask, {parent: context, parentNode: el})
        this.updateOption(option)
    }

    updateOption(option: boolean | object) {
        if (typeof option === 'boolean') {
            this.mask.binding = {value: option}
        } else if (typeof option === 'object') {
            this.mask.binding = {...option}
        }
    }

    unbind() {
        if (!!this.mask.$el.parentNode) {
            this.mask.$el.parentNode.removeChild(this.mask.$el)
        }
        this.mask.$destroy()
    }

    static install(Vue) {
        let mask;
        const $plain = Vue.prototype.$plain
        const $loading = (option) => {
            if (!mask) {
                mask = new LoadingService(document.body, option, $plain.$root)
            }
            mask.updateOption(option)
        }
        Vue.prototype.$loading = $loading
    }
}

export {
    LoadingService
}