import './date.scss'
import date from './date'
import {installPlugin} from "@/util/install";
import subs from './subs'

export default installPlugin([
    date,
], [
    subs,
])