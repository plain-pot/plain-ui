import {installPlugin} from "@/util/install";
import table from './table'
import head from './head/head'
import headCell from './head/head-cell'

export default installPlugin([
    table,
    head,
    headCell,
])