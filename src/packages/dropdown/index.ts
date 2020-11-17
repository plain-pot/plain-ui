import Dropdown from './dropdown'
import group from './dropdown-group'
import {createComponentPlugin} from "../../utils/createComponentPlugin";

const DropdownGroup = createComponentPlugin(group)

export default {
    DropdownGroup,
    ...createComponentPlugin(Dropdown, [DropdownGroup]),
}