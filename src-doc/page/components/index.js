import DemoRow from './demo-row'
import DemoLine from './demo-line'

const Components = {
    DemoRow,
    DemoLine,
}

export default {
    install(Vue) {
        Object.values(Components).forEach(component => Vue.component(component.name, component))
    },
}