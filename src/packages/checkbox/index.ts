import inner from '../checkbox-inner'
import {createComponentPlugin} from "../../utils/createComponentPlugin";
import checkbox from './checkbox'
import './checkbox.scss'

export default createComponentPlugin(checkbox, {
    plugins: [inner]
})