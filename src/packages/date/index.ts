import DateTimeInput from '../date-time-input'
import date from './date'
import {createComponentPlugin} from "../../utils/createComponentPlugin";

export default {
    ...createComponentPlugin(date, [
        DateTimeInput
    ]),
}