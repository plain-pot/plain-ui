import time from './time'
import column from './panel/time-base-column'
import base from './panel/time-base-panel'
import range from './panel/time-range-panel'
import panel from './panel/time-panel'
import {createComponentPlugin} from "../../utils/createComponentPlugin";
import {TimeServiceGetter} from "./servce/time-service";
import DateTimeInput from '../date-time-input'

const TimeBaseColumn = createComponentPlugin(column)
const TimeBasePanel = createComponentPlugin(base)
const TimeRangePanel = createComponentPlugin(range)
const TimePanel = createComponentPlugin(panel)

export default {
    TimeBaseColumn,
    TimeBasePanel,
    TimeRangePanel,
    TimePanel,
    TimeServiceGetter,
    ...createComponentPlugin(time, [
        TimeBaseColumn,
        TimeBasePanel,
        TimeRangePanel,
        TimePanel,
        DateTimeInput,
    ])
}