import {createComponentPlugin} from "../../utils/createComponentPlugin";
import table from './table'
import {VirtualTable} from "./virtual-table";

import Plc from './plc/core/plc'
import PlcGroup from './plc/core/plc-group'

export default createComponentPlugin(table, {
    exposeComponents: {
        VirtualTable,
        Plc,
        PlcGroup,
    },
    plugins: []
})