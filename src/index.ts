import button from './packages/button'
import input from './packages/input'
import icon from './packages/icon'
import collapse from './packages/collapse'

import {installPlugin, PluginType} from "@/util/install";

const plugins = [
    icon,
    button, input,
    collapse,
]

const install: PluginType['install'] = Vue => {
    plugins.forEach(plugin => Vue.use(plugin))
}

export {
    icon,
    button, input,
    collapse,

    install,
}

export default installPlugin({install})