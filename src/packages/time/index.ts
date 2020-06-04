import './time.scss'
import time from './time'
import panel from './time-panel'
import {installPlugin} from "@/util/install";
import subs from './subs'

export default installPlugin([
    time,
    panel,
], [
    subs,
])