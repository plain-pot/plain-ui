import component from './pl-input.vue'
import icon from '../icon'
import loading from '../loading'
import utils from '../utils'

import {plugin} from "../../utils";

export default plugin(component, [
    icon,
    loading,
    utils,
])