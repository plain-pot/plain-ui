import {installPlugin} from "@/util/install";
import column from './time-base-column'
import basePanel from './time-base-panel'
import rangePanel from './time-range-panel'

export default installPlugin([
    column,
    basePanel,
    rangePanel,
])