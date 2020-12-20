import PlcIndex from './plc-index'
import {App} from 'vue'

export const PlcStandard = {
    install: (app: App) => {
        app.component(PlcIndex.name, PlcIndex)
    }
}

export {
    PlcIndex
}
