import {ProgressBar as bar} from './progress-bar'
import {ProgressCircle as circle} from './progress-circle'
import {ProgressMini as mini} from './progress-mini'
import {App} from 'vue';
import {createComponentPlugin} from "../../utils/createComponentPlugin";
import {installPlugin} from "../../utils/installPlugin";
import './progress.scss'

const ProgressBar = createComponentPlugin(bar)
const ProgressCircle = createComponentPlugin(circle)
const ProgressMini = createComponentPlugin(mini)

export default {
    ProgressBar,
    ProgressCircle,
    ProgressMini,
    install(app: App) {
        installPlugin(app, ProgressBar)
        installPlugin(app, ProgressCircle)
        installPlugin(app, ProgressMini)
    },
}