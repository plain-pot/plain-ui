import {createComponentPlugin} from "../../utils/createComponentPlugin";
import table from './table'
import {VirtualTable} from "./virtual-table";
import PlcPlugin from './plc-core'

export default createComponentPlugin(table, {
    exposeComponents: {
        VirtualTable,
    },
    plugins: [
        PlcPlugin,
    ]
})