import './radio.scss'
import inner from './pl-radio-inner.vue'
import radio from './radio'
import group from './radio-group'
import {installPlugin} from "@/util/install";

export default installPlugin([
    radio,
    group,
    inner,
])