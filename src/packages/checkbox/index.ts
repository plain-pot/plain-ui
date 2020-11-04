import {createComponentPlugin} from "../../utils/createComponentPlugin";
import inner from './checkbox-inner'
import checkbox from './checkbox'
import group from './checkbox-group'
import './checkbox.scss'

export default createComponentPlugin([
    inner,
    checkbox,
    group,
])