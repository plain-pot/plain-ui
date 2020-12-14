import button from '../button'
import icon from '../icon'
import mask from '../loading-mask'

import dialog from './dialog'
import {createComponentPlugin} from "../../utils/createComponentPlugin";

export default createComponentPlugin(dialog, {
    plugins: [
        button,
        icon,
        mask,
    ]
})