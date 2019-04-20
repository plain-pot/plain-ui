class PlainDomPortal {
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
        const newContainer = this.getContainerByValue(value)
        if (newContainer === this.container) return
        this.el.parentNode.removeChild(this.el)
        this.container = newContainer
        this.container.appendChild(this.el)
    }
}

export default {
    map: {},
    inserted(el, {value}) {
        if (this.map.has(el)) return
        const data = new PlainDomPortal(el, value)
        this.map.set(el, data)
        data.update()
    },
    componentUpdated(el, {value}) {
        const data = this.map.get(el)
        data.value = value
        data.update()
    },
    unbind(el) {
        const data = this.map.get(el)
        data.value = false
        data.update()
        this.map.delete(el)
    },
}