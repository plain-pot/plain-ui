import {createComponentPlugin} from "../../utils/createComponentPlugin";
import DateTimeInput from '../date-time-input'
import year from './panel/date-base-panel-year'
import date from './date'
import month from './panel/date-base-panel-month'
import baseDate from './panel/date-base-panel-date'

const DateBasePanelYear = createComponentPlugin(year)
const DateBasePanelMonth = createComponentPlugin(month)
const DateBasePanelDate = createComponentPlugin(baseDate)

export default {
    DateBasePanelYear,
    DateBasePanelMonth,
    DateBasePanelDate,
    ...createComponentPlugin(date, [
        DateTimeInput,
        DateBasePanelYear,
        DateBasePanelMonth,
        DateBasePanelDate,
    ]),
}