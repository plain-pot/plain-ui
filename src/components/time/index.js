import time from './pl-time.vue'
import panel from './pl-time-panel'
import base from './subs/pl-time-base-panel.tsx'
import column from './subs/pl-time-base-column'
import range from './subs/pl-time-range-panel'

import {plugin} from "../../utils";

export default plugin([time, panel, base, column, range])