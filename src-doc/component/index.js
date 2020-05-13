import logo from './plain-logo'

export default {
    install(Vue) {
        Vue.component(logo.name, logo)
    },
}