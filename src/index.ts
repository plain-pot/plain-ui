import button from './packages/button'
import input from './packages/input'
import icon from './packages/icon'
import collapse from './packages/collapse'
import loading from './packages/loading'

import {installPlugin, PluginType} from "@/util/install";

const plugins = [
    icon,
    button, input, loading,
    collapse,
]

const install: PluginType['install'] = Vue => {
    plugins.forEach(plugin => Vue.use(plugin))
}

export {
    icon,
    button, input, loading,
    collapse,

    install,
}

export default installPlugin({install})