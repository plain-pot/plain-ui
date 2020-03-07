import DemoRow from './demo-row'
import DemoLine from './demo-line'
import TestVuexComponent from "./TestVuexComponent";

const Components = {
    DemoRow,
    DemoLine,
    TestVuexComponent,
}

export default {
    install(Vue) {
        Object.values(Components).forEach(component => Vue.component(component.name, component))
    },
}