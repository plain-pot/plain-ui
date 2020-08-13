import table from './table'
import plc from './plc'
import component from './component'

import {installPlugin} from "@/util/install";

export default installPlugin([
    table,
], [
    plc,
    component,
])