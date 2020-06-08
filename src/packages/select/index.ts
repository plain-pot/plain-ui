import './select.scss'
import select from './select'
import option from './select-option'
import panel from './select-panel'
import group from './select-group'
import service from './select-service'

import {installPlugin} from "@/util/install";

export default installPlugin([
    select,
    option,
    panel,
    group,
], [
    service,
])