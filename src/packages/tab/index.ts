import './tab.scss'
import tab from './tab'
import innerTab from './inner-tab'
import group from './tab-group'

import {installPlugin} from "@/util/install";

export default installPlugin([
    tab,
    innerTab,
    group,
])