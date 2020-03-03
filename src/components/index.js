import button from './button'
import icon from './icon'
import scroll from './scroll'

const plugins = [
    button, icon,
    scroll,
]

export default {
    plugins,
    install: Vue => {
        plugins.forEach(p => Vue.use(p))
    }
}