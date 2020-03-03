import button from './button'
import icon from './icon'
import scroll from './scroll'
import loading from './loading'

const plugins = [
    button, icon,

    scroll,
    loading
]

export default {
    plugins,
    install: Vue => {
        plugins.forEach(p => Vue.use(p))
    }
}