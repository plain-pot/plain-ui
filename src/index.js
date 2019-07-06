import {getComponents} from './components/index'
import {getDirectives} from "./scripts/directives";
import Service from './scripts/service'

import {InstallComponent} from "../portal/components/component";
import PlainService from '../portal/scripts/service'
import {CustomColumns} from "../portal/components/component";

/*这里import这个index.scss，实际上应用中还是需要import打包生成的css文件，如果应用中通过global实现自定义主题，则不需要使用再次import css文件*/
import './styles/index.scss'


const Plain = {
    Vue: null,
    p_pageRegistry: null,
    p_theme: null,
    p_rootOption: null,
    p_zIndex: null,

    TYPE: {
        white: {icon: 'pad-info-circle-fill', color: 'white'},
        black: {icon: 'pad-info-circle-fill', color: 'black'},
        info: {icon: 'pad-info-circle-fill', color: 'primary'},
        warn: {icon: 'pad-warning-circle-fill', color: 'warn'},
        success: {icon: 'pad-check-circle-fill', color: 'success'},
        error: {icon: 'pad-close-circle-fill', color: 'error'},
        help: {icon: 'pad-question-circle-fill', color: 'info'},
    },

    /*注册页面*/
    async pageRegistry(path) {
        // console.log(path)
        return !this.p_pageRegistry ? Promise.reject('plain ui need pageRegistry function when installed.') : await this.p_pageRegistry(path)
    },
    /*log调试*/
    log(...args) {
        console.log(...args)
    },
    /*主题切换*/
    changeTheme(theme) {
        if (!!this.p_theme) this.$dom.removeClass(document.body, `pl-theme-${this.p_theme}`)
        this.$dom.addClass(document.body, `pl-theme-${theme}`)
        this.p_theme = theme
    },
    /*等待页面响应数据*/
    nextTick() {
        return new Promise((rs) => this.Vue.prototype.$nextTick(rs))
    },
    /*创建vue组件实例*/
    newInstance(component, el) {
        if (!el) {
            el = document.createElement('div')
            document.body.appendChild(el)
        }
        return (new this.Vue({render: h => h(component), el, ...this.p_rootOption}).$mount()).$children[0]
    },
    getZIndex() {
        return this.p_zIndex = this.p_zIndex + 1
    },
    install(Vue, {theme = 'default', prefix = 'pl', pageRegistry, iconfont, rootOption, zIndex = 3000, customColumns} = {}) {
        this.Vue = Vue
        this.p_rootOption = rootOption
        this.p_pageRegistry = pageRegistry
        this.p_zIndex = zIndex

        Service(this)

        this.$utils.addScript('https://at.alicdn.com/t/font_948159_9jgozvpudu.js')                   //plain
        this.$utils.addScript('https://at.alicdn.com/t/font_1113642_w82jwgy9lk8.js')                 //ant-design
        !!iconfont && this.$utils.addScript(iconfont)

        this.changeTheme(theme)
        const components = getComponents(prefix, customColumns || {})
        Object.keys(components).forEach(key => Vue.component(key, components[key]))
        const directives = getDirectives(prefix)
        Object.keys(directives).forEach(key => Vue.directive(key, directives[key]))

        Vue.prototype.$plain = this
    },
}

export default Plain

export {
    InstallComponent,
    PlainService,
    CustomColumns,
}
