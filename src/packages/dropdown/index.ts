import Dropdown from './dropdown'
import menu from './dropdown-menu'
import group from './dropdown-group'
import option from './dropdown-option'
import './dropdow.scss'

import {createComponentPlugin} from "../../utils/createComponentPlugin";

const DropdownMenu = createComponentPlugin(menu)
const DropdownGroup = createComponentPlugin(group)
const DropdownOption = createComponentPlugin(option)

export default {
    DropdownMenu,
    ...createComponentPlugin(Dropdown, [
        DropdownMenu,
        DropdownGroup,
        DropdownOption,
    ]),
}