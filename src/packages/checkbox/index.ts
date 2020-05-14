import './checkbox.scss'
import {installPlugin} from "@/util/install";
import checkbox from './checkbox'
import group from './checkbox-group'
import inner from './pl-checkbox-inner.vue'
import indeterminate from './pl-checkbox-indeterminate.vue'

export default installPlugin([
    checkbox,
    group,
    inner,
    indeterminate,
])