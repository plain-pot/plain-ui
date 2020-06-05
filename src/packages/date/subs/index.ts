import panel from './date-base-panel'
import header from './date-base-panel-header'
import item from './date-base-panel-item'

import year from './date-base-panel-year'
import month from './date-base-panel-month'
import {installPlugin} from "@/util/install";

export default installPlugin([
    panel,
    header,
    item,

    year,
    month,
])