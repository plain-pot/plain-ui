import {ProgressBar} from './progress-bar'
import {ProgressCircle} from './progress-circle'
import {ProgressMini} from './progress-mini'
import {createComponentPlugin} from "../../utils/createComponentPlugin";
import './progress.scss'

export default createComponentPlugin(ProgressBar, {
    exposeComponents: {
        ProgressBar,
        ProgressCircle,
        ProgressMini,
    },
})