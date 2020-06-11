import table from './table'
import head from './head/head'
import headCell from './head/head-cell'
import headItem from './head/head-item'

import {installPlugin} from "@/util/install";

export default installPlugin([
    table,

    head,
    headItem,
    headCell,
])