import component from './pl-popover.vue'
import {plugin} from "../../utils";

import popper from '../popper'
import scroll from '../scroll'

export default plugin(component, [popper, scroll])