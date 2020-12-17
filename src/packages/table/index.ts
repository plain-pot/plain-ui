import {createComponentPlugin} from "../../utils/createComponentPlugin";
import table from './table'
import {VirtualTable} from "./virtual-table";

export default createComponentPlugin(table, {
    exposeComponents: {
        VirtualTable,
    },
    plugins: [
    ]
})