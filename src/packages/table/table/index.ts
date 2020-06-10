import table from './table'
import head from './head'
import headCell from './head-cell'

import {installPlugin} from "@/util/install";

export default installPlugin([
    table,
    head,
    headCell,
])