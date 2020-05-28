import './collapse.scss'
import {installPlugin} from "@/util/install";
import transition from './pl-collapse-transition.vue'
import group from './collapse-group'
import collapse from './collapse'

export default installPlugin([
    collapse,
    group,
    transition,
])