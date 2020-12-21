import {App} from 'vue'
import PlcIndex from './plc-index'
import PlcExpand from './plc-expand'
import PlcCheck from './plc-check'
import PlcDraggier from './draggier/plc-draggier'

const components = [
    PlcIndex,
    PlcExpand,
    PlcCheck,
    PlcDraggier,
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
    PlcDraggier,
}
