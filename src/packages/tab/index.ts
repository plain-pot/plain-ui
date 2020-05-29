import './tab.scss'
import tab from './tab'
import innerTab from './inner-tab'
import group from './tab-group'
import groupHorizontal from './tab-group-horizontal'
import groupVertical from './tab-group-vertical'

import {installPlugin} from "@/util/install";

export default installPlugin([
    tab,
    innerTab,
    group,
    groupVertical,
    groupHorizontal,
])