import table from './pl-table'
import {PlcComponent} from './plc'
import {TableComponent} from "./table";
import {plugin} from "../../utils";

export default plugin([
    table,

    ...PlcComponent,
    ...TableComponent,
])