import time from './time'
import TimeBaseColumn from './panel/time-base-column'
import TimeBasePanel from './panel/time-base-panel'
import TimeRangePanel from './panel/time-range-panel'
import TimePanel from './panel/time-panel'
import {createComponentPlugin} from "../../utils/createComponentPlugin";
import {TimeServiceGetter} from "./servce/time-service";
import DateTimeInput from '../date-time-input'

export default createComponentPlugin(time, {
    exposeComponents: {
        TimeBaseColumn,
        TimeBasePanel,
        TimeRangePanel,
        TimePanel,
    },
    plugins: [
        DateTimeInput,
    ],
    expose: {
        TimeServiceGetter
    },
})