import {$plain} from "@/packages/base";
import {PlainTooltip} from "../../../submodules/plain-popper/PlainTooltip";
import {PlainTooltipConfig} from "../../../submodules/plain-popper/PlainTooltipUtils";

class Tooltip {

    static DEFAULT_OPTION = {
        placement: 'top',
        theme: 'dark',
        animate: 'fade',
        trigger: 'hover',
    }

    tooltip: PlainTooltip | null = null

    constructor(el: HTMLElement, option: object | string) {
        this.updateOption(el, option)
    }

    async updateOption(el: HTMLElement, option: object | string) {
        await $plain.nextTick()
        if (!!this.tooltip) {
            this.tooltip.destroy()
            this.tooltip = null
        }
        if (!!option) {
            if (typeof option === "string") {
                option = {content: option}
            }
            option = Object.assign({reference: el} as Partial<PlainTooltipConfig>, Tooltip.DEFAULT_OPTION, option)
            // @ts-ignore
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
                    let service = new Tooltip(el, binding.value)
                    map.set(el, service)
                    service.updateOption(el, binding.value)
                }
            },
            componentUpdated(el, binding, vnode) {
                if (!!binding.value) {
                    let service = map.get(el) as Tooltip | null
                    if (!service) {
                        service = new Tooltip(el, binding.value)
                        map.set(el, service)
                    }
                    service.updateOption(el, binding.value)
                } else {
                    let service = map.get(el) as Tooltip | null
                    if (!!service) {
                        service.unbind()
                        service = null
                        map.set(el, service)
                    }
                }
            },
            unbind(el) {
                const service = map.get(el) as Tooltip
                if (!!service) {
                    service.unbind()
                }
            },
        })
    }
}
