import Collapse from '../collapse'
import Icon from '../icon'
import Alert from './alert'
import {createComponentPlugin} from "../../utils/createComponentPlugin";

export default createComponentPlugin(Alert, {
    plugins: [
        Collapse,
        Icon,
    ]
})