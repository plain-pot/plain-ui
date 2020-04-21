import group from './pl-tab-group'
import horizontalGroup from './pl-tab-horizontal-group'
import verticalGroup from './pl-tab-vertical-group'
import innerTab from './pl-tab-group-inner-tab'
import tab from './pl-tab'

import {plugin} from "../../utils";

export default plugin([
    group,
    tab,
    horizontalGroup,
    verticalGroup,
    innerTab,
])