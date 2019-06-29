import Vue from 'vue'
import App from './App.vue'
import './index.scss'
import {InstallComponent} from "./components/component";
import PlainService from './scripts/service'
import {CustomColumns} from "./components/component";

import Plain from "src"

Vue.config.productionTip = false

Vue.use(Plain, {
    // theme: 'red',
    async pageRegistry(path) {
        const separateIndex = path.indexOf('?')
        if (separateIndex > -1) path = path.slice(0, separateIndex)
        // await Plain.$utils.delay(1000)
        const component = (await import('portal/pages' + path.replace('.vue', '') + '.vue')).default
        return component
    },
    prefix: 'im',
    iconfont: 'https://at.alicdn.com/t/font_954560_kicgud0zqeb.js',                               //自定义iconfont图表地址
    customColumns: CustomColumns,
})

InstallComponent(Vue)
PlainService(Vue)

new Vue({
    render: h => h(App),
}).$mount('#app')
