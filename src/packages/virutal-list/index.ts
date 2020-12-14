import Scroll from '../scroll'
import VirtualList from './virtual-list'
import {createComponentPlugin} from "../../utils/createComponentPlugin";

export default createComponentPlugin(VirtualList, {
    plugins: [
        Scroll
    ]
})