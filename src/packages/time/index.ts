import './time.scss'
import time from './time'
import {installPlugin} from "@/util/install";
import subs from './subs'

export default installPlugin([
    time,
], [
    subs,
])