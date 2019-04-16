import $util from 'src/scripts/utils'
import $dom from 'src/scripts/dom'

const Plain = {
    Vue: null,
    $util,
    $dom,
    install(Vue, {theme = 'default'} = {}) {
        this.Vue = Vue
        $dom.addClass(document.body, `pl-theme-${theme}`)
    },
}

export default Plain