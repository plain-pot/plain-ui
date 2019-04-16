import './styles/index.scss'

import $utils from 'src/scripts/utils'
import $dom from 'src/scripts/dom'
import $storage from 'src/scripts/storage'
import components from './components/index'

const Plain = {
    p_pageRegistry: null,
    async pageRegistry(path) {
        // console.log(path)
        if (!this.p_pageRegistry) {
            return Promise.reject('plain ui need pageRegistry function when installed.')
        } else {
            return await this.p_pageRegistry(path)
        }
    },

    Vue: null,
    $utils,
    $dom,
    $storage,
    install(Vue, {theme = 'default', prefix = 'pl', pageRegistry, iconfont} = {}) {
        this.Vue = Vue
        this.p_pageRegistry = pageRegistry

        Object.keys(components).forEach(key => Vue.component(`${prefix}-${$utils.getKebabCase(key)}`, components[key]))
        $dom.addClass(document.body, `pl-theme-${theme}`)

        $utils.addScript('https://at.alicdn.com/t/font_948159_asue6ap7kg.js')                   //plain
        $utils.addScript('https://at.alicdn.com/t/font_1113642_w82jwgy9lk8.js')                 //ant-design
        !!iconfont && $utils.addScript(iconfont)


        Vue.prototype.$plain = Plain
    },
}

export default Plain