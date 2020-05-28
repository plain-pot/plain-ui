import './step.scss'
import step from './step'
import group from './setp-group'
import arrowStep from './arrow-step'
import {installPlugin} from "@/util/install";

export default installPlugin([
    step,
    group,
], [
    arrowStep
])