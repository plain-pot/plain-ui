import {installPlugin} from "@/util/install";
import table from './table'
import head from './head/head'
import headCell from './head/head-cell'
import body from './body/body'
import bodyCell from './body/body-cell'
import row from './body/row'

export default installPlugin([
    table,
    head,
    headCell,
    body,
    bodyCell,
    row,
])