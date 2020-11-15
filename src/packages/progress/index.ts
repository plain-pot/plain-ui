import {ProgressBar as bar} from './progress-bar'
import {ProgressCircle as circle} from './progress-circle'
import {ProgressMini as mini} from './progress-mini'
import {App} from 'vue';
import {createComponentPlugin} from "../../utils/createComponentPlugin";
import {installPlugin} from "../../utils/installPlugin";
import './progress.scss'

export const PROGRESS_DEFAULT_PROPS = {
    modelValue: {type: Number, default: 100},                        // 进度百分比，双向绑定值
    outerColor: {type: String, default: '#f2f2f2'},
    innerColor: {type: String, default: '#12b4a5'},
    speed: {type: Number, default: 3},
    status: {type: String, default: 'normal'},
    successColor: {type: String, default: '#42E67F'},
    errorColor: {type: String, default: '#FF6235'},
}

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