// @ts-ignore
import PlainPopper from 'plain-popper'

const PlainTooltip = PlainPopper.PlainTooltip

class TooltipService {

    static defaultOptions = {
        placement: 'top',
        arrow: true,
        theme: 'dark',
        animate: 'fade',
        trigger: 'hover',
    }

    tooltip;
    $plain;

    constructor(el: HTMLElement, opts: object | string, $plain) {
        this.$plain = $plain
        this.setOpts(el, opts)
    }

    async setOpts(el: HTMLElement, opts: object | string) {
        await this.$plain.nextTick()
        if (!!this.tooltip) {
            this.tooltip.destroy()
            this.tooltip = null
        }
        if (!!opts) {
            if (typeof opts === "string") {
                opts = {content: opts}
            }
            opts = Object.assign({targetEl: el}, TooltipService.defaultOptions, opts)
            this.tooltip = new PlainTooltip(opts)
        }
    }

    unbind() {
        if (!!this.tooltip) {
            this.tooltip.destroy()
        }
    }
}

const map = new WeakMap()

export const TooltipDirective = {
    install(Vue) {
        Vue.directive('tooltip', {
            bind(el, binding, vnode) {
                map.set(el, new TooltipService(el, binding.value, vnode.context.$plain))
            },
            componentUpdated(el, binding) {
                const data = map.get(el) as TooltipService
                if (!!data) {
                    data.setOpts(el, binding.value)
                }
            },
            unbind(el) {
                const data = map.get(el) as TooltipService
                if (!!data) {
                    data.unbind()
                }
            },
        })
    }
}
