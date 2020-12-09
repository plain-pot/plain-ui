import {createComponentPlugin} from "../../utils/createComponentPlugin";
import DateTimeInput from '../date-time-input'
import year from './panel/date-base-panel-year'
import date from './date'
import month from './panel/date-base-panel-month'

const DateBasePanelYear = createComponentPlugin(year)
const DateBasePanelMonth = createComponentPlugin(month)

export default {
    DateBasePanelYear,
    DateBasePanelMonth,
    ...createComponentPlugin(date, [
        DateTimeInput,
        DateBasePanelYear,
        DateBasePanelMonth,
    ]),
}