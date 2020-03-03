import App from "./App";
import Components from './page/components'

window.PlainUI = window.PlainDoc.PlainUI
window.Vue.use(window.PlainUI)
window.Vue.use(Components)

window.App = new Vue({
    el: '#app',
    render: h => h(App)
})