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
                if (!!binding.value) {
                    let service = new TooltipService(el, binding.value, vnode.context.$plain)
                    map.set(el, service)
                    service.setOpts(el, binding.value)
                }
            },
            componentUpdated(el, binding, vnode) {
                if (!!binding.value) {
                    let service = map.get(el) as TooltipService
                    if (!service) {
                        service = new TooltipService(el, binding.value, vnode.context.$plain)
                        map.set(el, service)
                    }
                    service.setOpts(el, binding.value)
                } else {
                    let service = map.get(el) as TooltipService
                    if (!!service) {
                        service.unbind()
                        service = null
                        map.set(el, service)
                    }
                }
            },
            unbind(el) {
                const service = map.get(el) as TooltipService
                if (!!service) {
                    service.unbind()
                }
            },
        })
    }
}
