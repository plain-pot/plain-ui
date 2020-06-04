import './time.scss'
import time from './time'
import panel from './time-panel'
import {installPlugin} from "@/util/install";
import subs from './subs'
import service from './time-service'

export default installPlugin([
    time,
    panel,
], [
    subs,
    service,
])