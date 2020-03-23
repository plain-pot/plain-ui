import component from './pl-number.vue'
import {plugin} from "../../utils";

import input from '../input'
import icon from '../icon'

export default plugin(component, [input, icon])