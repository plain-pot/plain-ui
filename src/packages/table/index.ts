import {createComponentPlugin} from "../../utils/createComponentPlugin";
import table from './table'
import {VirtualTable} from "./virtual-table";

import Plc from './plc/core/plc'

export {
    Plc,
}

export default createComponentPlugin(table, {
    exposeComponents: {
        VirtualTable,
        Plc,
    },
    plugins: []
})