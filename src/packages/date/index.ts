import './date.scss'
import date from './date'
import panel from './date-panel'
import {installPlugin} from "@/util/install";
import subs from './subs'

export default installPlugin([
    date,
    panel,
], [
    subs,
])