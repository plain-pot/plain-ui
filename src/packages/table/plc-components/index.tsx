import index from './standard/plc-index'
import toggle from './external/plc-toggle'
import input from './external/plc-input'
import number from './external/plc-number'
import date from './external/plc-date'
import color from './external/plc-color-picker'
import rate from './external/plc-rate'


import {installPlugin} from "@/util/install";

export default installPlugin([
    index,
    toggle,
    input,
    number,
    date,
    color,
    rate,
]);