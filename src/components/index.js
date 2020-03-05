import button from './button'
import icon from './icon'
import scroll from './scroll'
import loading from './loading'
import input from './input'
import checkbox from './checkbox'
import radio from './radio'
import popper from './popper'
import plainPopper from './plain-popper'

const plugins = [
    button, icon,
    input, checkbox, radio,

    scroll,
    loading,
    popper,
    plainPopper,
]

export default {
    plugins,
    install: Vue => {
        plugins.forEach(p => Vue.use(p))
    }
}