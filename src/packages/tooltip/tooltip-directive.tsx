import {Directive, nextTick} from 'vue';
import {PlainTooltip} from 'plain-popper';
import {PlainTooltipConfig} from 'plain-popper/src/PlainTooltipUtils';

type TooltipBinding = string | PlainTooltipConfig

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
        await nextTick()
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

export const TooltipDirective = (() => {
    const map = new WeakMap()
    const directive: Directive = {
        mounted(el: HTMLElement, binding: { value: TooltipBinding }) {
            if (!!binding.value) {
                let service = new Tooltip(el, binding.value)
                map.set(el, service)
                service.updateOption(el, binding.value)
            }
        },
        updated(el: HTMLElement, binding: { value: TooltipBinding }) {
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
        unmounted(el: HTMLElement) {
            const service = map.get(el) as Tooltip
            if (!!service) {
                service.unbind()
            }
        },
    }
    return directive
})()