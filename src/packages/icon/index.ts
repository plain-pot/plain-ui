import './icon.scss'

import {installPlugin} from "@/util/install";
import icon from './icon'

// @ts-ignore
icon.registry('pli','pli-icon')

export default installPlugin(icon)