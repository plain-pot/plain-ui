import Vue from 'vue'
import App from './App.vue'
import './index.scss'

import demoRow from './aide/demo-row'
import demoRowItem from './aide/demo-row-item'
import demoChild from './components/other/demo-child'

import Plain from "src"
import $utils from "../src/scripts/utils";

Vue.config.productionTip = false

Vue.use(Plain, {
    // theme: 'red',
    pageRegistry(path) {
        return new Promise((rs, rj) => import('portal/components' + path.replace('.vue', '') + '.vue').then(module => rs(module.default)).catch(rj))
    },
    prefix: 'im',
    iconfont: 'https://at.alicdn.com/t/font_954560_kicgud0zqeb.js',                               //自定义iconfont图表地址
})

const com = {
    demoRow,
    demoRowItem,
    demoChild,
}
Object.keys(com).forEach(key => Vue.component(`${'im'}-${$utils.kebabCase(key)}`, com[key]))


new Vue({
    render: h => h(App),
}).$mount('#app')
