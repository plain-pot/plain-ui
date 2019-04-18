import './styles/index.scss'

import $utils from 'src/scripts/utils'
import $dom from 'src/scripts/dom'
import $storage from 'src/scripts/storage'
import components from './components/index'

const Plain = {
    p_pageRegistry: null,
    async pageRegistry(path) {
        // console.log(path)
        return !this.p_pageRegistry ? Promise.reject('plain ui need pageRegistry function when installed.') : await this.p_pageRegistry(path)
    },
    log(...args) {
        console.log(...args)
    },
    p_theme: null,
    changeTheme(theme) {
        if (!!this.p_theme) this.$dom.removeClass(document.body, `pl-theme-${this.p_theme}`)
        this.$dom.addClass(document.body, `pl-theme-${theme}`)
        this.p_theme = theme
    },

    Vue: null,
    $utils,
    $dom,
    $storage,
    install(Vue, {theme = 'default', prefix = 'pl', pageRegistry, iconfont} = {}) {
        this.Vue = Vue
        this.p_pageRegistry = pageRegistry
        $utils.addScript('https://at.alicdn.com/t/font_948159_asue6ap7kg.js')                   //plain
        $utils.addScript('https://at.alicdn.com/t/font_1113642_w82jwgy9lk8.js')                 //ant-design
        !!iconfont && $utils.addScript(iconfont)

        this.changeTheme(theme)
        Object.keys(components).forEach(key => Vue.component(`${prefix}-${$utils.getKebabCase(key)}`, components[key]))

        Vue.prototype.$plain = Plain
    },
}

export default Plain