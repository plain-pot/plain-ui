import {App} from 'vue'
import PlcIndex from './plc-index'
import PlcExpand from './plc-expand'
import PlcCheck from './plc-check'

const components = [
    PlcIndex,
    PlcExpand,
    PlcCheck,
]

export const PlcStandard = {
    install: (app: App) => {
        components.forEach(c => app.component(c.name, c))
    }
}

export {
    PlcIndex,
    PlcExpand,
    PlcCheck,
}
