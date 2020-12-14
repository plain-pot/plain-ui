import Collapse from './collapse'
import CollapseGroup from './collapse-group'
import {createComponentPlugin} from "../../utils/createComponentPlugin";
import CollapseTransition from './collapse-transition'

export default createComponentPlugin(Collapse, {
    exposeComponents: {
        CollapseTransition,
        CollapseGroup,
    },
})