import './scroll.scss'
import scroll from './scroll'
import scrollSticky from './scroll-sticky'
import {installPlugin} from "@/util/install";

export default installPlugin([
    scroll,
    scrollSticky,
])