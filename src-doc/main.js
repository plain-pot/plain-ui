import Vue from 'vue';
import VueCompositionApi from '@vue/composition-api';
import App from './App';

import PLAIN from '../src'

Vue.config.productionTip = false;
Vue.use(VueCompositionApi);
Vue.use(PLAIN)

new Vue({
    render: h => h(App),
}).$mount('#app');
