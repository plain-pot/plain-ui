import Vue from 'vue';
import VueCompositionApi from '@vue/composition-api';
import App from './App';
import Components from './component'
import './lib/iconfont/iconfont.css'
import './lib/iconfont/iconfont.js'

import PLAIN from '../src'

Vue.config.productionTip = false;
Vue.use(VueCompositionApi);
Vue.use(PLAIN)
Vue.use(Components)

new Vue({
    render: h => h(App),
}).$mount('#app');
