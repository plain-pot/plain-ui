import './select.scss'
import select from './select'
import option from './select-option'
import {installPlugin} from "@/util/install";

export default installPlugin([
    select,
    option,
])