import DemoRow from './demo-row'
import DemoLine from './demo-line'
import DemoChild from './demo-child'
import TestVuexComponent from "./TestVuexComponent";

const Components = {
    DemoRow,
    DemoLine,
    DemoChild,
    TestVuexComponent,
}

export default {
    install(Vue) {
        Object.values(Components).forEach(component => Vue.component(component.name, component))
    },
}