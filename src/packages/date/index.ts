import {createComponentPlugin} from "../../utils/createComponentPlugin";
import DateTimeInput from '../date-time-input'
import year from './panel/date-base-panel-year'
import date from './date'
import month from './panel/date-base-panel-month'
import baseDate from './panel/date-base-panel-date'
import range from './panel/date-panel-date-range'
import dates from './panel/date-panel-dates'

const DateBasePanelYear = createComponentPlugin(year)
const DateBasePanelMonth = createComponentPlugin(month)
const DateBasePanelDate = createComponentPlugin(baseDate)
const DatePanelDateRange = createComponentPlugin(range)
const DatePanelDates = createComponentPlugin(dates)

export default {
    DateBasePanelYear,
    DateBasePanelMonth,
    DateBasePanelDate,
    DatePanelDateRange,
    DatePanelDates,
    ...createComponentPlugin(date, [
        DateTimeInput,
        DateBasePanelYear,
        DateBasePanelMonth,
        DateBasePanelDate,
        DatePanelDateRange,
        DatePanelDates,
    ]),
}