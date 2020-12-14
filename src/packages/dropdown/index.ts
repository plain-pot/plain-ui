import Dropdown from './dropdown'
import DropdownMenu from './dropdown-menu'
import DropdownGroup from './dropdown-group'
import DropdownOption from './dropdown-option'
import './dropdow.scss'

import {createComponentPlugin} from "../../utils/createComponentPlugin";

export default createComponentPlugin(Dropdown, {
    exposeComponents: {
        DropdownMenu,
        DropdownGroup,
        DropdownOption,
    }
})