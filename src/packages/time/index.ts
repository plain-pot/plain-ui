import time from './time'
import column from './panel/time-base-column'
import panel from './panel/time-panel'
import range from './panel/time-range-panel'
import {createComponentPlugin} from "../../utils/createComponentPlugin";

const TimeColumn = createComponentPlugin(column)
const TimePanel = createComponentPlugin(panel)
const TimeRangePanel = createComponentPlugin(range)

export default {
    TimeColumn,
    TimePanel,
    TimeRangePanel,
    ...createComponentPlugin(time, [
        TimeColumn,
        TimePanel,
        TimeRangePanel,
    ])
}