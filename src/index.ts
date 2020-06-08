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
import step from './packages/step'
import triangle from './packages/triangle'
import tab from './packages/tab'
import tabHeader from './packages/tab-header'
import filletCorner from './packages/fillet-corner'
import tree from './packages/tree'
import virtualTree from './packages/virtual-tree'
import cascade from './packages/cascade'
import time from './packages/time'
import dateTimeInput from './packages/date-time-input'
import date from './packages/date'
import select from './packages/select'
import form from './packages/form'

import {installPlugin, PluginType} from "@/util/install";

const plugins = [
    icon,
    button, input, loading, radio, checkbox, number, toggle, slider, tag, rate, colorPicker, cascade, time, dateTimeInput, date, select, form,
    collapse, list, grid, scroll, portal,
    message, notice, dialog, popper, popover, tooltip, dropdown, step,
    card, carousel, virtualList, progress, pagination, tab, tree, virtualTree,
    alert, badge, triangle,
    tabHeader, filletCorner,
]

const install: PluginType['install'] = Vue => {
    plugins.forEach(plugin => Vue.use(plugin))
}

export {
    icon,
    button, input, loading, radio, checkbox, number, toggle, slider, tag, rate, colorPicker,
    collapse, list, grid, scroll, portal,
    message, notice, dialog, popper, popover, tooltip, dropdown, step,
    card, alert, carousel, virtualList, progress, pagination, badge, triangle, tab,

    install,
}

export default installPlugin({install})