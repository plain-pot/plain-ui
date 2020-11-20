import Collapse from './collapse'
import group from './collapse-group'
import {createComponentPlugin} from "../../utils/createComponentPlugin";
import collapseTransition from './collapse-transition'

const CollapseTransition = createComponentPlugin(collapseTransition)
const CollapseGroup = createComponentPlugin(group)

export default {
    CollapseTransition,
    CollapseGroup,
    ...createComponentPlugin(Collapse, [
        CollapseTransition,
        CollapseGroup
    ]),
}