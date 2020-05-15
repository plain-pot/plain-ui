import './tag.scss'
import tag from './tag'
import input from './tag-input'
import {installPlugin} from "@/util/install";

export default installPlugin([
    tag,
    input,
])