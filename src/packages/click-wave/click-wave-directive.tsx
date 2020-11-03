import {Directive} from 'vue'
import './click-wave.scss'

const map = new WeakMap()

class ClickWaveData {

    option: any
    on: () => void
    wavingTimer: number | null = null
    el: HTMLElement
    updateOption: (option: any) => void

    constructor(el: HTMLElement, option: any) {
        this.option = {}
        this.on = () => {
            // console.log(this.option,this.option.disabled === true)
            if (this.option.disabled === true) return;
            if (!!this.wavingTimer) return

            this.el.setAttribute('plain-click-node-waving', 'active')
            this.wavingTimer = setTimeout(() => {
                this.el.removeAttribute('plain-click-node-waving')
                this.wavingTimer = null
            }, 500) as any as number
        }
        this.updateOption = (option) => {
            option = option || {}
            if (typeof option === "string") {
                option = {
                    size: option
                }
            }
            option.size = option.size || 'normal'
            this.option = option
        }
        this.updateOption(option)
        this.el = el
        this.el.setAttribute(`plain-click-node-${this.option.size}`, 'active')

        el.addEventListener('click', this.on, true)
    }

    unbind() {
        this.el.removeEventListener('click', this.on, true)
    }
}

export const ClickWave: Directive = {
    mounted(el, binding) {
        map.set(el, new ClickWaveData(el, binding.value))
    },
    updated(el, binding) {
        const data = map.get(el)
        if (!!data) {
            data.updateOption(binding.value)
        }
    },
    beforeUnmount(el) {
        const data = map.get(el)
        if (!!data) {
            data.unbind()
        }
    },
}