import select from './select'
import option from './select-option'
import group from './select-group'
import panel from './select-panel'
import {createComponentPlugin} from "../../utils/createComponentPlugin";

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
    ]),
}