import component from './pl-scroll.vue'
import utils from '../utils'

component.install = Vue => {
    Vue.use(utils)
    Vue.component(component.name, component)
}
export default component