const map = new WeakMap()

class ClickWaveData {

    constructor(el, opts) {
        this.opts = {}
        this.on = () => {
            // console.log(this.opts,this.opts.disabled === true)
            if (this.opts.disabled === true) return;
            if (!!this.wavingTimer) return

            this.el.setAttribute('plain-click-node-waving', null)
            this.wavingTimer = setTimeout(() => {
                this.el.removeAttribute('plain-click-node-waving', null)
                this.wavingTimer = null
            }, 500)
        }
        this.setOpts = (opts) => {
            opts = opts || {}
            if (typeof opts === "string") {
                opts = {
                    size: opts
                }
            }
            opts.size = opts.size || 'normal'
            this.opts = opts
        }
        this.setOpts(opts)
        this.el = el
        this.el.setAttribute(`plain-click-node-${this.opts.size}`, null)

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
    componentUpdated(el, binding) {
        const data = map.get(el)
        if (!!data) {
            data.setOpts(binding.value)
        }
    },
    unbind(el) {
        const data = map.get(el)
        if (!!data) {
            data.unbind()
        }
    },
}

export default ClickWave