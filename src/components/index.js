import button from './button'
import icon from './icon'
import scroll from './scroll'
import loading from './loading'
import input from './input'

const plugins = [
    button, icon,
    input,

    scroll,
    loading
]

export default {
    plugins,
    install: Vue => {
        plugins.forEach(p => Vue.use(p))
    }
}