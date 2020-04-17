import date from './pl-date'

import basePanel from './subs/pl-date-base-panel.vue'
import basePanelHeader from './subs/pl-date-base-panel-header.vue'
import basePanelDate from './subs/pl-date-base-panel-date'
import basePanelYear from './subs/pl-date-base-panel-year'
import basePanelMonth from './subs/pl-date-base-panel-month'
import basePanelItem from './subs/pl-date-base-panel-item'
import dateRange from './subs/pl-date-panel-date-range'
import panelWeek from './subs/pl-date-panel-week'
import panelDates from './subs/pl-date-panel-dates'

import {plugin} from "../../utils";


export default plugin([
    date,
    basePanel,
    basePanelHeader,
    basePanelDate,
    basePanelYear,
    basePanelMonth,
    basePanelItem,

    dateRange,
    panelWeek,
    panelDates,
])