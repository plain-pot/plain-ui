import App from "./App";

window.Vue.use(window.PlainDoc.PlainUI)
window.App = new Vue({
    el: '#app',
    render: h => h(App)
})