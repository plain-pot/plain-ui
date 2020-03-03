import App from "./App";

window.PlainUI = window.PlainDoc.PlainUI
window.Vue.use(window.PlainUI)

window.App = new Vue({
    el: '#app',
    render: h => h(App)
})