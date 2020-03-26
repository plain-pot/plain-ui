export function getDefaultProgressProps() {
    return {
        value: {type: Number, default: 100},
        outerColor: {type: String, default: '#f2f2f2'},
        innerColor: {type: String, default: '#12b4a5'},
        speed: {type: Number, default: 3},
        status: {type: String, default: 'normal'},
        successColor: {type: String, default: '#42E67F'},
        errorColor: {type: String, default: '#FF6235'},
    }
}

import {plugin} from "../../utils";
import bar from './pl-progress-bar'
import circle from './pl-progress-circle'
import mini from './pl-progress-mini'

export default plugin([
    bar,
    circle,
    mini,
])
