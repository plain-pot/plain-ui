import button from './packages/button'
import input from './packages/input'
import icon from './packages/icon'

import {installPlugin, PluginType} from "@/util/install";

const plugins = [
    icon,
    button, input,
]

const install: PluginType['install'] = Vue => {
    plugins.forEach(plugin => Vue.use(plugin))
}

export {
    icon,
    button, input,

    install,
}

export default installPlugin({install})