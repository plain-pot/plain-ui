import button from './button'
import icon from './icon'
import scroll from './scroll'
import loading from './loading'
import input from './input'
import checkbox from './checkbox'
import radio from './radio'
import popper from './popper'
import dom from './dom'
import popover from './popover'
import select from './select'
import list from './list'
import message from './message'
import form from './form'

const plugins = [
    button, icon,
    input, checkbox, radio, select, form,
    loading, popper, popover,
    list, scroll, dom,
    message,
]

export default {
    plugins,
    install: Vue => {
        plugins.forEach(p => Vue.use(p))
    }
}