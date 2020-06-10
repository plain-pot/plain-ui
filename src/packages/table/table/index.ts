import table from './table'
import head from './head'
import headCell from './head-cell'
import headItem from './head-item'

import {installPlugin} from "@/util/install";

export default installPlugin([
    table,

    head,
    headItem,
    headCell,
])