import button from './button'
import icon from './icon'

const plugins = [
    button,
    icon,
]

export default {
    plugins,
    install: Vue => {
        plugins.forEach(p => Vue.use(p))
    }
}