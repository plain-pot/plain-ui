import './card.scss'
import card from './card'
import content from './card-content'
import header from './card-header'
import {installPlugin} from "@/util/install";

export default installPlugin([
    card,
    content,
    header,
])