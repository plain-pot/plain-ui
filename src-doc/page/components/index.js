import DemoRow from './demo-row'

const Components = {
    DemoRow,
}

export default {
    install(Vue) {
        Object.values(Components).forEach(component => Vue.component(component.name, component))
    },
}