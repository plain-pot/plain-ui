import './styles/index.scss'

import $utils from 'src/scripts/utils'
import $dom from 'src/scripts/dom'
import components from './components/index'

const Plain = {
    Vue: null,
    $utils,
    $dom,
    install(Vue, {theme = 'default', prefix = 'im'} = {}) {
        this.Vue = Vue
        Object.keys(components).forEach(key => Vue.component(`${prefix}-${$utils.getKebabCase(key)}`, components[key]))


        $dom.addClass(document.body, `pl-theme-${theme}`)

        $utils.addScript('https://at.alicdn.com/t/font_948159_asue6ap7kg.js')                  //plain
        $utils.addScript('https://at.alicdn.com/t/font_1113642_w82jwgy9lk8.js')                 //ant-design
    },
}

export default Plain