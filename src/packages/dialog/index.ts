import button from '../button'
import icon from '../icon'
import mask from '../loading-mask'

import dialog from './dialog'
import {createComponentPlugin} from "../../utils/createComponentPlugin";

export default createComponentPlugin(dialog, [
    button,
    icon,
    mask,
])