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

    constructor(el: HTMLElement, option: object | string, $plain) {
        this.$plain = $plain
        this.updateOption(el, option)
    }

    async updateOption(el: HTMLElement, option: object | string) {
        await this.$plain.nextTick()
        if (!!this.tooltip) {
            this.tooltip.destroy()
            this.tooltip = null
        }
        if (!!option) {
            if (typeof option === "string") {
                option = {content: option}
            }
            option = Object.assign({targetEl: el}, TooltipService.defaultOptions, option)
            this.tooltip = new PlainTooltip(option)
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
                    service.updateOption(el, binding.value)
                }
            },
            componentUpdated(el, binding, vnode) {
                if (!!binding.value) {
                    let service = map.get(el) as TooltipService
                    if (!service) {
                        service = new TooltipService(el, binding.value, vnode.context.$plain)
                        map.set(el, service)
                    }
                    service.updateOption(el, binding.value)
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
