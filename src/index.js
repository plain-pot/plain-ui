import PlainDom from './scripts/PlainDom'
import './styles/index.scss'
import components from './components/index'
import Service from './scripts/service'

const Plain = {
    Vue: null,
    p_pageRegistry: null,
    p_theme: null,
    p_rootOption: null,

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
    install(Vue, {theme = 'default', prefix = 'pl', pageRegistry, iconfont, rootOption} = {},) {
        Vue.use(PlainDom)

        this.Vue = Vue
        this.p_rootOption = rootOption
        this.p_pageRegistry = pageRegistry

        Service(this)

        this.$utils.addScript('https://at.alicdn.com/t/font_948159_sskx2vv336s.js')                   //plain
        this.$utils.addScript('https://at.alicdn.com/t/font_1113642_w82jwgy9lk8.js')                 //ant-design
        !!iconfont && this.$utils.addScript(iconfont)

        this.changeTheme(theme)
        Object.keys(components).forEach(key => Vue.component(`${prefix}-${this.$utils.getKebabCase(key)}`, components[key]))

        Vue.prototype.$plain = this
    },
}

export default Plain