import App from "./App";
import Components from './page/components'
import store from "./store/store";


window.PlainUI = window.PlainDoc.PlainUI
window.Vue.use(window.PlainUI)
window.Vue.use(Components)

window.App = new Vue({
    el: '#app',
    store,
    render: h => h(App)
})