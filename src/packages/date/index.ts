import {createComponentPlugin} from "../../utils/createComponentPlugin";
import DateTimeInput from '../date-time-input'
import DateBasePanelYear from './panel/date-base-panel-year'
import Date from './date'
import DateBasePanelMonth from './panel/date-base-panel-month'
import DateBasePanelDate from './panel/date-base-panel-date'
import DatePanelDateRange from './panel/date-panel-date-range'
import DatePanelDates from './panel/date-panel-dates'
import DatePanelWeek from './panel/date-panel.week'
import DatePanel from './panel/date-panel'

export default createComponentPlugin(Date, {
    exposeComponents: {
        DateBasePanelYear,
        DateBasePanelMonth,
        DateBasePanelDate,
        DatePanelDateRange,
        DatePanelDates,
        DatePanelWeek,
        DatePanel,
    },
    plugins: [
        DateTimeInput
    ],
})