import './icon.scss'

import {installPlugin} from "@/util/install";
import icon from './icon'

export default {
    ...installPlugin(icon),
    // @ts-ignore
    registry: icon.registry,
}