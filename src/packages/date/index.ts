import DateTimeInput from '../date-time-input'
import year from './panel/date-base-panel-year'
import date from './date'
import {createComponentPlugin} from "../../utils/createComponentPlugin";

const DateBasePanelYear = createComponentPlugin(year)

export default {
    DateBasePanelYear,
    ...createComponentPlugin(date, [
        DateTimeInput,
        DateBasePanelYear,
    ]),
}