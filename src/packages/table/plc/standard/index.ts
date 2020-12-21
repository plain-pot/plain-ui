import {App} from 'vue'
import PlcIndex from './plc-index'
import PlcExpand from './plc-expand'

const components = [
    PlcIndex,
    PlcExpand
]

export const PlcStandard = {
    install: (app: App) => {
        components.forEach(c => app.component(c.name, c))
    }
}

export {
    PlcIndex,
    PlcExpand
}
