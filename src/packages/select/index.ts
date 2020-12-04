import select from './select'
import option from './select-option'
import group from './select-group'
import panel from './select-panel'
import Service from './select-service'
import {createComponentPlugin} from "../../utils/createComponentPlugin";
import Dropdown from '../dropdown'

const SelectOption = createComponentPlugin(option)
const SelectGroup = createComponentPlugin(group)
const SelectPanel = createComponentPlugin(panel)

export default {
    SelectOption,
    SelectGroup,
    SelectPanel,
    ...createComponentPlugin(select, [
        SelectOption,
        SelectGroup,
        SelectPanel,
        Dropdown,
        Service,
    ]),
}