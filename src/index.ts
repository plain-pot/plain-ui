import button from './packages/button'
import input from './packages/input'
import {installPlugin, PluginType} from "@/util/install";

const plugins = [
    button, input,
]

const install: PluginType['install'] = Vue => {
    plugins.forEach(plugin => Vue.use(plugin))
}

export {
    button,
    input,
    install,
}

export default installPlugin({install})