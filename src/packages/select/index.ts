import select from './select'
import SelectOption from './select-option'
import SelectGroup from './select-group'
import SelectPanel from './select-panel'
import SelectService from './select-service'
import {createComponentPlugin} from "../../utils/createComponentPlugin";
import Dropdown from '../dropdown'

export default createComponentPlugin(select, {
    exposeComponents: {
        SelectOption,
        SelectGroup,
        SelectPanel,
    },
    plugins: [
        Dropdown,
        SelectService,
    ],
    expose: {
        SelectService
    },
})