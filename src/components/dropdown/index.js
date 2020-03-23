import dropdown from './pl-dropdown.vue'
import menu from './pl-dropdown-menu'
import item from './pl-dropdown-item'
import group from './pl-dropdown-group'

import icon from '../icon'
import popper from '../popper'
import scroll from '../scroll'


import {plugin} from "../../utils";

export default plugin([dropdown, menu, item, group], [icon, popper, scroll])