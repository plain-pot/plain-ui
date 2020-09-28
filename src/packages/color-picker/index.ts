import './color-picker.scss'

import alpha from './sub/color-alpha-slider'
import hue from './sub/color-hue-slider'
import sv from './sub/color-sv-panel'
import panel from './color-panel'
import picker from './color-picker'

import {installPlugin} from "@/util/install";

export default installPlugin([
    panel,
    alpha,
    hue,
    sv,
    picker,
], [
])