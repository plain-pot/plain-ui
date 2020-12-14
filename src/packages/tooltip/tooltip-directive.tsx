import {Directive, nextTick} from 'vue';
import {PlainTooltip} from 'plain-popper';
import {PlainTooltipConfig} from 'plain-popper/src/PlainTooltipUtils';
import {deepEqual} from "plain-utils/object/deepEqual";

type TooltipBinding = string | PlainTooltipConfig

class Tooltip {

    static DEFAULT_OPTION = {
        placement: 'top',
        theme: 'dark',
        animate: 'fade',
        trigger: 'hover',
    }

    tooltip: PlainTooltip | null = null
    oldOption: any = null

    constructor(el: HTMLElement, option: PlainTooltipConfig | string) {
        this.updateOption(el, option)
    }

    async updateOption(el: HTMLElement, option: PlainTooltipConfig | string) {
        if (deepEqual(this.oldOption, option)) {
            return
        }
        this.oldOption = option
        await nextTick()
        if (!!this.tooltip) {
            this.tooltip.destroy()
            this.tooltip = null
        }
        if (!!option) {
            let config: PlainTooltipConfig = (typeof option === "string" ? {content: option} : option) as any
            config = Object.assign({reference: el} as Partial<PlainTooltipConfig>, Tooltip.DEFAULT_OPTION, config)
            this.tooltip = new PlainTooltip(config)
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