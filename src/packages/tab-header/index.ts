import './tab-header.scss'
import header from './tab-header'
import item from './tab-header-item'
import {installPlugin} from "@/util/install";

export default installPlugin([
    header,
    item,
])