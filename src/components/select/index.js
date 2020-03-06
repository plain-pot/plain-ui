import component from './pl-select.vue'
import utils from '../utils'
import popover from '../popover'
import icon from '../icon'
import keyboard from '../keyboard-events'
import SelectService from './SelectService'
import {plugin} from "../../utils";

export default plugin(component, [icon, utils, popover, keyboard, SelectService])