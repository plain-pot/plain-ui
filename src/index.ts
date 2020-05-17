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

import {installPlugin, PluginType} from "@/util/install";

const plugins = [
    icon,
    button, input, loading, radio, checkbox, number, toggle, slider, tag, rate,
    collapse, list, grid, scroll,
    message, notice,
]

const install: PluginType['install'] = Vue => {
    plugins.forEach(plugin => Vue.use(plugin))
}

export {
    icon,
    button, input, loading, radio, checkbox, number, toggle, slider, tag, rate,
    collapse, list, grid, scroll,
    message, notice,

    install,
}

export default installPlugin({install})