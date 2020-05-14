import button from './packages/button'
import input from './packages/input'
import icon from './packages/icon'
import collapse from './packages/collapse'
import loading from './packages/loading'
import list from './packages/list'
import message from './packages/message'
import notice from './packages/notice'

import {installPlugin, PluginType} from "@/util/install";

const plugins = [
    icon,
    button, input, loading,
    collapse, list,
    message, notice,
]

const install: PluginType['install'] = Vue => {
    plugins.forEach(plugin => Vue.use(plugin))
}

export {
    icon,
    button, input, loading,
    collapse, list,
    message, notice,

    install,
}

export default installPlugin({install})