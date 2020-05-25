import './dropdown.scss'
import dropdown from './dropdown'
import content from './sub/dropdown-content'
import service from './dropdown-service'
import group from './sub/dropdown-group'
import menu from './sub/dropdown-menu'
import item from './sub/dropdown-item'

import {installPlugin} from "@/util/install";

export default installPlugin([
    dropdown,
    content,
    group,
    menu,
    item,
], [
    service,
])