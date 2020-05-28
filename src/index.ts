import 'src/style/index.scss'

import button from './packages/button'
import input from './packages/input'
import icon from './packages/icon'
import collapse from './packages/collapse'
import loading from './packages/loading'
import list from './packages/list'
import message from './packages/message'
import notice from './packages/notice'
import grid from './packages/grid'
import radio from './packages/radio'
import checkbox from './packages/checkbox'
import number from './packages/number'
import toggle from './packages/toggle'
import slider from './packages/slider'
import tag from './packages/tag'
import rate from './packages/rate'
import scroll from './packages/scroll'
import portal from './packages/portal'
import dialog from './packages/dialog'
import popper from './packages/popper'
import popover from './packages/popover'
import colorPicker from './packages/color-picker'
import tooltip from './packages/tooltip'
import dropdown from './packages/dropdown'
import card from './packages/card'
import alert from './packages/alert'
import carousel from './packages/carousel'
import virtualList from './packages/virtual-list'
import progress from './packages/progress'
import pagination from "@/packages/pagination";
import badge from './packages/badge'

import {installPlugin, PluginType} from "@/util/install";

const plugins = [
    icon,
    button, input, loading, radio, checkbox, number, toggle, slider, tag, rate, colorPicker,
    collapse, list, grid, scroll, portal,
    message, notice, dialog, popper, popover, tooltip, dropdown,
    card, alert, carousel, virtualList, progress, pagination, badge,
]

const install: PluginType['install'] = Vue => {
    plugins.forEach(plugin => Vue.use(plugin))
}

export {
    icon,
    button, input, loading, radio, checkbox, number, toggle, slider, tag, rate, colorPicker,
    collapse, list, grid, scroll, portal,
    message, notice, dialog, popper, popover,

    install,
}

export default installPlugin({install})