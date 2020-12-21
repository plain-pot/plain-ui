import {App} from 'vue'
import PlcInput from './plc-input'
import PlcNumber from './plc-number'
import PlcDate from './plc-date'
import PlcColorPicker from './plc-color-picker'
import PlcToggle from './plc-toggle'
import PlcRate from './plc-rate'

const components = [
    PlcInput,
    PlcNumber,
    PlcDate,
    PlcColorPicker,
    PlcToggle,
    PlcRate,
]

export const PlcEdit = {
    install: (app: App) => {
        components.forEach(c => app.component(c.name, c))
    }
}

export {
    PlcInput,
    PlcNumber,
    PlcDate,
    PlcColorPicker,
    PlcToggle,
    PlcRate,
}
