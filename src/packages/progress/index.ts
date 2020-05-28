import './progress.scss'
import {installPlugin} from "@/util/install";
import bar from './progress-bar'
import circle from './progress-circle'
import mini from './progress-mini'

export default installPlugin([
    bar,
    circle,
    mini,
])