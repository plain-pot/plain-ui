import table from './pl-table'
import {PlcComponent} from './plc'
import {plugin} from "../../utils";

export default plugin([
    table,

    ...PlcComponent,
])