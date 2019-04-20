class PlainDom {
    el = null;
    parentNode = null;
    value = null;
    container = null;

    constructor(el, value) {
        this.el = el
        this.parentNode = el.parentNode
        this.value = value
    }

    getContainerByValue(value) {
        if (value === false) return this.parentNode
        if (value === true) return document.body
        return value instanceof window.Node ? value : document.querySelector(value)
    }

    update() {
        const newContainer = this.getContainerByValue(this.value)
        if (newContainer === this.container) return
        this.el.parentNode.removeChild(this.el)
        this.container = newContainer
        this.container.appendChild(this.el)
    }
}

const map = new Map()
const directive = {
    inserted(el, {value}) {
        if (map.has(el)) return
        const data = new PlainDom(el, value)
        map.set(el, data)
        data.update()
    },
    componentUpdated(el, {value}) {
        const data = map.get(el)
        data.value = value
        data.update()
    },
    unbind(el) {
        const data = map.get(el)
        data.value = false
        data.update()
        map.delete(el)
    },
}

export default {
    install(Vue, {name = 'plain-dom'} = {}) {
        Vue.directive(name, directive)
    },
}