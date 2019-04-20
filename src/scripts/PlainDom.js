class PlainDom {
    el = null;
    parentNode = null;
    value = false;
    container = null;
    replace = null;

    constructor(el) {
        this.el = el
        this.parentNode = el.parentNode
        this.replace = document.createComment('replace')
    }

    getContainerByValue(value) {
        if (value === false) return this.parentNode
        if (value === true) return document.body
        return value instanceof window.Node ? value : document.querySelector(value)
    }

    update(value) {
        if (this.value === value) return
        if (!!value) {
            /*
             *  parentNode.replaceChild(newNode, oldNode)newNode所在的父元素会自动删除newNode，所以下面只能采取这种写法
             *  @author     martsforever
             *  @datetime   2019/4/20 23:12
             */
            this.container = this.getContainerByValue(value)
            this.parentNode.replaceChild(this.replace, this.el)
            this.container.appendChild(this.el)
        } else {
            this.parentNode.replaceChild(this.el, this.replace)
        }
        this.value = value
    }

    hasNode(parent, node) {
        for (let i = 0; i < parent.childNodes.length; i++) {
            const childNode = parent.childNodes[i];
            if (childNode.isEqualNode(node)) return true
        }
        return false
    }
}

const map = new Map()
const directive = {
    inserted(el, {value}) {
        if (map.has(el)) return
        const data = new PlainDom(el, value)
        map.set(el, data)
        data.update(value)
    },
    componentUpdated(el, {value}) {
        const data = map.get(el)
        data.update(value)
    },
    unbind(el) {
        const data = map.get(el)
        data.update(false)
        map.delete(el)
    },
}

export default {
    install(Vue, {name = 'plain-dom'} = {}) {
        Vue.directive(name, directive)
    },
}