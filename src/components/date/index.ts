import date from './pl-date.vue'

import basePanel from './subs/pl-date-base-panel.vue'
import basePanelDate from './subs/pl-date-base-panel-date'
import basePanelYear from './subs/pl-date-base-panel-year'

import {plugin} from "../../utils";


export default plugin([
    date,
    basePanel,
    basePanelDate,
    basePanelYear,
])