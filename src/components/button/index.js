import component from './pl-button.vue'

import icon from '../icon'
import loading from '../loading'

import {plugin} from "../../utils";

export default plugin(component, [icon, loading])