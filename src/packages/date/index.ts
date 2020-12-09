import {createComponentPlugin} from "../../utils/createComponentPlugin";
import DateTimeInput from '../date-time-input'
import year from './panel/date-base-panel-year'
import date from './date'
import month from './panel/date-base-panel-month'
import baseDate from './panel/date-base-panel-date'
import range from './panel/date-panel-date-range'

const DateBasePanelYear = createComponentPlugin(year)
const DateBasePanelMonth = createComponentPlugin(month)
const DateBasePanelDate = createComponentPlugin(baseDate)
const DatePanelDateRange = createComponentPlugin(range)

export default {
    DateBasePanelYear,
    DateBasePanelMonth,
    DateBasePanelDate,
    DatePanelDateRange,
    ...createComponentPlugin(date, [
        DateTimeInput,
        DateBasePanelYear,
        DateBasePanelMonth,
        DateBasePanelDate,
        DatePanelDateRange,
    ]),
}