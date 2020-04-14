import date from './pl-date.vue'

import basePanel from './subs/pl-date-base-panel.vue'
import basePanelHeader from './subs/pl-date-base-panel-header.vue'
import basePanelDate from './subs/pl-date-base-panel-date'
import basePanelYear from './subs/pl-date-base-panel-year'
import basePanelMonth from './subs/pl-date-base-panel-month'

import {plugin} from "../../utils";


export default plugin([
    date,
    basePanel,
    basePanelHeader,
    basePanelDate,
    basePanelYear,
    basePanelMonth,
])