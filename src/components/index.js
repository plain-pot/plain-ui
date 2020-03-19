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
import virtualList from './virtual-list'
import tooltip from './tooltip'
import number from './number'

const plugins = [
    button, icon,
    input, checkbox, radio, select, form,
    loading, popper, popover, tooltip,
    list, scroll, dom, number,
    message,

    virtualList,
]

export default {
    plugins,
    install: Vue => {
        plugins.forEach(p => Vue.use(p))
    }
}