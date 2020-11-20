import Collapse from './collapse'
import {createComponentPlugin} from "../../utils/createComponentPlugin";
import collapseTransition from './collapse-transition'

const CollapseTransition = createComponentPlugin(collapseTransition)

export default createComponentPlugin(Collapse, [
    CollapseTransition
])