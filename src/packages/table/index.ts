import './table.scss'
import table from './table'
import plc from './plc'
import {installPlugin} from "@/util/install";

export default installPlugin([
    table,
], [
    plc,
])