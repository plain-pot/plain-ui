const map = new WeakMap()

class ClickWaveData {

    constructor(el, size) {
        size = size || 'default'
        this.el = el
        this.el.setAttribute(`plain-click-node-${size}`, null)

        this.on = () => {
            if (!!this.wavingTimer) return

            this.el.setAttribute('plain-click-node-waving', null)
            this.wavingTimer = setTimeout(() => {
                this.el.removeAttribute('plain-click-node-waving', null)
                this.wavingTimer = null
            }, 500)
        }

        el.addEventListener('click', this.on, true)
    }

    unbind() {
        this.el.removeEventListener('click', this.on, true)
    }
}

const ClickWave = {
    bind(el, binding) {
        map.set(el, new ClickWaveData(el, binding.value))
    },
    unbind(el) {
        const data = map.get(el)
        if (!!data) {
            data.unbind()
        }
    },
}

export default ClickWave