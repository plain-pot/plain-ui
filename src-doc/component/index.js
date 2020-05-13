import DemoRow from './demo-row'
import DemoLine from './demo-line'
import DemoChild from './demo-child'
import TestVuexComponent from "./TestVuexComponent";
import logo from './plain-logo'

const Components = {
    logo,

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