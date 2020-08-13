import table from './table'

import head from './head/head'
import headCell from './head/head-cell'
import headItem from './head/head-item'

import body from './body/body'
import bodyItem from './body/body-item'
import bodyCell from './body/body-cell'
import row from './body/row'

import {installPlugin} from "@/util/install";

export default installPlugin([
    table,

    head,
    headItem,
    headCell,

    body,
    bodyItem,
    bodyCell,
    row,
])