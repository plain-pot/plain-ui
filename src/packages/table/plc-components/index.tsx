import index from './plc-index'
import toggle from './plc-toggle'
import input from './plc-input'


import {installPlugin} from "@/util/install";

export default installPlugin([
    index,
    toggle,
    input,
]);